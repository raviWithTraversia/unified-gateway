const fareRuleGroupModels = require("../../models/FareRuleGroup");
const fareRuleModel = require("../../models/FareRules");

const addFareRuleGroup = async (req, res) => {
  try {
    let {
      fareRuleIds,
      fareRuleGroupName,
      fareRuleGroupDescription,
      companyId,
      isDefault
    } = req.body;
    let fareRuleGroupNameExist = await fareRuleGroupModels.findOne({companyId,fareRuleGroupName});
    if(fareRuleGroupNameExist){
      return {
        response :'Fare rule group with the same name already exists for this company'
      }
    };
    if(isDefault === true){
      let checkIsAnydefaultTrue = await fareRuleGroupModels.updateMany({companyId} ,{isDefault : false});
    }
    const newFareRuleGroup = new fareRuleGroupModels({
      fareRuleIds,
      fareRuleGroupName,
      fareRuleGroupDescription,
      companyId,
      modifyAt: new Date(),
      modifyBy: req.user._id,
      isDefault
    });
    const saveFareRuleGroup = await newFareRuleGroup.save();
    if (saveFareRuleGroup) {
      return {
        response: "FareRule Group Added Sucessfully",
        data: saveFareRuleGroup,
      };
    } else {
      return {
        response: "FareRule Group Not Added",
      };
    }
  } catch (error) {
    console.log(error);
    throw console.error();
  }
};

const editFareRuleGroup = async (req, res) => {
  try {
    let { id } = req.query;
    let updateData = {
      ...req.body
    };

    if(updateData?.isDefault === true){
      let checkIsAnydefaultTrue = await fareRuleGroupModels.updateMany({companyId: updateData.companyId} ,{isDefault : false});
    }
    let updateFareRuleData = await fareRuleGroupModels.findByIdAndUpdate(
      id,
      {
        $set: updateData,
        modifyAt: new Date(),
        modifyBy: req.user._id,
      },
      { new: true }
    );
    if (updateFareRuleData) {
      return {
        response: "Fare rule Updated Sucessfully",
        data: updateFareRuleData,
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

const getFareRuleGroup = async (req, res) => {
  try {
    const { ObjectId } = require('mongoose').Types; 
    let companyId = req.query.companyId;
    let getFareRule ;
    try {
      getFareRule = await fareRuleGroupModels.find({ companyId: companyId });
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>",getFareRule, "<<<<<<<<<<<")

      for (let i = 0; i < getFareRule.length; i++) {      
          let convertedFareRuleIds = getFareRule[i].fareRuleIds.map(id => id.toString());
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",convertedFareRuleIds)
      
          let documents = await fareRuleModel.find({ _id: { $in: convertedFareRuleIds } })
              .populate("providerId", "supplierCode")
              .populate("airlineCodeId", "airlineCode airlineName")
              .populate("fareFamilyId", "fareFamilyCode fareFamilyName")
              .populate("cabinclassId", 'cabinClassCode cabinClassName')
              .exec();      
          getFareRule[i].fareRuleIds = documents;
      }
   
    } catch (err) {
      retur
      console.error(err);
    }
    if (getFareRule) {
      return {
        response: "Fare Rule Fetch Sucessfully",
        data: getFareRule,
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

const deleteFareRuleGroup = async (req, res) => {
  try {
    let id = req.query.id;
    let deleteData = await fareRuleGroupModels.findByIdAndDelete(id);
    if(deleteData){
      return{
        response : 'Data deleted sucessfully'
      }
    }else{
      return{
        response : 'Farerule Group data not found for this id'
      }
    }

  } catch (error) {
    console.log(error);
    throw error
  }
};

module.exports = {
  addFareRuleGroup,
  editFareRuleGroup,
  getFareRuleGroup,
  deleteFareRuleGroup,
};
