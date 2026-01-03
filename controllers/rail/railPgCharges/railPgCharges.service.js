const pgChargesModels = require('../../../models/Irctc/railPgCharges');
const User = require('../../../models/User');
const EventLogs = require('../../logs/EventApiLogsCommon');
const agentConfig=require('../../../models/AgentConfig')

const addPgCharges = async (req, res) => {
  try {
    const { paymentGatewayProvider, paymentMethod, paymentType, flatFee, percentageFee, companyId } = req.body;
    let userId = req.user._id;
    const existingPgCharges = await pgChargesModels.findOne({ companyId, paymentGatewayProvider, paymentMethod });
    if (existingPgCharges) {
      return {
        response: 'Payment gateway charges for this company and provider already exist'
      }
    }
    let checkIsRole = await User.findById(userId).populate('roleId').exec();
    if (checkIsRole.roleId.name == "Tmc" || checkIsRole.roleId.name == "TMC") {
      let pgChargesInsert = await pgChargesModels.create({
        companyId,
        paymentGatewayProvider,
        paymentType,
        paymentMethod,
        flatFee,
        percentageFee
      });
      pgChargesInsert = await pgChargesInsert.save();
      if (pgChargesInsert) {
        const LogsData = {
          eventName: "PgCharges",
          doerId: req.user._id,
          doerName: checkIsRole.fname,
          companyId: pgChargesInsert.companyId,
          documentId: pgChargesInsert._id,
          description: "Add PgCharges",
          ipAddress: req.user.userIp
        }
        EventLogs(LogsData)
        return {
          data: pgChargesInsert,
          response: "Payment Gateway Charges Insert Sucessfully",
        };
      } else {
        return {
          response: "Payment Gateway Charges Not Added",
        };
      }
    }
    else {
      return {
        response: `User Dont have permision to add Pg Charges Details`
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const editPgcharges = async (req, res) => {
  try {
    const id = req.query.id;
    const updateData = req.body;
    const { paymentGatewayProvider, paymentMethod, paymentType, companyId } = req.body;
    if (!id || !paymentGatewayProvider || !paymentMethod || !paymentType || !companyId) {
      return {
        response: 'Please provide required fields!'
      }
    };
    let data = await pgChargesModels.findById(id);
    console.log(companyId, paymentGatewayProvider, paymentMethod )

    if (!data) { return { response: "No data found" } }
    let checkPaymentMethod = await pgChargesModels.findOne({ companyId:companyId, paymentGatewayProvider:paymentGatewayProvider, paymentMethod:paymentMethod });
    if (!checkPaymentMethod) { return { response: "Change PaymentGetWayProvider" } }
    if (data._id.toString() !== checkPaymentMethod._id.toString()) {
      return { response: `Payment gateway charges for this company and provider already exist` }
    }
    const updatedUserData = await pgChargesModels.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    console.log(req.user._id,"jfeiieirerierieiotwqejio")
    const userData = await User.findById(req?.user?._id)
    if (updatedUserData) {
      const LogsData = {
        eventName: "PgCharges",
        doerId: req.user._id,
        doerName: userData.fname,
        companyId: updatedUserData.companyId,
        documentId: updatedUserData._id,
        oldValue: data,
        newValue: updateData,
        description: "Edit PgCharges",
        ipAddress: req.user.userIp
      }
      EventLogs(LogsData)
      return {
        response: "Update Pg Cherges Sucessfully",
      };
    } else {
      return {
        response: "Pg charges Not Updated",
      };
    }
  } catch (error) {
    console.log(error)
    throw error;
  }
};

const calculatePgCharges = async (req, res) => {
  try {
    const { paymentProviderName, paymentType } = req.query;
    let payementProviderData = await pgCharges.findOne({
      paymentGateway: paymentProviderName,
    });
    let charge;
    switch (paymentType) {
      case "Global":
        charge = payementProviderData.gatewayChargesOnMethod.paymentType
        break;

      case "Upi":
        charge = payementProviderData.gatewayChargesOnMethod.paymentType
        break;

      case "Wallet":
        charge = payementProviderData.gatewayChargesOnMethod.paymentType;
        break;

      case "Card":
        charge = payementProviderData.gatewayChargesOnMethod.paymentType;
        break;

      case "Paylater":
        charge = payementProviderData.gatewayChargesOnMethod.paymentType;
        break;

      case "Emi":
        charge = payementProviderData.gatewayChargesOnMethod.paymentType;
        break;

      case "NetBanking":
        charge = payementProviderData.gatewayChargesOnMethod.paymentType;
        break;

      default:
        charge = null;
        break;
    };
    if (charge) {
      return {
        response: `Payment Charge is ${charge}%`,
        data: charge
      }
    }
    else {
      return {
        response: `${paymentType} not exist in this paymeygateway provider`
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPgCharges = async (req, res) => {
  try {
    let companyId = req.query.companyId;
    let allPaymentMethod = await pgChargesModels.find({ companyId: companyId });
    if (allPaymentMethod) {
      return {
        response: 'All Payment Method Fetch Sucessful',
        data: allPaymentMethod
      }
    } else {
      return {
        response: 'Payment Method Not Found'
      }
    }

  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getAssignPGChargesGroup = async (req, res) => {
  try {
    const { UserId } = req.body; 

    if(!UserId){
      return {
        response : 'Not Found'
      }
    }
    // check user and its role
   let agencyUserId;
   const checkUserRole = await User.findById(UserId)
     .populate("company_ID")
     .populate("roleId");    

   if(checkUserRole){  
    if (checkUserRole?.roleId.name === "Agency") {
      agencyUserId = checkUserRole._id;
    } else {
      const checkAgencyByCompany = await User.find({
        company_ID: checkUserRole.company_ID,
      })
        .populate("company_ID")
        .populate("roleId");
      const agencyUser = checkAgencyByCompany.find(
        (user) => user.roleId.name === "Agency"
      );
      if (agencyUser) {
        agencyUserId = agencyUser._id;
      }
    }
   }
   const getAgentConfig = await agentConfig.findOne({
    userId: agencyUserId,
  }).populate({
    path: "railPayementGateWayIds",
    populate: {
      path: "paymentGatewayIds"
    }
  }).populate({
    path: "agencyGroupId",
    populate: {
      path: "railPgChargesGroup",
      populate: {
        path: "paymentGatewayIds"
      }
    }
  }); 
  if(getAgentConfig && getAgentConfig.railPayementGateWayIds !== null){    
    return {
      data: getAgentConfig?.railPayementGateWayIds?.paymentGatewayIds,
      response: "Fetch Data Sucessfully",
    };
  }else if(getAgentConfig && getAgentConfig.agencyGroupId !== null){
    return {
      data: getAgentConfig?.agencyGroupId?.railPgChargesGroup?.paymentGatewayIds,
      response: "Fetch Data Sucessfully",
    };

  }else{
    return {
      response : 'Not Found'
    }
  }



  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  addPgCharges,
  editPgcharges,
  calculatePgCharges,
  getPgCharges,
  getAssignPGChargesGroup
};
