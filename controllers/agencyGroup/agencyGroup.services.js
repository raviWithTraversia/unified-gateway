const agencyGroupModel = require("../../models/AgencyGroup");

const addAgencyGroup = async (req, res) => {
  try {
    let {
      privilagePlanId,
      commercialPlanId,
      plbGroupId,
      incentiveGroupId,
      fairRuleGroupId,
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
  console.log(
    agencyGroupNameExist,
    "<<<<<<<<<<<>>>>>>>>>>>>>>"
  );
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
      fairRuleGroupId,
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
    console.log(newAgencyGroup, "lllllllllllllllllllllllllllllllllllllllllllllloooooooooooooooooooooo")

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
module.exports = {
  addAgencyGroup,
  editAgencyGroup,
  getAgencyGroup,
  deleteAgencyGroup,
};
