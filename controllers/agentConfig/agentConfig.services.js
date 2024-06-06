const agentConfigsModels = require("../../models/AgentConfig");
const userModel = require("../../models/User");
const companyModel = require('../../models/Company');
const EventLogs = require('../logs/EventApiLogsCommon');
const { update } = require("lodash");

const addAgentConfiguration = async (req, res) => {
  try {
    let {
      privilegePlansIds,
      commercialPlanIds,
      fareRuleGroupIds,
      portalLedgerAllowed,
      salesInchargeIds,
      plbGroupIds,
      incentiveGroupIds,
      accountCode,
      tds,
      // maxcreditLimit,
      holdPNRAllowed,
      acencyLogoOnTicketCopy,
      addressOnTicketCopy,
      fareTypes,
      UserId,
      agencyGroupId,
      discountPercentage,
    } = req.body;
    let userId = req.user._id;
    let checkIsRole = await userModel
      .findById(userId)
      .populate("roleId")
      .exec();
    if (checkIsRole.roleId.name == "Tmc" || checkIsRole.roleId.name == "TMC") {
      let agentConfigsInsert = await agentConfigsModels.create({
        privilegePlansIds,
        commercialPlanIds,
        fareRuleGroupIds,
        portalLedgerAllowed,
        salesInchargeIds,
        plbGroupIds,
        incentiveGroupIds,
        accountCode,
        tds,
        // maxcreditLimit,
        holdPNRAllowed,
        acencyLogoOnTicketCopy,
        addressOnTicketCopy,
        fareTypes,
        UserId,
        discountPercentage,
        modifyBy: req.user._id,
      });
      agentConfigsInsert = await agentConfigsInsert.save();
      if (agentConfigsInsert) {
        return {
          response: "Agent Config Insert Sucessfully",
          data: agentConfigsInsert,
        };
      }
    } else if (
      checkIsRole.roleId.name == "Agent" ||
      checkIsRole.roleId.name == "agent"
    ) {
      let agentConfigsInsert = await agentConfigsModels.create({
        privilegePlansIds,
        commercialPlanIds,
        fareRuleGroupIds,
        portalLedgerAllowed,
        salesInchargeIds,
        plbGroupIds,
        incentiveGroupIds,
        accountCode,
        tds,
        // maxcreditLimit,
        holdPNRAllowed,
        acencyLogoOnTicketCopy,
        addressOnTicketCopy,
        fareTypes,
        UserId,
        modifyBy: req.user._id,
        agencyGroupId,
        discountPercentage,
        bookingPrefix,
        InvoiceingPrefix
      });
      agentConfigsInsert = await agentConfigsInsert.save();
      if (agentConfigsInsert) {
        return {
          response: "Agent Config Insert Sucessfully",
          data: agentConfigsInsert,
        };
      }
    } else {
      return {
        response: "User  is not Tmc or agent or distributer",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const updateAgentConfiguration = async (req, res) => {
  try {
    const id = req.query.id;
    const updates = req.body;

    const existingConfig = await agentConfigsModels.findById(id);
    const userData = await userModel.findById(req.user._id)
    const updateData = await agentConfigsModels.findByIdAndUpdate(id, updates, { new: true })

    /// console.log("====>", existingConfig);
    // if (!existingConfig) {
    //   return {
    //     response: "Config not found",
    //   };
    // }
    // for (let key in updates) {
    //   if (existingConfig[key] !== updates[key]) {
    //     existingConfig[key] = updates[key];
    //   } else {
    //     existingConfig[key] = existingConfig[key];
    //   }
    // }

    // let configRes = await existingConfig.save();

    if (updateData) {
      const LogsData = {
        eventName: "ConfigAgency",
        doerId: req.user._id,
        doerName: userData.fname,
        companyId: updates.companyId,
        oldValue: existingConfig,
        newValue: updates,
        documentId: id,
        description: "Edit ConfigAgency",
      }
      EventLogs(LogsData)

      return {
        response: "Config updated successfully",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getAgentConfig = async (req, res) => {
  try {
    let { id } = req.query;
    let agentConfigData = await agentConfigsModels
      .findOne({ userId: id })
      .populate("userId")
      .populate("companyId")
      .populate("privilegePlansIds")
      .populate("commercialPlanIds")
      .populate("agencyGroupId")
      .populate("incentiveGroupIds")
      .populate("fareRuleGroupIds")
      .populate("salesInchargeIds")
      .populate("plbGroupIds")
      .populate("diSetupIds")
      .populate("airlinePromocodeIds")
      .populate("paymentGatewayIds")
    //console.log(agentConfigData);
    if (agentConfigData) {
      return {
        response: "Agent config Data found Sucessfully",
        data: agentConfigData,
      };
    } else {
      return {
        response: "Agent config Data not found",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const updateAgencyProfile = async (req, res) => {
  try {
    let uploadDataId = req.query.id

    let dataForUpdate = {
      ...req.body
    };


    let updateCompayProfile;

    if (req.files?.upload_TDS_Exemption_Certificate_URL || req.files?.gst_URL || req.files?.panUpload_URL || req.files?.logoDocument_URL || req.files?.signature_URL || req.files?.aadhar_URL || req.files?.agencyLogo_URL) {


      updateCompayProfile = await companyModel.findByIdAndUpdate(
        uploadDataId,
        {
          $set: dataForUpdate,
          tds_exemption_certificate_URL: req.files.tds_exemption_certificate_URL ? req.files.tds_exemption_certificate_URL[0].path : null,
          gst_URL: req.files.gst_URL ? req.files.gst_URL[0].path : null,
          panUpload_URL: req.files.panUpload_URL ? req.files.panUpload_URL[0].path : null,
          logoDocument_URL: req.files.logoDocument_URL ? req.files.logoDocument_URL[0].path : null,
          signature_URL: req.files.signature_URL ? req.files.signature_URL[0].path : null,
          aadhar_URL: req.files.aadhar_URL ? req.files.aadhar_URL[0].path : null,
          agencyLogo_URL: req.files.agencyLogo_URL ? req.files.agencyLogo_URL[0].path : null
        },
        { new: true }
      );
    } else {
      updateCompayProfile = await companyModel.findByIdAndUpdate(
        uploadDataId,
        {
          $set: dataForUpdate,
        },
        { new: true }
      );
    }

    if (updateCompayProfile) {
      return {
        response: 'Agency/Distributor details updated successfully',
        data: updateCompayProfile
      };
    } else {
      return {
        response: 'Agency/Distributor details not updated'
      };
    }
  } catch (error) {
    console.log('Error updating agency profile:', error); // Log error
    throw error;
  }
};

const getUserProfile = async (req, res) => {
  try {
    let { userId } = req.query;
    let userData = await userModel.findById(userId).populate('roleId', 'name type').populate({
      path: 'company_ID',
      model: 'Company',
      populate: {
        path: 'parent',
        model: 'Company',
        select: 'companyName type'
      }
    }).populate('cityId').populate('roleId')
    if (userData) {
      return {
        response: 'User data found SucessFully',
        data: userData
      }
    } else {
      return {
        response: 'User data not found'
      }
    }

  } catch (error) {
    console.log(error);
    throw error
  }
};
module.exports = {
  addAgentConfiguration,
  updateAgentConfiguration,
  getAgentConfig,
  updateAgencyProfile,
  getUserProfile
};
