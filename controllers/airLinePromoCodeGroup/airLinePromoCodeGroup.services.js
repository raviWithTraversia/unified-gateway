const AirlinePromoCodeGroupModels = require("../../models/AirlinePromoCodeGroup");
const airlinePromoModel = require('../../models/AirlinePromoCode');
const agencyGroup = require("../../models/AgencyGroup");
const addAirlinePromcodeGroup = async (req, res) => {
  try {
    let {
      airlinePromcodeIds,
      airlinePromcodeGroupName,
      companyId,
      isDefault,
    } = req.body;
    let airlinePromcodeGroupNameExist =
      await AirlinePromoCodeGroupModels.findOne({
        companyId: companyId,
        airlinePromcodeGroupName: airlinePromcodeGroupName
      });
    // console.log(
    //     airlinePromcodeGroupNameExist,
    //   "<<<<<<<<<<<>>>>>>>>>>>>>>"
    // );
    if (airlinePromcodeGroupNameExist) {
      return {
        response:
          "Airline Promo  group with the same name already exists for this company",
      };
    }
    if (isDefault === true) {
      let checkIsAnydefaultTrue =
        await AirlinePromoCodeGroupModels.updateMany(
          { companyId },
          { isDefault: false }
        );
    }
    function areElementsUnique(arr) {
        return new Set(arr).size === arr.length;
    }
    
   let checkAllIdIsUnique = areElementsUnique(airlinePromcodeIds);
   /// console.log(areElementsUnique(airlinePromcodeIds) , "ggggggggggggggggggggg")
    if(checkAllIdIsUnique == false){
        return {
            response : 'Airline Promcode all Id should be unique'
        }
    }
    const newAirlinePromoCodeGroup = new AirlinePromoCodeGroupModels({
      airlinePromcodeIds,
      airlinePromcodeGroupName,
      companyId,
      modifyAt: new Date(),
      modifyBy: req.user._id,
      isDefault,
    });
    const saveAirlinePromocodeGroupName =
      await newAirlinePromoCodeGroup.save();
    if (saveAirlinePromocodeGroupName) {
      return {
        response: "Airline Promocode Group  Added Sucessfully",
        data: saveAirlinePromocodeGroupName,
      };
    } else {
      return {
        response: "Airline Promocode Group Not Added",
      };
    }
  } catch (error) {
    console.log(error);
    throw console.error();
  }
};

const editAirlinePromoCodeGroup = async (req, res) => {
  try {
    let { id } = req.query;
    let updateData = {
      ...req.body,
    };

    if (updateData?.isDefault === true) {
      let checkIsAnydefaultTrue =
        await AirlinePromoCodeGroupModels.updateMany(
          { companyId: updateData.companyId },
          { isDefault: false }
        );
    }
   // let updateAirlinePromoGroupData ;
    let updateAirlinePromoGroupData =
      await AirlinePromoCodeGroupModels.findByIdAndUpdate(
        id,
        {
          $set: updateData,
          modifyBy: req.user._id,
        },
        { new: true }
      );
    if (updateAirlinePromoGroupData) {
      await agencyGroup.findOneAndUpdate(
        { companyId: updateData.companyId, isDefault: true },
        { airlinePromoCodeGroupId: id },
        { new: true }
      );
      return {
        response: "Airline Promo Code Group Updated Sucessfully",
        data: updateAirlinePromoGroupData,
      };
    } else {
      return {
        response: "Airline Promo Code Group Data Not Updated",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAirlinePromoCodeGroup = async (req, res) => {
  try {
    let companyId = req.query.companyId;
    let airlinePromoCodeGroup
    airlinePromoCodeGroup = await AirlinePromoCodeGroupModels.find({
      companyId: companyId,
    });
  //  console.log(">>>>",airlinePromoCodeGroup, "<<<===========");
    for (let i = 0; i < airlinePromoCodeGroup?.length; i++) {
      let convertedIds = airlinePromoCodeGroup[i].airlinePromcodeIds.map(
        (id) => id.toString()
      );
      let documents = await airlinePromoModel
        .find({ _id: { $in: convertedIds } })
        // .populate("companyId")
        // .exec();
        airlinePromoCodeGroup[i].airlinePromcodeIds = documents;
    }

    if (airlinePromoCodeGroup.length > 0) {
      return {
        response: "Airline Promo Group Fetch Sucessfully",
        data: airlinePromoCodeGroup,
      };
    } else {
      return {
        response: "Airline Promo Group Not Found",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteAirlinePromCodeGroup = async (req, res) => {
  try {
    let id = req.query.id;
    let deleteData = await AirlinePromoCodeGroupModels.findByIdAndDelete(
      id
    );
    if (deleteData) {
      return {
        response: "Data deleted sucessfully",
      };
    } else {
      return {
        response: "Airline Promo Group data not found for this id",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  addAirlinePromcodeGroup,
  editAirlinePromoCodeGroup,
  getAirlinePromoCodeGroup,
  deleteAirlinePromCodeGroup
};
