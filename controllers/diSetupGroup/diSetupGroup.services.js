const diSetupGroupModels = require("../../models/DiSetupGroup");
const diSetupModel = require('../../models/DiSetup');
const agencyGroup = require("../../models/AgencyGroup");

const addDiSetupGroup = async (req, res) => {
  try {
    let {
      diSetupIds,
      diSetupGroupName,
      companyId,
      isDefault,
    } = req.body;
    let diSetupGroupNameExist =
      await diSetupGroupModels.findOne({
        companyId: companyId,
        diSetupGroupName: diSetupGroupName
      });
    console.log(
        diSetupGroupNameExist,
      "<<<<<<<<<<<>>>>>>>>>>>>>>"
    );
    if (diSetupGroupNameExist) {
      return {
        response:
          "Disetup  group with the same name already exists for this company",
      };
    }
    if (isDefault === true) {
      let checkIsAnydefaultTrue =
        await diSetupGroupModels.updateMany(
          { companyId },
          { isDefault: false }
        );
    };
    function areElementsUnique(arr) {
        return new Set(arr).size === arr.length;
    }
    
   let checkAllIdIsUnique = areElementsUnique(diSetupIds);
    if(checkAllIdIsUnique == false){
        return {
            response : ' all Id should be unique'
        }
    }
    const newDiSetupGroupName = new diSetupGroupModels({
      diSetupIds,
      diSetupGroupName,
      companyId,
      modifyAt: new Date(),
      modifyBy: req.user._id,
      isDefault,
    });
    const saveDiSetupGroupName =
      await newDiSetupGroupName.save();
    if (saveDiSetupGroupName) {
      return {
        response: "DiSetup Group  Added Sucessfully",
        data: saveDiSetupGroupName,
      };
    } else {
      return {
        response: "DiSetup Group Not Added",
      };
    }
  } catch (error) {
    console.log(error);
    throw console.error();
  }
};

const editDiSetupGroup = async (req, res) => {
  try {
    let { id } = req.query;
    let updateData = {
      ...req.body,
    };

    if (updateData?.isDefault === true) {
      let checkIsAnydefaultTrue =
        await diSetupGroupModels.updateMany(
          { companyId: updateData.companyId },
          { isDefault: false }
        );
    }
   // let updateAirlinePromoGroupData ;
    let updateDiSetupGroupData =
      await diSetupGroupModels.findByIdAndUpdate(
        id,
        {
          $set: updateData,
          modifyBy: req.user._id,
        },
        { new: true }
      );
    if (updateDiSetupGroupData) {
      await agencyGroup.findOneAndUpdate(
        { companyId: updateData.companyId, isDefault: true },
        { diSetupGroupId: id },
        { new: true }
      );
      return {
        response: "DiSetup Group Updated Sucessfully",
        data: updateDiSetupGroupData,
      };
    } else {
      return {
        response: "DiSetup Group Data Not Updated",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getDiSetupGroup = async (req, res) => {
  try {
    let companyId = req.query.companyId;
    let diSetupGroup
    diSetupGroup = await diSetupGroupModels.find({
      companyId: companyId,
    });

    for (let i = 0; i < diSetupGroup?.length; i++) {
      let convertedDiSetupIds = diSetupGroup[i].diSetupIds.map(
        (id) => id.toString()
      );
      let documents = await diSetupModel
        .find({ _id: { $in: convertedDiSetupIds } })
        .populate("companyId")
        .exec();
        diSetupGroup[i].diSetupIds = documents;
    }

    if (diSetupGroup.length > 0) {
      return {
        response: "DiSetup Group Fetch Sucessfully",
        data: diSetupGroup,
      };
    } else {
      return {
        response: "DiSetup Group Not Found"
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteDiSetupGroup = async (req, res) => {
  try {
    let id = req.query.id;
    let deleteData = await diSetupGroupModels.findByIdAndDelete(
      id
    );
    if (deleteData) {
      return {
        response: "Data deleted sucessfully",
      };
    } else {
      return {
        response: "DiSetup Group data not found for this id",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  addDiSetupGroup,
  editDiSetupGroup,
  getDiSetupGroup,
  deleteDiSetupGroup,
};
