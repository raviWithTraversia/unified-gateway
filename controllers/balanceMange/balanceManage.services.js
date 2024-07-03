const User = require("../../models/User");
const agentConfig = require("../../models/AgentConfig");
const creditRequest = require("../../models/CreditRequest");
const EventLogs = require('../logs/EventApiLogsCommon');
const ledger = require("../../models/Ledger");
const AgentDiRecieve = require("../../models/AgentDiRecieve");

const getBalance = async (req, res) => {
  const { userId } = req.body;
  const fieldNames = ["userId"];
  const missingFields = fieldNames.filter(
    (fieldName) =>
      req.body[fieldName] === null || req.body[fieldName] === undefined
  );

  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(", ");

    return {
      response: null,
      isSometingMissing: true,
      data: `Missing or null fields: ${missingFieldsString}`,
    };
  }
  if (!userId) {
    return {
      response: "User id does not exist",
    };
  }

  // Check if company Id exists
  const checkuserIdIdExistfind = await User.find({ company_ID: userId }).populate("roleId");
  const userWithAgencyRole = checkuserIdIdExistfind.find(user => user.roleId.name === 'Agency');
  const checkuserIdIdExistId = userWithAgencyRole ? userWithAgencyRole._id : null;
  const checkuserIdIdExist = await User.findById(checkuserIdIdExistId);

  //console.log(checkuserIdIdExist);
  if (!checkuserIdIdExist) {
    return {
      response: "User id does not exist",
    };
  }

  const getAgentConfig = await agentConfig.findOne({
    userId: checkuserIdIdExistId,
  });

  if (!getAgentConfig) {
    return {
      response: "No data found for the given UserId",
    };
  }

  const getcreditRequest = await creditRequest.find({
    agencyId: checkuserIdIdExist.company_ID,
    expireDate: { $gte: new Date() }, // Assuming "expireDate" is a date field and you want to find requests that haven't expired yet
    status: "approved",
    product: "Flight"
  });

  if (getcreditRequest && getcreditRequest.length > 0) {
    let totalAmount = 0;
    getcreditRequest.forEach((request) => {
      totalAmount += request.amount;
    });
    const expireDate = getcreditRequest[0].expireDate;
    // console.log(getcreditRequest);

    return {
      response: "Fetch Data Successfully",
      data: {
        cashBalance: getAgentConfig.maxcreditLimit,
        tempBalance: totalAmount ?? 0,
        expireDate: expireDate,
      },
    };
  } else {
    return {
      response: "Fetch Data Successfully",
      data: {
        cashBalance: getAgentConfig.maxcreditLimit,
        tempBalance: 0,
        expireDate: '',
      },
    };
  }
};

const manualDebitCredit = async (req, res) => {
  try {
    const { userId, amountStatus, amount, product, remarks } = req.body;
    if (!userId) {
      return { response: "User id does not exist" }
    }
    const doerId = req.user._id;
    const loginUser = await User.findById(doerId);
    if (amountStatus == "credit") {
      const findUser = await User.findById(userId);
      const configData = await agentConfig.findOne({ userId }).populate('diSetupIds').populate({
        path: 'diSetupIds',
        populate: {
          path: 'diSetupIds', // If diSetupIds contains another reference
          model: 'diSetup'
        }
      });
      if (!configData) {
        return {
          response: 'User not found'
        }
      }
      configData.diSetupIds.diSetupIds = await configData.diSetupIds.diSetupIds.filter(diSetup =>
        diSetup.status === true &&
        diSetup.companyId.toString() === findUser.company_ID.toString() &&
        new Date() >= new Date(diSetup.validFromDate) &&
        new Date() <= new Date(diSetup.validToDate)
      );
      let slabOptions = configData?.diSetupIds?.diSetupIds;
      let bonusAmount = 0; let isMultipleSlab = false;
      let slabBreakups = [];
      if (slabOptions[slabOptions.length - 1]?.minAmount < amount) {
        bonusAmount = (parseInt(slabOptions[slabOptions.length - 1]?.diPersentage) / 100) * amount;
        slabBreakups.push(slabOptions[slabOptions.length - 1]);
      } else {
        for (let i = 0; i < slabOptions.length; i++) {
          if (!isMultipleSlab) {
            if (slabOptions[i].minAmount == amount) {
              bonusAmount = (parseInt(slabOptions[i].diPersentage) / 100) * amount;
              slabBreakups.push(slabOptions[i]);
              break;
            }
          }
          if (slabOptions[i].minAmount > amount) {
            isMultipleSlab = true;
            let mainAmountBonus = ((parseInt(slabOptions[i - 1]?.diPersentage) || 0) / 100) * (parseInt(slabOptions[i - 1]?.minAmount || 0));
            let restAmount = amount - slabOptions[i - 1]?.minAmount || 0
            let restAmountBonus = ((parseInt(slabOptions[i]?.diPersentage) || 0) / 100) * restAmount;
            bonusAmount = mainAmountBonus + restAmountBonus;
            if (bonusAmount > 0) {
              if (!slabOptions[i - 1]) {
                slabBreakups.push(slabOptions[i])
              } else {
                slabBreakups.push(slabOptions[i - 1], slabOptions[i])
              }
            }
            break;
          }
        }
      }
      const ADRdata = new AgentDiRecieve({
        userId: findUser._id,
        companyId: findUser.company_ID,
        amountDeposit: amount,
        diAmount: bonusAmount,
        slabBreakups: slabBreakups
      });
      if (product === "Rail") {
        configData.maxRailCredit += amount;
        runningAmount = configData.maxRailCredit
      }
      if (product === "Flight") {
        configData.maxcreditLimit += amount;
        runningAmount = configData.maxcreditLimit
      }
      await configData.save();
      const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
      await ledger.create({
        userId: findUser._id,
        companyId: findUser.company_ID,
        ledgerId: ledgerId,
        transactionAmount: amount,
        currencyType: "INR",
        fop: "Credit",
        transactionType: "Credit",
        runningAmount,
        remarks,
        transactionBy: loginUser._id,
        product
      });
      if (slabBreakups.length) {
        await ADRdata.save();
        const ledgerIds = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
        await ledger.create({
          userId: findUser._id,
          companyId: findUser.company_ID,
          ledgerId: ledgerIds,
          transactionAmount: bonusAmount,
          currencyType: "INR",
          fop: "Credit",
          transactionType: "Credit",
          // runningAmount,
          remarks: `Incentive Credited for amount ${amount}`,
          transactionBy: loginUser._id,
          product
        });
      }

      const LogsData = {
        eventName: "creditRequest",
        doerId: loginUser._id,
        doerName: loginUser.fname,
        companyId: findUser.company_ID,
        documentId: findUser._id,
        description: "Amount Credited"
      };
      EventLogs(LogsData)
    }
    if (amountStatus == "debit") {
      const findUser = await User.findById(userId);
      const configData = await agentConfig.findOne({ userId });
      if (!configData) {
        return {
          response: 'User not found'
        }
      }
      if (product === "Rail") {
        if (configData?.maxcreditLimit < amount) {
          return { response: "Insufficient Balance" }
        }
        configData.maxRailCredit -= amount;
        runningAmount = configData.maxRailCredit
      }
      if (product === "Flight") {
        if (configData?.maxcreditLimit < amount) {
          return { response: "Insufficient Balance" }
        }
        configData.maxcreditLimit -= amount;
        runningAmount = configData.maxcreditLimit
      }
      await configData.save();
      const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
      await ledger.create({
        userId: findUser._id,
        companyId: findUser.company_ID,
        ledgerId: ledgerId,
        transactionAmount: amount,
        currencyType: "INR",
        fop: "Debit",
        transactionType: "Debit",
        runningAmount,
        remarks,
        transactionBy: loginUser._id,
        product
      });
      const LogsData = {
        eventName: "debitRequest",
        doerId: loginUser._id,
        doerName: loginUser.fname,
        companyId: findUser.company_ID,
        documentId: findUser._id,
        description: "Amount Debited"
      };
      EventLogs(LogsData)
    }
    return { response: "Amount Transfer Successfully" }
  } catch (error) {
    console.log("error inside service: ", error)
    throw error
  }
}

module.exports = {
  getBalance, manualDebitCredit
};
