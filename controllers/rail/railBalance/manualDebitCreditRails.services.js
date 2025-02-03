const User = require("../../../models/User");
const agentConfig = require("../../../models/AgentConfig");
const Company=require('../../../models/Company')
const creditRequest = require("../../../models/CreditRequest");
const EventLogs = require('../../logs/EventApiLogsCommon');
const ledgerRail = require("../../../models/Irctc/ledgerRail");
const { priceRoundOffNumberValues } = require("../../commonFunctions/common.function");
const axios = require("axios");
const mongoose=require('mongoose')
const { response } = require("../../../routes/railRoute");
const transaction = require("../../../models/transaction");
const Deposite=require('../../../models/DepositRequest')
const ledger=require('../../../models/Ledger')



const manualDebitCredit = async (req, res) => {
    try {
      let { userId, amountStatus, amount,pgCharges, product, remarks,ApplyDI,easeBuzzSuccessReponse } = req.body;
      if (!userId) {
        return { response: "User id does not exist" }
      }
      amount=parseInt(amount)
      let amountforDI = amount;
      if(pgCharges){
        amount = amount + parseInt(pgCharges);
      }else{
        amount = amount;
      }
      
      const doerId = req.user._id;
      const loginUser = await User.findById(doerId);
      if (amountStatus == "credit") {
        const findUser = await User.findById(userId);

        if (easeBuzzSuccessReponse && easeBuzzSuccessReponse?.status == "success") {
          await transaction.create({
            userId: userId,
            companyId: findUser.company_ID,
            trnsNo: easeBuzzSuccessReponse?.txnid,
            trnsType: "DEBIT",
            paymentMode: easeBuzzSuccessReponse?.mode,
            paymentGateway: "EaseBuzz",
            trnsStatus: "success",
            transactionBy: userId,
            transactionAmount: easeBuzzSuccessReponse?.amount,
            pgCharges: pgCharges ?? "",
          });
        }
        const configData = await agentConfig.findOne({ userId }).populate('diSetupIds').populate({
          path: 'diSetupIds',
          populate: {
            path: 'diSetupIds', 
            model: 'diSetup'
          }
        });
        if (!configData) {
          return {
            response: 'User not found'
          }
        }
        let DIdata; // = await recieveDI(configData, findUser, product, amount, loginUser._id);
        // if(ApplyDI == true){
        //   DIdata = 0;
        // }else{
        //   DIdata = await recieveDI(configData, findUser, product, amountforDI, loginUser._id);
        // }

        if (product === "Rail") {
          configData.railCashBalance += amount;
          runningAmount = await priceRoundOffNumberValues(configData.railCashBalance)
        }
       
        await configData.save();
        const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
        await ledgerRail.create({
          userId: findUser._id,
          companyId: findUser.company_ID,
          ledgerId: ledgerId,
          transactionAmount: amount,
          currencyType: "INR",
          fop: "CREDIT",
          transactionType: "CREDIT",
          runningAmount,
          remarks,
          transactionBy: loginUser._id,
          product
        });
  
        if(pgCharges){
          await ledgerRail.create({
            userId: findUser._id,
            companyId: findUser.company_ID,
            ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
            transactionAmount: pgCharges,
            currencyType: "INR",
            fop: "DEBIT",
            transactionType: "DEBIT",
            runningAmount:runningAmount - parseInt(pgCharges),
            remarks: "Wallet debited for PG charges(EaseBuzz)",
            transactionBy: loginUser._id,
          });
          await agentConfig.findOneAndUpdate(
            { userId: userId },
            { railCashBalance: await priceRoundOffNumberValues(runningAmount - parseInt(pgCharges) )},
            {new:true}
          );
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


          let tdsAmount = parseInt(DIdata) * (2/100);
          if(tdsAmount != 0){
            const findUser = await User.findById(userId);
            const configData = await agentConfig.findOne({ userId });
            if (!configData) {
              return {
                response: 'User not found'
              }
            }
            if (product === "Rail") {
              if (configData?.railCashBalance < amount) {
                console.log('djfie')
                return { response: "Insufficient Balance" }
              }
            //   configData.railCashBalance -= tdsAmount;
            //   runningAmount = configData.railCashBalance
            // }
            }
            // if (product === "Flight") {
            //   if (configData?.maxcreditLimit < amount) {
            //     return { response: "Insufficient Balance" }
            //   }
            //   configData.maxcreditLimit -= tdsAmount;
            //   runningAmount = configData.maxcreditLimit
            // }
            await configData.save();
            // const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
            // await ledgerRail.create({
            //   userId: findUser._id,
            //   companyId: findUser.company_ID,
            //   ledgerId: ledgerId,
            //   transactionAmount: tdsAmount,
            //   currencyType: "INR",
            //   fop: "DEBIT",
            //   transactionType: "DEBIT",
            //   runningAmount,
            //   remarks: `TDS against ${tdsAmount} DI deposit.`,
            //   transactionBy: loginUser._id,
            //   product
            // });
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
          if (configData?.railCashBalance < amount) {
            return { response: "Insufficient Balance" }
          }
          configData.railCashBalance -= amount;
          runningAmount = configData.railCashBalance
        }
        
        await configData.save();
        const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); 
        await ledgerRail.create({
          userId: findUser._id,
          companyId: findUser.company_ID,
          ledgerId: ledgerId,
          transactionAmount: amount,
          currencyType: "INR",
          fop: "DEBIT",
          transactionType: "DEBIT",
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


  const recieveDI = async (configData, findUser, product, amount, transactionBy) => {
    try{
      console.log("jksds");
    configData.diSetupIds.diSetupIds = await configData.diSetupIds.diSetupIds.filter(diSetup =>
      diSetup.status === true &&
      // diSetup.companyId.toString() === findUser.company_ID.toString() &&
      new Date() >= new Date(diSetup.validFromDate) &&
      new Date() <= new Date(diSetup.validToDate)
    );
    // console.log(configData?.diSetupIds?.diSetupIds,"hjshsah");
    let slabOptions = configData?.diSetupIds?.diSetupIds;
    let bonusAmount = 0; 
    let isMultipleSlab = false;
    let slabBreakups = [];
    // console.log(slabOptions,"slabOptions111");
    if (slabOptions[slabOptions.length - 1]?.minAmount < amount) {
      bonusAmount = (parseInt(slabOptions[slabOptions.length - 1]?.diPersentage) / 100) * amount;
      slabBreakups.push(slabOptions[slabOptions.length - 1]);
      // console.log(bonusAmount,"bonusAmount1");
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
          let restAmount = amount - slabOptions[i - 1]?.minAmount || 0;
          let restAmountBonus = ((parseInt(slabOptions[i]?.diPersentage) || 0) / 100) * restAmount;
          bonusAmount = mainAmountBonus + restAmountBonus;
        
          // console.log(bonusAmount,mainAmountBonus,restAmountBonus,'bonusAmount2');
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
    // console.log(bonusAmount,"bonusAmount11");
    const ADRdata = new AgentDiRecieve({
      userId: findUser._id,
      companyId: findUser.company_ID,
      amountDeposit: amount,
      diAmount: bonusAmount,
      slabBreakups: slabBreakups
    });
    // console.log(slabBreakups,"slabBreakups1")
    if (slabBreakups.length) {
      await ADRdata.save();
      const ledgerIds = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
      if (product === "Rail") {
        configData.railCashBalance += bonusAmount;
        runningAmount = await priceRoundOffNumberValues(configData.railCashBalance)
      }
      if (product === "Flight") {
        configData.maxcreditLimit += bonusAmount;
        runningAmount = await priceRoundOffNumberValues(configData.maxcreditLimit)
      }
      await configData.save();
      await ledgerRail.create({
        userId: findUser._id,
        companyId: findUser.company_ID,
        ledgerId: ledgerIds,
        transactionAmount: bonusAmount,
        currencyType: "INR",
        fop: "CREDIT",
        transactionType: "CREDIT",
        runningAmount,
        remarks: `DI against ${amount} deposit.`,
        transactionBy,
        product
      });
    }
    return bonusAmount;
  }catch(error){
    return null
  }
  }
  
  const createLeadger = async(getuserDetails,item,currencyType,fop,transactionType,runningAmount,remarks)=>{
    try{
      await ledgerRail.create({
        userId: getuserDetails._id,
        companyId: getuserDetails.company_ID._id,
        ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
        transactionAmount:
          item?.offeredPrice +
          item?.totalMealPrice +
          item?.totalBaggagePrice +
          item?.totalSeatPrice,
        currencyType: currencyType,
        fop: fop,
        transactionType: transactionType,
        runningAmount: runningAmount,
        remarks: remarks,
        transactionBy: getuserDetails._id,
        cartId: item?.BookingId,
      });
    }catch(error){
      return {
        IsSucess: false,
        response: "Error creating leadger:",
        error,
      };
    }
  }


  const agentPerformanceReport = async (req, res) => {
    try {
        const { parentId } = req.params;
        if (!parentId) return { response: "ID not found" };

       
        let agency;
  
      const userId = new mongoose.Types.ObjectId(req.user._id);
      const userData = await User.findById(userId).populate("roleId");
  
      const findTmcUser = await Company.findById(parentId);
      let matchingData = {};
      if (findTmcUser.type == "TMC" && userData.roleId.type == "Default") {
        agency = await Company.find();
        matchingData = { $sort: { "userId": -1 } };
      } else if (findTmcUser.type == "TMC" && userData.roleId.type == "Manual") {
        agency = await Company.find();
        matchingData = {
          $match: {
            $and: [
              { "agentconfigurations.salesInchargeIds": userId }  // Apply salesInchargeIds condition
            ]
          }
        };
      } else {
        agency = await Company.find({
          $or: [
            { parent: parentId },
            { _id: parentId }
          ]
        });
        matchingData = { $sort: { "userId": -1 } };
      }
  
      if (agency.length == 0) {
        return {
          response: 'No Agency with this TMC'
        };
      }
  
      const ids = agency.map(item => new mongoose.Types.ObjectId(item._id));
  
      const users = await User.aggregate([
        { $match: { company_ID: { $in: ids } } },
        {
          $lookup: {
            from: 'companies',
            localField: 'company_ID',
            foreignField: '_id',
            as: 'company_ID'
          }
        },
        { $unwind: { path: '$company_ID', preserveNullAndEmptyArrays: true } },
        {
          $match: { "company_ID.type": { $ne: "TMC" } }
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'roleId',
            foreignField: '_id',
            as: 'roleId'
          }
        },
        {
          $unwind: {
            path: '$roleId',
            preserveNullAndEmptyArrays: true
          }
        },
        { $match: { "roleId.type": { $eq: "Default" } } },
        {
          $lookup: {
            from: "transactiondetails",
            localField: "_id",
            foreignField: "userId",
            as: "TransactionDate"
          }
        },
        {
          $lookup: {
            from: "leadgers",
            localField: "_id",
            foreignField: "userId",
            as: "Deposite"
          }
        },
        {
          $lookup: {
            from: "agentconfigurations",
            localField: "_id",
            foreignField: "userId",
            as: "agentconfigurations"
          }
        },
        { $unwind: { path: "$agentconfigurations", preserveNullAndEmptyArrays: true } },
        matchingData,
        { $unwind: { path: "$TransactionDate", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$Deposite", preserveNullAndEmptyArrays: true } },
        {
          $sort: {
            'TransactionDate': -1,
          }
        },
        {
          $group: {
            _id: "$_id",
            company_ID: {
              $first: {
                _id: "$company_ID._id",
                companyName: "$company_ID.companyName",
              }
            },
            phoneNumber: { $first: "$phoneNumber" },
            email: { $first: "$email" },
            title: { $first: "$title" },
            fname: { $first: "$fname" },
            lastName: { $first: "$lastName" },
            lastModifiedDate: { $first: "$lastModifiedDate" },
            last_LoginDate: { $first: "$last_LoginDate" },
            userId: { $first: "$userId" },
            salesInchargeId: { $first: "$agentconfigurations.salesInchargeIds" },
            DepositeDate: { $first: "$Deposite.updatedAt" },
            TransactionDate: { $first: "$TransactionDate.updatedAt" }
          }
        },
        {$sort:{userId:1}},
      ], { allowDiskUse: true });
  
      
        
       
        
        await Promise.all(users.map(async (element) => {
            const depositData = await getLatestCreditTransaction(element._id);
            if (depositData) element.DepositeDate = depositData.updatedAt;
        }));

        return users.length ? { response: "Agent Data Found Successfully", data: users } : { response: "Data not found" };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getLatestCreditTransaction = async (userId) => {
    try {
        const [latestRailTransaction, latestFlightTransaction] = await Promise.all([
            ledgerRail.findOne({ userId, transactionType: "CREDIT" }).sort({ createdAt: -1 }).lean(),
            ledger.findOne({ userId, transactionType: "CREDIT" }).sort({ createdAt: -1 }).lean()
        ]);
        
        if (!latestRailTransaction) return latestFlightTransaction;
        if (!latestFlightTransaction) return latestRailTransaction;
        return new Date(latestRailTransaction.createdAt) > new Date(latestFlightTransaction.createdAt) ? latestRailTransaction : latestFlightTransaction;
    } catch (error) {
        console.error("Error fetching latest credit transaction:", error);
        throw error;
    }
};

  
  module.exports = {
    
    manualDebitCredit,
    agentPerformanceReport
  };