const manageMarkupModel = require("../../models/ManageMarkup");
const userModel = require("../../models/User");
const markUpCategoryMasterModels = require("../../models/MarkupCategoryMaster");
const markupLogHistory = require('../../models/MarkupLogHistory');
const mongoose = require('mongoose');
const EventLogs=require('../logs/EventApiLogsCommon')
const addMarkup = async (req, res) => {
  try {
    let { markupData, airlineCodeId, markupOn, markupFor, companyId, isDefault } =
      req.body;
    let userId = req.user._id
    let query = {
      markupOn: markupOn,
      markupFor: markupFor,
      companyId: companyId,
      airlineCodeId: airlineCodeId
    };
    let checkMarkupExist = await manageMarkupModel.find(query);
    if (isDefault === true) {
      let checkIsAnydefaultTrue =
        await manageMarkupModel.updateMany(
          { companyId },
          { isDefault: false }
        );
    }
   // console.log(checkMarkupExist, "vvvvvv");
    if (checkMarkupExist?.length > 0) {
      return {
        response: "This Markup already exists!",
      };
    }
    console.log(userId)
    let checkIsRole = await userModel
      .findById(userId)
      .populate("roleId")
      .exec();

    if (
      checkIsRole.roleId.name == "Agency" ||
      checkIsRole.roleId.name == "Distributer"
    ) {
      let markupChargeInsert = await manageMarkupModel.create({
        markupData,
        airlineCodeId :airlineCodeId || null,
        markupOn,
        markupFor,
        companyId,
        modifyBy: userId,
        createdBy: userId,
        isDefault
      });
      markupChargeInsert = await markupChargeInsert.save();
      if (markupChargeInsert) {
        const LogsData={
          eventName:"Markup",
          doerId:req.user._id,
          companyId:companyId,
          description:"Add Agent Markup",
        }
       EventLogs(LogsData)

        return {
          data: markupChargeInsert,
          response: "MarkUp Charges Insert Sucessfully",
        };
      } else {
        return {
          response: "MarkUp Charges Charges Not Added",
        };
      }
    } else {
      return {
        response: `User Dont have permision to add MarkUp Charges `,
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const updateMarkup = async (req, res) => {
  try {
    let { markupId } = req.query;
    let dataForUpdate = { ...req.body };
    let updateDetails = await manageMarkupModel.findByIdAndUpdate(
      markupId,
      {
        $set: dataForUpdate,
      },
      { new: true }
    );

    if (!updateDetails) {
      return {
        response: "MarkUp data not found",
      };
    } else {

      // BY ALAM 16-01-2024
      const getOldValue = await manageMarkupModel.findOne({ _id: markupId })
      const CheckMarkupLogExist = await markupLogHistory.findOne({ markupId: markupId });
      if (CheckMarkupLogExist) {
        const updateMarkupLog = await markupLogHistory.findByIdAndUpdate(
          markupId,
          {
            markupDataNew: req.body.markupData,
            markupDataOld: getOldValue.markupData,
          },
          { new: true }
        );

      } else {
        const addMarkupLog = new markupLogHistory({
          markupId,
          markupDataNew: req.body.markupData,
          markupDataOld: req.body.markupData,
        });

        const saveMarkupLog = await addMarkupLog.save();
      }

      // End................

      return {
        response: "Markup Data updated successfully",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const deletedMarkup = async (req, res) => {
  try {
    const { markupId } = req.query;
    let checkForDeleteProtaction = await manageMarkupModel.find({ _id: markupId, isDefault: true });
    console.log(checkForDeleteProtaction, "ppppppppppppppppp")
    if (checkForDeleteProtaction.length > 0) {
      return {
        response: "You can't delete default markup"
      }
    }
    const deleteMarkupDetails = await manageMarkupModel.findByIdAndDelete(
      markupId
    );
    if (deleteMarkupDetails) {
      return {
        response: "Markup details deleted successfully",
        data: deleteMarkupDetails,
      };
    } else {
      return {
        response: "Markup details not found",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getMarkUp = async (req, res) => {
  try {
    let { companyId } = req.query;
    let data = await manageMarkupModel.find({ companyId }).populate('airlineCodeId')
    console.log("====>>>>>>>>>>>>>>", data, "data");
    if (data) {
      return {
        response: "Markup Data Fetch Sucessfully",
        data: data,
      };
    } else {
      return {
        response: "Markup Data not found",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getMarkUpCatogeryMaster = async (req, res) => {
  try {
    let markupCatogery = await markUpCategoryMasterModels.find();
    console.log(markupCatogery);
    if (markupCatogery.length > 0) {
      return {
        response: 'Markup Catogery Data found Sucessfully',
        data: markupCatogery
      }
    } else {
      return {
        response: 'Markup Catogery Data Not Found'
      }
    }

  } catch (error) {
    console.log(error);
    throw error
  }
}
module.exports = {
  addMarkup,
  deletedMarkup,
  updateMarkup,
  getMarkUp,
  getMarkUpCatogeryMaster
};
