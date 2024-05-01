const fareRuleGroupModels = require("../../models/FareRuleGroup");
const fareRuleModel = require("../../models/FareRules");
const Company = require("../../models/Company");
const agentConfig = require("../../models/AgentConfig");
const UserModule = require("../../models/User");
const agencyGroup = require("../../models/AgencyGroup");
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
const getCustomFareRule = async (req, res) => {
  const {    
    CompanyId,
    UserId    
  } = req.body;
  const fieldNames = [
    "CompanyId",
    "UserId"    
  ];
  const missingFields = fieldNames.filter(
    (field) => field === null || field === undefined
  );
  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(", ");
    return {
      response: null,
      isSometingMissing: true,
      data: `Missing or null fields: ${missingFieldsString}`,
    };
  }  
  if (!CompanyId) {
    return {
      response: "Company field are required",
    };
  }

  const userDetails = await UserModule.findOne({ _id:UserId });
  if (!userDetails) {
    return {
      IsSuccess: false,
      response: "User Id Not Available",
    };
  }
  const companyDetails = await Company.findOne({
    _id: userDetails.company_ID,
  }).populate("parent", "type");

  // Check if company Id exists 
  if (!companyDetails) {
    return {
      response: "TMC Compnay id does not exist",
    };
  }
    const assignFareRuleGroup = await getAssignCommercial(companyDetails._id);
    
    // Check if FareRule Group Id exists
    // const checkFareGroupExist = await fareRuleGroupModels.findById(CompanyId);
    // if (!checkFareGroupExist) {
    //   return {
    //     response: "Fare Group Not Found!!",
    //   };
    // }
  
  return {
    response: "Fetch Data Successfully",
    data: assignFareRuleGroup,
  }; 

};
const getAssignCommercial = async (companyId) => {
  //// Get Commertial id , plb, incentive so on...
  let getAgentConfig = await agentConfig.findOne({
    companyId: companyId,
  }); // check config
  //console.log(getAgentConfig);
  //return getAgentConfig;

  let commercialairplansVar = [];
  if (!getAgentConfig || getAgentConfig.fareRuleGroupIds === null) {
    getAgentConfig = await agencyGroup.findById(getAgentConfig.fairRuleGroupId);
    if (getAgentConfig) {
      // check from group privillage plan id
      commercialairplansVar = await fareRuleGroupModels
        .findOne({
          _id: getAgentConfig.fairRuleGroupId,          
        })
        .select("_id fareRuleGroupName");
      if (!commercialairplansVar) {
        return { IsSuccess: false, Message: "Fare Group Not Available" };
      }else{
        return { IsSuccess: true, data: commercialairplansVar };
      }      
     
    } else {
      return { IsSuccess: false, Message: "Fare Group Not Available" };
    }
  } else {
    // check Manuwal from config
    //return getAgentConfig
    commercialairplansVar = await fareRuleGroupModels
      .findOne({
        _id: getAgentConfig.fareRuleGroupIds        
      })
      .select("_id fareRuleGroupName");
    if (!commercialairplansVar) {
      return { IsSuccess: false, Message: "Fare Group Not Available" };
    }else{
      return { IsSuccess: true, data: commercialairplansVar };
    }
    
  }
  
 // return { IsSuccess: true, data: combineAllCommercialArr };
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
  getCustomFareRule
};
