const paymentGatewayChargeGroupModels = require("../../models/paymentGatewayChargesGroup");
const paymentGatewayChargeModel = require("../../models/PaymentGatewayCharges");
const agencyGroup = require("../../models/AgencyGroup");

const addPaymentGatewayChargeGroup = async (req, res) => {
  try {
    let {
      paymentGatewayChargeId,
      paymentGatewayGroupName,
      companyId,
      isDefault,
    } = req.body;
    let paymentGatewayChargeGroupNameExist =
      await paymentGatewayChargeGroupModels.findOne({
        companyId: companyId,
        paymentGatewayGroupName: paymentGatewayGroupName,
      });
    console.log(
      paymentGatewayChargeGroupNameExist,
      "<<<<<<<<<<<>>>>>>>>>>>>>>"
    );
    if (paymentGatewayChargeGroupNameExist) {
      return {
        response:
          "Paymentgateway charge group with the same name already exists for this company",
      };
    }
    if (isDefault === true) {
      let checkIsAnydefaultTrue =
        await paymentGatewayChargeGroupModels.updateMany(
          { companyId },
          { isDefault: false }
        );
    }
    const newPaymentGatewayChargeGroup = new paymentGatewayChargeGroupModels({
      paymentGatewayIds: paymentGatewayChargeId,
      paymentGatewayGroupName,
      companyId,
      modifyAt: new Date(),
      modifyBy: req.user._id,
      isDefault,
    });
    const savePaymentGatewayChargeGroupName =
      await newPaymentGatewayChargeGroup.save();
    if (savePaymentGatewayChargeGroupName) {
      return {
        response: "PaymentGatewayCharge Group  Added Sucessfully",
        data: savePaymentGatewayChargeGroupName,
      };
    } else {
      return {
        response: "PaymentGatewayCharge Group Not Added",
      };
    }
  } catch (error) {
    console.log(error);
    throw console.error();
  }
};

const editPaymentGatewayChargeGroup = async (req, res) => {
  try {
    let { id } = req.query;
    let updateData = {
      ...req.body,
    };

    if (updateData?.isDefault === true) {
      let checkIsAnydefaultTrue =
        await paymentGatewayChargeGroupModels.updateMany(
          { companyId: updateData.companyId },
          { isDefault: false }
        );
    }
    let updatePaymentGatewayChargeGroupData =
      await paymentGatewayChargeGroupModels.findByIdAndUpdate(
        id,
        {
          $set: updateData,
          modifyAt: new Date(),
          modifyBy: req.user._id,
        },
        { new: true }
      );
    if (updatePaymentGatewayChargeGroupData) {
      await agencyGroup.findOneAndUpdate(
        { companyId: updateData.companyId, isDefault: true },
        { pgChargesGroupId:id },
        { new: true }
      );
      return {
        response: "PaymentGatewayChargeGroup Updated Sucessfully",
        data: updatePaymentGatewayChargeGroupData,
      };
    } else {
      return {
        response: "PaymentGatewayChargeGroup Data Not Updated",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPaymentGatewayChargeGroup = async (req, res) => {
  try {
    let companyId = req.query.companyId;
    let gatewayChargeGroup;
  
    gatewayChargeGroup = await paymentGatewayChargeGroupModels.find({
      companyId: companyId,
    });

    for (let i = 0; i < gatewayChargeGroup.length; i++) {
      let convertedFareRuleIds = gatewayChargeGroup[i].paymentGatewayIds.map(
        (id) => id.toString()
      );
      let documents = await paymentGatewayChargeModel
        .find({ _id: { $in: convertedFareRuleIds } })
        .populate("companyId")
        .exec();
      gatewayChargeGroup[i].paymentGatewayIds = documents;
    }

    if (gatewayChargeGroup.length > 0) {
      return {
        response: "PaymentGateway Group Fetch Sucessfully",
        data: gatewayChargeGroup,
      };
    } else {
      return {
        response: "PaymentGateway Group Not Found",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deletePaymentGatewayChargeGroup = async (req, res) => {
  try {
    let id = req.query.id;
    let deleteData = await paymentGatewayChargeGroupModels.findByIdAndDelete(
      id
    );
    if (deleteData) {
      return {
        response: "Data deleted sucessfully",
      };
    } else {
      return {
        response: "PaymentGatewayChargeGroup data not found for this id",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};



module.exports = {
  addPaymentGatewayChargeGroup,
  editPaymentGatewayChargeGroup,
  getPaymentGatewayChargeGroup,
  deletePaymentGatewayChargeGroup,
};
