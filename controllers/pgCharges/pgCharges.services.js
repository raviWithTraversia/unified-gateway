const pgCharges = require("../../models/pgCharges");
const { response } = require("../../routes/registrationRoute");

const addPgCharges = async (req, res) => {
  try {
    const { paymentGatewayProvider, paymentMethod, gatewayChargesOnMethod } =
      req.body;
    let pgChargesInsert = new pgCharges({
      paymentGatewayProvider,
      paymentMethod,
      gatewayChargesOnMethod,
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
      { $set: updateData },
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

module.exports = {
  addPgCharges,
  editPgcharges,
  calculatePgCharges,
};
