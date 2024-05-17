const pgCharges = require("../../models/pgCharges");
const Role = require ('../../models/Role');
const User = require('../../models/User')
const Company = require("../../models/Company");
const Users = require("../../models/User");
const Supplier = require("../../models/Supplier");
const agentConfig = require("../../models/AgentConfig");
const pgchargesGroup = require("../../models/paymentGatewayChargesGroup");
const addPgCharges = async (req, res) => {
  try {
    const {paymentGatewayProvider, paymentMethod, gatewayChargesOnMethod, gatewayFixchargesOnMethod,companyId } = req.body;
     let userId = req.user._id;
     const existingPgCharges = await pgCharges.findOne({ companyId, paymentGatewayProvider });
     if(existingPgCharges){
      return {
        response : 'Payment gateway charges for this company and provider already exist'
      }
     }
     let checkIsRole =  await User.findById(userId).populate('roleId').exec();

     
     if(checkIsRole.roleId.name == "Tmc" || checkIsRole.roleId.name == "TMC" ){
        let pgChargesInsert =  await pgCharges.create({
        companyId,
        paymentGatewayProvider,
        paymentMethod,
        gatewayChargesOnMethod,
        gatewayFixchargesOnMethod
      });
    pgChargesInsert = await pgChargesInsert.save();
    if (pgChargesInsert) {
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
   else{
    return {
        response : `User Dont have permision to add Pg Charges Details`
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
   const checkUserRole = await Users.findById(UserId)
     .populate("company_ID")
     .populate("roleId");    

   if(checkUserRole){  
    if (checkUserRole?.roleId.name === "Agency") {
      agencyUserId = checkUserRole._id;
    } else {
      const checkAgencyByCompany = await Users.find({
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
    path: "paymentGatewayIds",
    populate: {
      path: "paymentGatewayIds"
    }
  }).populate({
    path: "agencyGroupId",
    populate: {
      path: "pgChargesGroupId",
      populate: {
        path: "paymentGatewayIds"
      }
    }
  }); 
  if(getAgentConfig && getAgentConfig.paymentGatewayIds !== null){    
    return {
      data: getAgentConfig?.paymentGatewayIds?.paymentGatewayIds,
      response: "Fetch Data Sucessfully",
    };
  }else if(getAgentConfig && getAgentConfig.agencyGroupId !== null){
    return {
      data: getAgentConfig?.agencyGroupId?.paymentGatewayIds?.paymentGatewayIds,
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

const editPgcharges = async (req, res) => {
  try {
    const id = req.query.id;
    const updateData = req.body;
    const updatedUserData = await pgCharges.findByIdAndUpdate(
      id,
      {
        $set: updateData,
    },
      { new: true }
    );
    if (updatedUserData) {
      return {
        response: "Update Pg Cherges Sucessfully",
      };
    } else {
      return {
        response: "Pg charges Not Updated",
      };
    }
  } catch (error) {
    console.log(error);
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
     if(charge){
        return {
            response : `Payment Charge is ${charge}%`,
            data : charge
        }
     }
     else{
        return {
            response : `${paymentType} not exist in this paymeygateway provider`
        }
     }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPgCharges = async (req,res) => {
    try{
    let companyId = req.query.companyId;
    let allPaymentMethod = await pgCharges.find({companyId : companyId});
    if(allPaymentMethod){
        return {
            response : 'All Payment Method Fetch Sucessful',
            data : allPaymentMethod
        }
    }else{
        return {
            response : 'Payment Method Not Found'
        }
    }

    }catch(error){
      console.log(error);
      throw error;
    }
};



module.exports = {
  addPgCharges,
  getAssignPGChargesGroup,
  editPgcharges,
  calculatePgCharges,
  getPgCharges
};
