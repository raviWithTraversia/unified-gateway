const agencyGroupModel = require("../../models/AgencyGroup");
const agentConfigsModels = require("../../models/AgentConfig");
const privilagePlanModel = require("../../models/PrivilagePlan");
const commercialPlanModel = require("../../models/CommercialAirPlan");
const PLBGroupMasterModel = require('../../models/PLBGroupMaster');
const IncentiveGroupMasterModel = require('../../models/IncentiveGroupMaster');
const fareRuleGroupModel = require('../../models/FareRuleGroup');
const diSetupGroupModel = require('../../models/DiSetupGroup');
const paymentGatewayGroupModel = require('../../models/paymentGatewayChargesGroup');
const airlinePromoCodeGroupModel = require('../../models/AirlinePromoCodeGroup');
const ssrCommercialGroupModel = require('../../models/SsrCommercialGroup');
const user=require('../../models/User')
const EventLogs=require('../logs/EventApiLogsCommon')

const createDefaultDistributerGroup = async (companyId, isDefault, name) => {
  try {
    const [
      privilagePlan,
      commercialPlan,
      plbGroup,
      IncentiveGroupMaster,
      fareRuleGroup,
      diSetupGroup,
      paymentGatewayGroup,
      airlinePromoCodeGroup,
      ssrCommercialGroup

    ] = await Promise.all([
      privilagePlanModel.findOne({ isDefault: true }),
      commercialPlanModel.findOne({ isDefault: true }),
      PLBGroupMasterModel.findOne({ isDefault: true }),
      IncentiveGroupMasterModel.findOne({ isDefault: true }),
      fareRuleGroupModel.findOne({ isDefault: true }),
      diSetupGroupModel.findOne({ isDefault: true }),
      paymentGatewayGroupModel.findOne({ isDefault: true }),
      airlinePromoCodeGroupModel.findOne({ isDefault: true }),
      ssrCommercialGroupModel.findOne({ isDefault: true})

    ]);

    let privilagePlanId = privilagePlan ? privilagePlan._id : null;
    let commercialPlanId = commercialPlan ? commercialPlan._id : null;
    let plbGroupId = plbGroup ? plbGroup._id : null;
    let incentiveGroupId = IncentiveGroupMaster ? IncentiveGroupMaster._id : null;
    let fareRuleGroupId = fareRuleGroup ? fareRuleGroup._id : null;
    let diSetupGroupId = diSetupGroup ? diSetupGroup._id : null;
    let pgChargesGroupId = paymentGatewayGroup ? paymentGatewayGroup._id : null;
    let airlinePromoCodeGroupId = airlinePromoCodeGroup ? airlinePromoCodeGroup._id : null;
    let ssrCommercialGroupId = ssrCommercialGroup ? ssrCommercialGroup._id : null;

    let agencyGroupNameExist = await agencyGroupModel.findOne({
      companyId: companyId,
      name: name
    });

    if (agencyGroupNameExist) {
      return {
        response: "Agency group with the same name already exists for this company"
      };
    }

    if (isDefault === true) {
      let checkIsAnyDefaultTrue = await agencyGroupModel.updateMany(
        { companyId },
        { isDefault: false }
      );
    }

    let newAgencyGroup = new agencyGroupModel({
      privilagePlanId,
      commercialPlanId,
      plbGroupId,
      incentiveGroupId,
      fareRuleGroupId,
      diSetupGroupId,
      airlinePromoCodeGroupId,
      pgChargesGroupId,
      ssrCommercialGroupId,
      isDefault,
      companyId,
      name,
      createdBy: null,
      modifyBy:  null
    });

    newAgencyGroup = await newAgencyGroup.save();

    if (newAgencyGroup) {
      return {
        response: "Agency Group Added Successfully",
        data: newAgencyGroup,
      };
    } else {
      return {
        response: "Agency Group Not Added",
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const addAgencyGroup = async (req, res) => {
  try {
    let {
      privilagePlanId,
      commercialPlanId,
      plbGroupId,
      incentiveGroupId,
      fareRuleGroupId,
      diSetupGroupId,
      airlinePromoCodeGroupId,
      pgChargesGroupId,
      isDefault,
      companyId,
      name,
      ssrCommercialGroupId
    } = req.body;
    let agencyGroupNameExist =
    await agencyGroupModel.findOne({
      companyId: companyId,
      name
    });
  if (agencyGroupNameExist) {
    return {
      response:
        "Agency group with the same name already exists for this company",
    };
  }
    if (isDefault === true) {
      let checkIsAnyDefaultTrue = await agencyGroupModel.updateMany(
        { companyId },
        { isDefault: false }
      );
    }
    const userData=await user.findById(req.user._id)

    let newAgencyGroup = new agencyGroupModel({
      privilagePlanId,
      commercialPlanId,
      plbGroupId,
      incentiveGroupId,
      fareRuleGroupId,
      diSetupGroupId,
      airlinePromoCodeGroupId,
      pgChargesGroupId,
      isDefault,
      companyId,
      name,
      createdBy: req.user._id,
      modifyBy: req.user._id,
      ssrCommercialGroupId
    });
    newAgencyGroup = await newAgencyGroup.save();
    if (newAgencyGroup) {
const LogsData={
            eventName:"AgencyGroup",
            doerId:req.user._id,
        doerName:userData.fname,
 companyId:companyId,
 documentId:newAgencyGroup._id,
             description:"Add AgencyGroup",
          }
         EventLogs(LogsData)

      return {
        response: "Agency Group  Added Sucessfully",
        data: newAgencyGroup,
      };
    } else {
      return {
        response: "Agency  Group Not Added",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const editAgencyGroup = async (req, res) => {
  try {
    let { id } = req.query;
    let updateData = {
      ...req.body,
    };
const AgencyGroupData=await agencyGroupModel.findById(id)
    if (updateData?.isDefault === true) {
      let checkIsAnydefaultTrue = await agencyGroupModel.updateMany(
        { companyId: updateData.companyId },
        { isDefault: false }
      );
    }
    const userData=await user.findById(req.user._id)

    // let updateAirlinePromoGroupData ;
    let updateAgencyGroupData = await agencyGroupModel.findByIdAndUpdate(
      id,
      {
        $set: updateData,
        modifyBy: req.user._id,
      },
      { new: true }
    );
    if (updateAgencyGroupData) {
      const LogsData={
        eventName:"AgencyGroup",
        doerId:req.user._id,
    doerName:userData.fname,
companyId:updateAgencyGroupData.companyId,
oldValue:AgencyGroupData,
newValue:updateAgencyGroupData,
documentId:updateAgencyGroupData._id,
         description:"Edit AgencyGroup",
      }
     EventLogs(LogsData)

      return {
        response: "Agency Group Updated Sucessfully",
        data: updateAgencyGroupData,
      };
    } else {
      return {
        response: "Agency Group Data Not Updated",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getAgencyGroup = async (req, res) => {
  try {
   
    let agencyGroup = await agencyGroupModel.find().populate('privilagePlanId')
    .populate('commercialPlanId')
    .populate('plbGroupId')
    .populate('incentiveGroupId')
    .populate('fareRuleGroupId')
    .populate('diSetupGroupId')
    .populate('pgChargesGroupId')
    .populate('airlinePromoCodeGroupId')
    .populate('companyId')
    .populate('ssrCommercialGroupId')
    if (agencyGroup.length > 0) {
      return {
        response: "Agency Group Fetch Sucessfully",
        data: agencyGroup,
      };
    } else {
      return {
        response: "Agency Group Not Found",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const deleteAgencyGroup = async (req, res) => {
  try {
    let id = req.query.id;
    const userData=await user.findById(req.user._id)

    let deleteData = await agencyGroupModel.findByIdAndDelete(id);
    if (deleteData) {
      const LogsData={
        eventName:"AgencyGroup",
        doerId:req.user._id,
    doerName:userData.fname,
companyId:deleteData.companyId,
documentId:id,
         description:"Delete AgencyGroup",
      }
     EventLogs(LogsData)


      return {
        response: "Data deleted sucessfully",
      };
    } else {
      return {
        response: "Agency Group data not found for this id",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const assignAgencyGroup = async (req, res) => {
  try {
    const { userIds, assignAgencyGroup } = req.body;

    const updateResult = await agentConfigsModels.updateMany(
      { userId: { $in: userIds } },
      { $set: { agencyGroupId: assignAgencyGroup } },
      { new: true }
    );

    if (updateResult) {
      return {
        response: 'Selected Agency Successfully Assigned To The Group',
        data: updateResult,
      };
    } else {
      return {
        response: 'Selected Agency Not Updated Successfully',
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const getAssignAgencyGroup = async (req,res) => {
  try{
    const id = req.query.agencyGroupId;
    let assignAgency = await agentConfigsModels.find({agencyGroupId :id});
    let assignUser = [];
    for(let i = 0; i < assignAgency.length; i++ ){
      let obj = {};
      obj._id = assignAgency[i].userId
      assignUser.push(obj);
    }
   // console.log("===>>>>>>>>",assignAgency,"<<<=====>>>>",assignUser,"<<<=========");
   // return;
    if(assignAgency.length > 0){
      return {
        response : "Data Fetch Sucessfully",
        data : assignUser
      }
    }else{
      return{
        response : 'User Data Not Found'
      }
    }
    

  }catch(error){
    console.log(error);
    throw error;
  }
};
module.exports = {
  addAgencyGroup,
  editAgencyGroup,
  getAgencyGroup,
  deleteAgencyGroup,
  assignAgencyGroup,
  getAssignAgencyGroup,
  createDefaultDistributerGroup
};
