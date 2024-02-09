const manageUploadSchema = require("../../models/ManageUplods");
const FUNC = require("../commonFunctions/common.function");

const addImageUpload = async (req, res) => {
  try {
    let { type, title, description, userId } = req.body;
    const fieldNames = ["type", "userId"];
    const missingFields = fieldNames.filter(
      (fieldName) =>
        req.body[fieldName] === null || req.body[fieldName] === undefined
    );
    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(", ");
      return {
        response: null,
        isSometingMissing: true,
        data: `Missing or null fields: ${missingFieldsString}`,
      };
    }
    const checkValidUserId = FUNC.checkIsValidId(userId);
    if (!checkValidUserId == "Invalid Mongo Object Id") {
      return {
        response: "Invalid Mongo Object Id",
      };
    }
    let uploadData = new manageUploadSchema({
      imagePath: req.file.path,
      userId,
      type,
      title,
      description,
    });
    uploadData = await uploadData.save();
    if (uploadData) {
      return {
        response: "Data Upload Sucessfully",
      };
    } else {
      return {
        response: "Data Not Upload Sucessfully",
      };
    }
  } catch (error) {
    console.log(error);
    throw console.error();
  }
};

const getUploadImage = async (req, res) => {
  try {
    let userId = req.query.Id;
    let uploadImageData = await manageUploadSchema.find(userId);
    if (uploadImageData) {
      return {
        response: "Image fetch Sucessfully",
        data: uploadImageData,
      };
    } else {
      return {
        response: "Image not found",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateUploadImage = async (req, res) => {
  try {
    let { uploadDataId } = req.query;
    let updateDetails;
    if (req.file) {
      updateDetails = await manageUploadSchema.findByIdAndUpdate(
        uploadDataId,
        {
          $set: req.body,
          imagePath: req.file.path,
        },
        { new: true }
      );
    } else {
      updateDetails = await manageUploadSchema.findByIdAndUpdate(
        uploadDataId,
        {
          $set: req.body,
        },
        { new: true }
      );
    }
    if (!updateDetails) {
      return {
        response: "Upload data not found",
      };
    } else {
      return {
        response: "Data updated successfully",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteUploadImage = async (req, res) => {
  try {
    const { uploadImageDetailsId } = req.params;
    const deletedBankDetails = await manageUploadSchema.findByIdAndDelete(
      uploadImageDetailsId
    );
    if (deletedBankDetails) {
      return {
        response: "Image details deleted successfully",
        data: deletedBankDetails,
      };
    } else {
      return {
        response: "Image details not found",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  addImageUpload,
  getUploadImage,
  deleteUploadImage,
  updateUploadImage,
};
