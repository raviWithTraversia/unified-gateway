const manageUploadSchema = require("../../models/ManageUplods");
const FUNC = require("../commonFunctions/common.function");

const addImageUpload = async (uploadImageData, file) => {
  try {
    let { type, title, description, userId } = uploadImageData;
    const fieldNames = ["type", "userId"];
    const missingFields = fieldNames.filter(
      (fieldName) =>
        uploadImageData[fieldName] === null ||
        uploadImageData[fieldName] === undefined
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
      image: {
        data: file.buffer,
        contentType: file.mimetype,
      },
      userId,
      type,
      title,
      description,
    });
    uploadData = await uploadData.save();
    //    console.log(uploadData, "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
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

const updateUploadImage = async (uploadImageData, file) => {
  try {
    let { imageDetailsId,type } = uploadImageData;
    const fieldNames = ["type", "title", "description", "imageDetailsId"];
    const updatedFields = {};

    for (const field of fieldNames) {
      if (uploadImageData[field] !== undefined && uploadImageData[field] !== null) {
        updatedFields[field] = uploadImageData[field];
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      return {
        response: "No fields provided for update",
      };
    }

    const existingUploadData = await manageUploadSchema.findById(imageDetailsId);
    if (!existingUploadData) {
      return {
        response: "Upload data not found",
      };
    }

    if (file) {
      existingUploadData.image.data = file.buffer;
      existingUploadData.image.contentType = file.mimetype;
    }

    Object.assign(existingUploadData, updatedFields);
    await existingUploadData.save();

    return {
      response: "Data updated successfully",
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteUploadImage = async (req, res) => {
  try {
    const { uploadImageDetailsId } = req.query;
    //console.log(bankDetailsId , "<<<<<<<<<<==================>>>>>>>>>>>>>>>>")
    const deletedBankDetails = await manageUploadSchema.findByIdAndRemove(
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
