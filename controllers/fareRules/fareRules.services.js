const fareRulesModel = require("../../models/FareRules");
const FUNC = require("../commonFunctions/common.function");

const addfareRule = async (req, res) => {
  try {
    let {
      companyId,
      origin,
      destination,
      providerId,
      airlineCodeId,
      fareFamilyId,
      cabinclassId,
      travelType,
      validDateFrom,
      validDateTo,
      status,
      desceription,
      rbd,
      fareBasis,
    } = req.body;
    let addRules = new fareRulesModel({
      companyId,
      origin,
      destination,
      providerId,
      airlineCodeId,
      fareFamilyId,
      cabinclassId,
      travelType,
      validDateFrom,
      validDateTo,
      status: status || false,
      desceription,
      fareBasis,
      rbd,
      modifyAt: new Date(),
      modifyBy: req.user._id,
    });
    addRules = await addRules.save();
    if (addRules) {
      return {
        response: "Fare rule add sucessfully",
        data: addRules,
      };
    } else {
      return {
        response: "Fare rule not added",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getFareRule = async (req, res) => {
  try {
    let { companyId } = req.query;
    let fareRuleData = await fareRulesModel
      .find({ companyId: companyId })
      .populate("providerId", "supplierCode")
      .populate("airlineCodeId", "airlineCode airlineName")
      .populate("fareFamilyId", "fareFamilyCode fareFamilyName")
      .populate("cabinclassId", 'cabinClassCode cabinClassName')
    if (fareRuleData) {
      return {
        response: "Fare Rule Fetch Sucessfully",
        data: fareRuleData,
      };
    } else {
      return {
        response: "Fare Rule Not Found",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const deleteFareRule = async (req, res) => {
  try {
    let { id } = req.query.id;
    const removeFareRule = await fareRulesModel.findOneAndRemove(id);
    if (removeFareRule) {
      return {
        response: "Fare Rule Deleted Sucessfully",
      };
    } else {
      return {
        response: "Fare Rule Not Deleted",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateFareRule = async (req, res) => {
  try {
    let { id } = req.query;
    let data = req.body;
    let updateFareRuleData = await fareRulesModel.findByIdAndUpdate(
      id,
      {
        $set: data,
        modifyAt: new Date(),
        modifyBy: req.user._id,
      },
      { new: true }
    );
    if (updateFareRuleData) {
      return {
        response: "Fare rule Updated Sucessfully",
      };
    } else {
      return {
        response: "Fare rule Data Not Updated",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  addfareRule,
  getFareRule,
  deleteFareRule,
  updateFareRule,
};
