const agencyGroupModel = require("../../models/AgencyGroup");
const agentConfigsModels = require("../../models/AgentConfig");

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
    });
    newAgencyGroup = await newAgencyGroup.save();
    if (newAgencyGroup) {
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

    if (updateData?.isDefault === true) {
      let checkIsAnydefaultTrue = await agencyGroupModel.updateMany(
        { companyId: updateData.companyId },
        { isDefault: false }
      );
    }
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
    .populate('fairRuleGroupId')
    .populate('diSetupGroupId')
    .populate('pgChargesGroupId')
    .populate('airlinePromoCodeGroupId')
    .populate('companyId')
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
    let deleteData = await agencyGroupModel.findByIdAndDelete(id);
    if (deleteData) {
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
}

// agencyIds:[
//   {
//     _id:6555f84d991eaa63cb171aa9
//   },
//   {
//     _id:6555f84d991eaa63cb171aa8
//   },
  // {
  //    _id: 6555f84d991eaa63cb171aa8
  // }
//   ]
module.exports = {
  addAgencyGroup,
  editAgencyGroup,
  getAgencyGroup,
  deleteAgencyGroup,
  assignAgencyGroup,
  getAssignAgencyGroup
};
