const emailConfig = require("../../models/EmailConfig");
const emailConfigDes = require("../../models/EmailConfigDiscription");
const smtp = require("../../models/Smtp");
const user = require("../../models/User");
const FUNC = require("../../controllers/commonFunctions/common.function");

const addEmailConfig = async (req, res) => {
  try {
    const {
      companyId,
    //  EmailConfigDescriptionId,
      mailDescription,
      emailCc,
      emailBcc,
      smptConfigId,
      status,
      productType
    } = req.body;

    let isValidSmptConfigId = FUNC.checkIsValidId(smptConfigId);
    // let isValidEmailConfigDescriptionId = FUNC.checkIsValidId(
    //   EmailConfigDescriptionId
    // );
    if (isValidSmptConfigId === "Invalid Mongo Object Id") {
      return {
        response: "smptConfigId is not valid",
      };
    }
    // if (isValidEmailConfigDescriptionId === "Invalid Mongo Object Id") {
    //   return {
    //     response: "EmailConfigDescriptionId is not valid",
    //   };
    // }
    let checkIscompanyIdExist = await user.findOne({ company_ID: companyId });
    if (!checkIscompanyIdExist) {
      checkIscompanyIdExist = null;
      return {
        response: "Company id not exist",
        data: checkIscompanyIdExist,
      };
    }
    let checkIsSmtpIdExist = await smtp.findOne({ _id: smptConfigId });
    if (!checkIsSmtpIdExist) {
      checkIsSmtpIdExist = null;
      return {
        response: "Smtp id not exist",
        data: checkIsSmtpIdExist,
      };
    }
    let checkIsEmailConfigDescriptionIdExist = await emailConfig.find({
      company_ID: companyId,
      mailDescription: mailDescription,
    });
    if (!checkIsEmailConfigDescriptionIdExist) {
      return {
        response: "Email config is already exist",
      };
    } else {
      const newEmailConfigDescription = new emailConfigDes({
        emailConfigDescription: mailDescription,
      });
      let createEmailConfig = new emailConfig({
        companyId,
        EmailConfigDescriptionId: newEmailConfigDescription._id,
        mailDescription,
        emailCc,
        emailBcc,
        smptConfigId,
        status,
        productType
      });
      await createEmailConfig.save();
      return {
        response: "New Email Config is created sucessfully",
        data: createEmailConfig,
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getEmailConfig = async (req, res) => {
  try {
    const { companyId } = req.params;
    let allEmailConfigData = await emailConfig.find({ companyId }).populate({
      path: 'EmailConfigDescriptionId',
  })
  .populate({
      path: 'smptConfigId',
      select: 'host port emailFrom _id ', 
  });
    if (!allEmailConfigData || !allEmailConfigData.length) {
      return {
        response: "No any email config exist for this comapnyId",
        data: null,
      };
    } else {
      return {
        response: "Email config id fetch sucessfully",
        data: allEmailConfigData,
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const upadteEmailConfig = async (req,res) => {
  const { id } = req.query;
  const updateFields = req.body;

  try {
    const updatedConfig = await emailConfig.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedConfig) {
      return {
         response: 'Email configuration not found'
         };
    }
    return{
       response: 'Email configuration updated successfully',
        data : updatedConfig 
      };
  } catch (error) {
    console.error('Error updating email configuration:', error);
    throw error
  }
}



module.exports = {
  getEmailConfig,
  addEmailConfig,
  upadteEmailConfig
};
