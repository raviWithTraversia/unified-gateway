const User = require("../../models/User");
const agentConfig = require("../../models/AgentConfig");
const creditRequest = require("../../models/CreditRequest");
const EventLogs = require("../logs/EventApiLogsCommon");
 const Railledger=require('../../models/Irctc/ledgerRail')
const ledger = require("../../models/Ledger");
const {
  recieveDI,
  priceRoundOffNumberValues,
} = require("../commonFunctions/common.function");
const axios = require("axios");
const { response } = require("../../routes/balanceManageRoute");
const transaction = require("../../models/transaction");



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
  const checkuserIdIdExistfind = await User.find({
    company_ID: userId,
  }).populate("roleId");
  const userWithAgencyRole = checkuserIdIdExistfind.find(
    (user) => user.roleId.name === "Agency"||user.roleId.name === "Distributer"
  );
  const checkuserIdIdExistId = userWithAgencyRole
    ? userWithAgencyRole._id
    : null;
  const checkuserIdIdExist = await User.findById(checkuserIdIdExistId);

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
console.log(getAgentConfig,"djie")
const flightDiAmount=getAgentConfig.flightDiamount||0;
const RailDiamount=getAgentConfig.RailDiamount||0;
  const getcreditRequest = await creditRequest.find({
    agencyId: checkuserIdIdExist.company_ID,
    expireDate: { $gte: new Date() }, // Assuming "expireDate" is a date field and you want to find requests that haven't expired yet
    status: "approved",
    product: "Flight",
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
        smsBalance: getAgentConfig.smsBalance,
        RailBalance:getAgentConfig.railCashBalance,
        tempBalance: totalAmount ?? 0,
        expireDate: expireDate,
      },
    };
  } else {
    return {
      response: "Fetch Data Successfully",
      data: {
        cashBalance: getAgentConfig.maxcreditLimit,
        smsBalance: getAgentConfig.smsBalance,
        RailBalance:getAgentConfig.railCashBalance,
        tempBalance: 0,
        expireDate: "",
      },
    }; 
  }
};

const manualDebitCredit = async (req, res) => {
  try {
    let {
      userId,
      amountStatus,
      amount,
      pgCharges,
      product,
      remarks,
      bookingId,
      ApplyDI,
      easeBuzzSuccessReponse,
    } = req.body;
    if (!userId) {
      return { response: "User id does not exist" };
    }
    amount = parseInt(amount) // converting to number
    let amountforDI = amount;
    if (pgCharges) {
      console.log(amount,"amount")
      amount = amount + parseInt(pgCharges);
    } else {
      amount = amount;
    }
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
    const doerId = req.user._id;
    const loginUser = await User.findById(doerId);
    if (amountStatus == "credit") {
      const configData = await agentConfig
        .findOne({ userId })
        .populate("diSetupIds")
        .populate({
          path: "diSetupIds",
          populate: {
            path: "diSetupIds", // If diSetupIds contains another reference
            model: "diSetup",
          },
        });
      if (!configData) {
        return {
          response: "User not found",
        };
      }
      // console.log(configData,"configData",findUser,"findUser",product,"product");
      let DIdata; // = await recieveDI(configData, findUser, product, amount, loginUser._id);
      if (ApplyDI == true) {
        DIdata = 0;
      } else {
        DIdata = await recieveDI(
          configData,
          findUser,
          product,
          amountforDI,
          loginUser._id,
          easeBuzzSuccessReponse?.txnid ?? ""
        );
      }
      // console.log(DIdata,"DIdata");
      if (product === "Rail") {
        configData.railCashBalance += amount;
        runningAmount = await priceRoundOffNumberValues(
          configData.railCashBalance
        );
      }
      if (product === "Flight") {
        configData.maxcreditLimit += amount;
        runningAmount = await priceRoundOffNumberValues(
          configData.maxcreditLimit
        );
      }
      if (product.toUpperCase() === "SMS") {
       const sms= pgCharges?amount-pgCharges:amount;
        configData.smsBalance +=sms;
        runningAmount = await priceRoundOffNumberValues(
          configData.maxcreditLimit
        );
         }
      await configData.save();

      
      if(!product.toUpperCase()==="SMS"||product === "Flight"){
console.log('shdadajeieien')
      const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
      await ledger.create({
        userId: findUser._id,
        companyId: findUser.company_ID,
        ledgerId: ledgerId,
        transactionId: easeBuzzSuccessReponse?.txnid ?? null,
        transactionAmount: amount,
        currencyType: "INR",
        fop: "CREDIT",
        transactionType: "CREDIT",
        runningAmount,
        remarks,
        transactionBy: loginUser._id,
        cartId:bookingId||" ",
        product,
      });
    }
      if (pgCharges) {
        await ledger.create({
          userId: findUser._id,
          companyId: findUser.company_ID,
          ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
          transactionId: easeBuzzSuccessReponse?.txnid ?? null,
          transactionAmount: pgCharges,
          currencyType: "INR",
          fop: "DEBIT",
          transactionType: "DEBIT",
          runningAmount: runningAmount - parseInt(pgCharges),
          remarks: "Manual AUTO_PGcharges(EaseBuzz)",
          transactionBy: loginUser._id,
          cartId:bookingId||" "
        });
        await agentConfig.findOneAndUpdate(
          { userId: userId },
          {
            maxcreditLimit: await priceRoundOffNumberValues(
              runningAmount - parseInt(pgCharges)
            ),
          },
          { new: true }
        );
      }

      const LogsData = {
        eventName: "creditRequest",
        doerId: loginUser._id,
        doerName: loginUser.fname,
        companyId: findUser.company_ID,
        documentId: findUser._id,
        description: "Amount Credited",
      };
      EventLogs(LogsData);
      if (DIdata != null || DIdata != 0) {
        let tdsAmount = parseInt(DIdata) * (2 / 100);
        if (tdsAmount != 0) {
          const findUser = await User.findById(userId);
          const configData = await agentConfig.findOne({ userId });
          if (!configData) {
            return {
              response: "User not found",
            };
          }
          if (product === "Rail") {
            if (configData?.railCashBalance < amount) {
              return { response: "Insufficient Balance" };
            }
            configData.railCashBalance -= tdsAmount;
            runningAmount = configData.railCashBalance;
          }
          if (product === "Flight") {
            if (configData?.maxcreditLimit < amount) {
              return { response: "Insufficient Balance" };
            }
            configData.maxcreditLimit -= tdsAmount;
            runningAmount = configData.maxcreditLimit;
          }
          await configData.save();
          const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
          await ledger.create({
            userId: findUser._id,
            companyId: findUser.company_ID,
            ledgerId: ledgerId,
            transactionId: easeBuzzSuccessReponse?.txnid ?? null,
            transactionAmount: tdsAmount,
            currencyType: "INR",
            fop: "DEBIT",
            transactionType: "DEBIT",
            runningAmount,
            remarks: `Manual AUTO_TDS`,
            transactionBy: loginUser._id,
            cartId:bookingId||" ",
            product,
          });
          const LogsData = {
            eventName: "debitRequest",
            doerId: loginUser._id,
            doerName: loginUser.fname,
            companyId: findUser.company_ID,
            documentId: findUser._id,
            description: "Amount Debited",
          };
          EventLogs(LogsData);
        }
      }
    }
    if (amountStatus == "debit") {
      const findUser = await User.findById(userId);
      const configData = await agentConfig.findOne({ userId });
      if (!configData) {
        return {
          response: "User not found",
        };
      }
      if (product === "Rail") {
        if (configData?.railCashBalance < amount) {
          return { response: "Insufficient Balance" };
        }
        configData.maxRailCredit -= amount;
        runningAmount = configData.railCashBalance;
      }
      if (product === "Flight") {
        if (configData?.maxcreditLimit < amount) {
          return { response: "Insufficient Balance" };
        }
        configData.maxcreditLimit -= amount;
        runningAmount = configData.maxcreditLimit;
      }
      await configData.save();
      const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
      await ledger.create({
        userId: findUser._id,
        companyId: findUser.company_ID,
        ledgerId: ledgerId,
        transactionId: easeBuzzSuccessReponse?.txnid ?? null,
        transactionAmount: amount,
        currencyType: "INR",
        fop: "DEBIT",
        transactionType: "DEBIT",
        runningAmount,
        remarks,
        transactionBy: loginUser._id,
        cartId:bookingId||" ",
        product,
      });
      const LogsData = {
        eventName: "debitRequest",
        doerId: loginUser._id,
        doerName: loginUser.fname,
        companyId: findUser.company_ID,
        documentId: findUser._id,
        description: "Amount Debited",
      };

      // await transaction.create({
      //   userId: loginUser._id,
      //   companyId: findUser.company_ID,
      //   trnsNo: txnid,
      //   trnsType: "DEBIT",
      //   paymentMode: card_type,
      //   paymentGateway:"EaseBuzz",
      //   trnsStatus: "success",
      //   // transactionBy: getuserDetails._id,
      //   pgCharges:pgCharges,
      //   transactionAmount:totalItemAmount,
      //   trnsBankRefNo:bank_ref_num,
      //   // cardType:cardCategory,
      //   bankName:bank_name,
      //   holderName:name_on_card
      // });
      EventLogs(LogsData);
    }
    return { response: "Amount Transfer Successfully" };
  } catch (error) {
    console.log("error inside service: ", error);
    throw error;
  }
};

const DistributermanualDebitCredit = async (req, res) => {
  try {
    let {
      userId,
      amountStatus,
      amount,
      pgCharges,
      product,
      remarks,
      bookingId,
      AgencyId
    } = req.body;
    if (!userId) {
      return { response: "User id does not exist" };
    }
    
    var LeadgerName
    const findUser = await User.findById(userId).populate("company_ID");
    
    const doerId = req.user._id;
    const loginUser = await User.findById(doerId).populate("company_ID");
    if (amountStatus === "credit") {
      
        // Fetch agent and distributer configuration data
        const configData = await agentConfig
          .findOne({ userId })
          .populate("diSetupIds")
          .populate({
            path: "diSetupIds",
            populate: { path: "diSetupIds", model: "diSetup" },
          });
    
        const DistributerConfig = await agentConfig.findOne({ userId: loginUser._id });
    
        if (!DistributerConfig) {
          return { response: "Distributer not found" };
        }
    
        if (!configData) {
          return { response: "User not found" };
        }
    
        const checkBalance = (balance, product) => {
          if (balance < amount) {
            return { response: `Insufficient Balance` };
          }
        };
    
        let insufficientBalanceResponse = null;
        switch (product.toUpperCase()) {
          case "RAIL":
            insufficientBalanceResponse = checkBalance(DistributerConfig.railCashBalance, "Rail");
            break;
          case "FLIGHT":
            insufficientBalanceResponse = checkBalance(DistributerConfig.maxcreditLimit, "Flight");
            break;
          case "SMS":
            insufficientBalanceResponse = checkBalance(DistributerConfig.smsBalance, "SMS");
            break;
          default:
            return { response: "Invalid product type" };
        }
    
        // Return response if balance is insufficient
        if (insufficientBalanceResponse) {
          return insufficientBalanceResponse;
        }
    
        // Perform balance update
        let runningAmountAgent;
        let runningAmountDistributer
        switch (product.toUpperCase()) {
          case "RAIL":
            DistributerConfig.railCashBalance -= amount;
            configData.railCashBalance += amount;
            runningAmountAgent = await priceRoundOffNumberValues(configData.railCashBalance);
            runningAmountDistributer = await priceRoundOffNumberValues(DistributerConfig.railCashBalance);
            LeadgerName=Railledger;

            break;
    
          case "FLIGHT":
            DistributerConfig.maxcreditLimit -= amount;
            configData.maxcreditLimit += amount;
            runningAmountAgent = await priceRoundOffNumberValues(configData.maxcreditLimit);
            runningAmountDistributer = await priceRoundOffNumberValues(DistributerConfig.maxcreditLimit);
            LeadgerName=ledger;
            break;
    
          case "SMS":
            const sms = pgCharges ? amount - pgCharges : amount;
            DistributerConfig.smsBalance -= sms;
            configData.smsBalance += sms;
            runningAmount = await priceRoundOffNumberValues(configData.smsBalance);
            break;
        }
    
        // Save the updated configuration
        await DistributerConfig.save();
        await configData.save();
    
        console.log(runningAmountAgent,"runningAmountAgent")
        console.log(runningAmountDistributer,"runningAmountDistributer")
        // Create ledger entry if the product is not SMS or is Flight
        if (product.toUpperCase() !== "SMS" || product === "Flight") {
          const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000);
          await LeadgerName.create({
            userId: loginUser._id,
            companyId: loginUser.company_ID._id,
            ledgerId,
            transactionId: null,
            transactionAmount: amount,
            currencyType: "INR",
            fop: "DEBIT",
            transactionType: "DEBIT",
            runningAmount:runningAmountDistributer,
            remarks:`Debited from ${loginUser.company_ID.companyName} [${loginUser.userId}] & Credited to ${findUser.company_ID.companyName} [${findUser.userId}] (JV)`,
            transactionBy: loginUser._id,
            cartId: bookingId || " ",
            product,
          });
          await LeadgerName.create({
            userId: findUser._id,
            companyId: findUser.company_ID._id,
            ledgerId,
            transactionId: null,
            transactionAmount: amount,
            currencyType: "INR",
            fop: "CREDIT",
            transactionType: "CREDIT",
            runningAmount: runningAmountAgent,
            remarks:`Debited from ${loginUser.company_ID.companyName} [${loginUser.userId}] & Credited to ${findUser.company_ID.companyName} [${findUser.userId}] (JV)`,
            transactionBy: loginUser._id,
            cartId: bookingId || " ",
            product,
          });
        }
    
        // Log the event
        const LogsData = {
          eventName: "creditRequest",
          doerId: loginUser._id,
          doerName: loginUser.fname,
          companyId: findUser.company_ID._id,
          documentId: findUser._id,
          description: "Amount Credited",
        };
        EventLogs(LogsData);
    
    
      
    }
    
    if (amountStatus == "debit") {
      const configData = await agentConfig.findOne({ userId });
      if (!configData) {
        return {
          response: "User not found",
        };
      }
      const DistributerConfig = await agentConfig.findOne({ userId: loginUser._id });
      if (!DistributerConfig) {
        return { response: "Distributer not found" };
      }
  
      const checkBalance = (balance, product) => {
        if (balance < amount) {
          return { response: `Insufficient Balance` };
        }
      };
  
      let insufficientBalanceResponse = null;
      switch (product.toUpperCase()) {
        case "RAIL":
          insufficientBalanceResponse = checkBalance(configData.railCashBalance, "Rail");
          break;
        case "FLIGHT":
          insufficientBalanceResponse = checkBalance(configData.maxcreditLimit, "Flight");
          break;
        case "SMS":
          insufficientBalanceResponse = checkBalance(configData.smsBalance, "SMS");
          break;
        default:
          return { response: "Invalid product type" };
      }
  
      // Return response if balance is insufficient
      if (insufficientBalanceResponse) {
        return insufficientBalanceResponse;
      }
  
      // Perform balance update
      let runningAmountAgent;
      let runningAmountDistributer


      switch (product.toUpperCase()) {
        case "RAIL":
          configData.railCashBalance -= amount;
          DistributerConfig.railCashBalance += amount;
          runningAmountAgent = await priceRoundOffNumberValues(configData.railCashBalance);
runningAmountDistributer = await priceRoundOffNumberValues(DistributerConfig.railCashBalance);
LeadgerName=Railledger
          break;
  
        case "FLIGHT":
          configData.maxcreditLimit -= amount;
          DistributerConfig.maxcreditLimit += amount;
          runningAmountAgent = await priceRoundOffNumberValues(configData.maxcreditLimit);
          runningAmountDistributer = await priceRoundOffNumberValues(DistributerConfig.maxcreditLimit);
          LeadgerName=ledger;
          break;
  
        case "SMS":
          const sms = pgCharges ? amount - pgCharges : amount;
          configData.smsBalance -= sms;
          DistributerConfig.smsBalance += sms;
          runningAmountAgent = await priceRoundOffNumberValues(configData.smsBalance);
          runningAmountDistributer = await priceRoundOffNumberValues(DistributerConfig.smsBalance);
          break;
      }
  
      // Save the updated configuration
      await DistributerConfig.save();
      await configData.save();
  
      const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
      await LeadgerName.create({
        userId: loginUser._id,
        companyId:loginUser.company_ID._id,
        ledgerId: ledgerId,
        transactionId:  null,
        transactionAmount: amount,
        currencyType: "INR",
        fop: "CREDIT",
        transactionType: "CREDIT",
        runningAmount:runningAmountDistributer,
        remarks:`Debited from ${findUser.company_ID.companyName} [${findUser.userId}]  & Credited to ${loginUser.company_ID.companyName} [${loginUser.userId}] (JV)`,
        transactionBy: loginUser._id,
        cartId:bookingId||" ",
        product,
      });
      await LeadgerName.create({
        userId: findUser._id,
        companyId: findUser.company_ID._id,
        ledgerId,
        transactionId: null,
        transactionAmount: amount,
        currencyType: "INR",
        fop: "DEBIT",
        transactionType: "DEBIT",
        runningAmount:runningAmountAgent,
        remarks:`Debited from ${findUser.company_ID.companyName} [${findUser.userId}]  & Credited to ${loginUser.company_ID.companyName} [${loginUser.userId}] (JV)`,
        transactionBy: loginUser._id,
        cartId: bookingId || " ",
        product,
      });
      const LogsData = {
        eventName: "debitRequest",
        doerId: loginUser._id,
        doerName: loginUser.fname,
        companyId: findUser.company_ID,
        documentId: findUser._id,
        description: "Amount Debited",
      };

      // await transaction.create({
      //   userId: loginUser._id,
      //   companyId: findUser.company_ID,
      //   trnsNo: txnid,
      //   trnsType: "DEBIT",
      //   paymentMode: card_type,
      //   paymentGateway:"EaseBuzz",
      //   trnsStatus: "success",
      //   // transactionBy: getuserDetails._id,
      //   pgCharges:pgCharges,
      //   transactionAmount:totalItemAmount,
      //   trnsBankRefNo:bank_ref_num,
      //   // cardType:cardCategory,
      //   bankName:bank_name,
      //   holderName:name_on_card
      // });
      EventLogs(LogsData);
    }
    return { response: "Amount Transfer Successfully" };
  } catch (error) {
    console.log("error inside service: ", error);
    throw error;
  }
};

// const BalanceTransferRailtoFlight=async(req,res)=>{
// try{
//   const doerId = req.user._id;
//   const getAgentConfig=await agentConfig.findOne({userId:doerId})

//   if(!getAgentConfig){
//     return({
//       response:"agentData not found"
//     })
//   }

//   return {
//     response: "balance Found Succefully",
//     data: getAgentConfig
//   };

//   }catch(error){
//     throw error
//   }
// }

const selfTransfer=async(req,res)=>{
  try{
    const {amount,productto,remarks,bookingId,productfrom}=req.body;
    const doerId = req.user._id;
    const loginUser = await User.findById(doerId);
const configData=await agentConfig.findOne({userId:doerId});


  
    if(!configData){
      return({
        response:"agentData not found"
      })
    }
  
    const checkBalance = (balance, product) => {
      if (balance < amount) {
        return { response: `Insufficient Balance` };
      }
    };

    let insufficientBalanceResponse = null;
    switch (productfrom.toUpperCase()) {
      case "RAIL":
        insufficientBalanceResponse = checkBalance(configData.railCashBalance, "Rail");
        break;
      case "FLIGHT":
        insufficientBalanceResponse = checkBalance(configData.maxcreditLimit, "Flight");
        break;
      case "SMS":
        insufficientBalanceResponse = checkBalance(configData.smsBalance, "SMS");
        break;
      default:
        return { response: "Invalid product type" };
    }

    // Return response if balance is insufficient
    if (insufficientBalanceResponse) {
      return insufficientBalanceResponse;
    }

    // Perform balance update
    let runningAmountDebit;
    let runningAmountCredit;
    const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000);
    switch (productto.toUpperCase()) {
      case "RAIL":
        configData.maxcreditLimit -= amount;
        configData.railCashBalance += amount;
        runningAmountDebit = await priceRoundOffNumberValues(configData.railCashBalance);
        runningAmountCredit = await priceRoundOffNumberValues(configData.maxcreditLimit);
        await ledger.create({
          userId: loginUser._id,
          companyId:loginUser.company_ID,
          ledgerId: ledgerId,
          transactionId:  null,
          transactionAmount: amount,
          currencyType: "INR",
          fop: "DEBIT",
          transactionType: "DEBIT",
          runningAmount:runningAmountCredit,
          remarks:"self Tranfer",
          transactionBy: loginUser._id,
          cartId:bookingId||" ",
          product:"Flight",
        });
        await Railledger.create({
          userId: loginUser._id,
          companyId: loginUser.company_ID,
          ledgerId,
          transactionId: null,
          transactionAmount: amount,
          currencyType: "INR",
          fop: "CREDIT",
          transactionType: "CREDIT",
          runningAmount:runningAmountDebit,
          remarks:"self Tranfer",
          transactionBy: loginUser._id,
          cartId: bookingId || " ",
          product:"RAIL",
        });
      

        break;

      case "FLIGHT":
        configData.maxcreditLimit += amount;
        configData.railCashBalance -= amount;
        runningAmountDebit = await priceRoundOffNumberValues(configData.maxcreditLimit);
        runningAmountCredit = await priceRoundOffNumberValues(configData.railCashBalance);
        await Railledger.create({
          userId: loginUser._id,
          companyId:loginUser.company_ID,
          ledgerId: ledgerId,
          transactionId:  null,
          transactionAmount: amount,
          currencyType: "INR",
          fop: "DEBIT",
          transactionType: "DEBIT",
          runningAmount:runningAmountCredit,
          remarks:"self Tranfer",
          transactionBy: loginUser._id,
          cartId:bookingId||" ",
          product:"Rail",
        });
        await ledger.create({
          userId: loginUser._id,
          companyId: loginUser.company_ID,
          ledgerId,
          transactionId: null,
          transactionAmount: amount,
          currencyType: "INR",
          fop: "CREDIT",
          transactionType: "CREDIT",
          runningAmount:runningAmountDebit,
          remarks:"self Tranfer",
          transactionBy: loginUser._id,
          cartId: bookingId || " ",
          product:"Flight",
        });
      
        break;

      case "SMS":
        const sms = pgCharges ? amount - pgCharges : amount;
        DistributerConfig.smsBalance -= sms;
        configData.smsBalance += sms;
        runningAmount = await priceRoundOffNumberValues(configData.smsBalance);
        break;
    }

    await configData.save();
  
     // Example random number generation

    

    // Save the updated configuration
    return { response: "Amount Transfer Successfully" };

  }catch(error){
    throw error
  }
}


const getBalanceTmc = async (req, res) => {
  try {
    var Url = "";
    var payload = {};
    if (
      req.headers.host == "localhost:3111" ||
      req.headers.host == "kafila.traversia.net"
    ) {
      Url = "http://stage1.ksofttechnology.com/api/Freport";
      payload = {
        P_TYPE: "API",
        R_TYPE: "FLIGHT",
        R_NAME: "FlightAgencyBalance",
        AID: "675923",
        MODULE: "B2B",
        IP: "182.73.146.154",
        TOKEN: "fd58e3d2b1e517f4ee46063ae176eee1",
        ENV: "D",
        Version: "1.0.0.0.0.0",
      };
    } else if (req.headers.host == "agentapi.kafilaholidays.in") {
      Url = "http://fhapip.ksofttechnology.com/api/Freport";
      payload = {
        P_TYPE: "API",
        R_TYPE: "FLIGHT",
        R_NAME: "FlightAgencyBalance",
        AID: "24281223",
        MODULE: "B2B",
        IP: "182.73.146.154",
        TOKEN: "be6e3eb87611e080340d57473b038cae",
        ENV: "P",
        Version: "1.0.0.0.0.0",
      };
    } else {
      return {
        response: "url not found",
      };
    }

    const balanceData = await axios.post(Url, payload);
    if (!balanceData) {
      return {
        response: "balance not found",
      };
    }
    return {
      response: "balance found sucessfully",
      data: balanceData.data,
    };
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getBalance,
  manualDebitCredit,
  getBalanceTmc,
  DistributermanualDebitCredit,
  selfTransfer
};