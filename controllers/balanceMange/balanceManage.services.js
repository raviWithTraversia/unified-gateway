const User = require("../../models/User");
const agentConfig = require("../../models/AgentConfig");
const creditRequest = require("../../models/CreditRequest");
const EventLogs = require('../logs/EventApiLogsCommon');
const ledger = require("../../models/Ledger");
const { recieveDI } = require("../commonFunctions/common.function");
const axios = require("axios");
const { response } = require("../../routes/balanceManageRoute");

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
    const { userId, amountStatus, amount,pgCharges, product, remarks } = req.body;
    if (!userId) {
      return { response: "User id does not exist" }
    }
    amount = amount + parseInt(pgCharges);
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
      // console.log(configData,"configData",findUser,"findUser",product,"product");
      let DIdata = await recieveDI(configData, findUser, product, amount, loginUser._id);
      // console.log(DIdata,"DIdata");
      if (product === "Rail") {
        configData.maxRailCredit += (amount + DIdata);
        runningAmount = configData.maxRailCredit
      }
      if (product === "Flight") {
        configData.maxcreditLimit += (amount + DIdata);
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

      if(pgCharges){
        await ledger.create({
          userId: findUser._id,
          companyId: findUser.company_ID,
          ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
          transactionAmount: pgCharges,
          currencyType: "INR",
          fop: "DEBIT",
          transactionType: "DEBIT",
          runningAmount:runningAmount- parseInt(pgCharges),
          remarks: "Wallet debited for PG charges(EaseBuzz)",
          transactionBy: loginUser._id,
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
      EventLogs(LogsData);
      if(DIdata !=null || DIdata != 0){
        let tdsAmount = parseInt(DIdata) * (5/100);
        if(tdsAmount != 0){
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
            configData.maxRailCredit -= tdsAmount;
            runningAmount = configData.maxRailCredit
          }
          if (product === "Flight") {
            if (configData?.maxcreditLimit < amount) {
              return { response: "Insufficient Balance" }
            }
            configData.maxcreditLimit -= tdsAmount;
            runningAmount = configData.maxcreditLimit
          }
          await configData.save();
          const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
          await ledger.create({
            userId: findUser._id,
            companyId: findUser.company_ID,
            ledgerId: ledgerId,
            transactionAmount: tdsAmount,
            currencyType: "INR",
            fop: "Debit",
            transactionType: "Debit",
            runningAmount,
            remarks: `TDS against ${tdsAmount} DI deposit.`,
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
      }
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

const getBalanceTmc=async(req,res)=>{
  try{
    var Url=''
    var payload={}
if(req.headers.host=="localhost:3111"||req.headers.host=="kafila.traversia.net"){
Url="http://stage1.ksofttechnology.com/api/Freport";
payload={
  "P_TYPE": "API",
    "R_TYPE": "FLIGHT",
    "R_NAME": "FlightAgencyBalance",
    "AID": "675923",
    "MODULE": "B2B",
    "IP": "182.73.146.154",
    "TOKEN": "fd58e3d2b1e517f4ee46063ae176eee1",
    "ENV": "D",
    "Version": "1.0.0.0.0.0"
}
}
else if(req.headers.host=="agentapi.kafilaholidays.in"){
Url="http://fhapip.ksofttechnology.com/api/Freport";
payload= {"P_TYPE": "API",
"R_TYPE": "FLIGHT",
"R_NAME": "FlightAgencyBalance",
"AID": "24281223",
"MODULE": "B2B",
"IP": "182.73.146.154",
"TOKEN": "be6e3eb87611e080340d57473b038cae",
"ENV": "P",
"Version": "1.0.0.0.0.0"}
}else{
return ({
  response:"url not found"
})
}

const balanceData=await axios.post(Url,payload)
if(!balanceData){
  return({
    response:'balance not found'
  })
}
return({
  response:"balance found sucessfully",
  data:balanceData.data
})
  }catch(error){
    throw error
  }
}
module.exports = {
  getBalance, manualDebitCredit,getBalanceTmc
};
