const agentConfigsModels = require("../../models/AgentConfig");
const userModel = require("../../models/User");
const companyModel = require('../../models/Company')
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
      maxcreditLimit,
      holdPNRAllowed,
      acencyLogoOnTicketCopy,
      addressOnTicketCopy,
      fareTypes,
      UserId,
      agencyGroupId
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
        maxcreditLimit,
        holdPNRAllowed,
        acencyLogoOnTicketCopy,
        addressOnTicketCopy,
        fareTypes,
        UserId,
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
        maxcreditLimit,
        holdPNRAllowed,
        acencyLogoOnTicketCopy,
        addressOnTicketCopy,
        fareTypes,
        UserId,
        modifyBy: req.user._id,
        agencyGroupId
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

    if (!existingConfig) {
      return {
        response: "Config not found",
      };
    }

    for (let key in updates) {
      if (existingConfig[key] !== updates[key]) {
        existingConfig[key] = updates[key];
      } else {
        existingConfig[key] = existingConfig[key];
      }
    }

    let configRes = await existingConfig.save();
    if (configRes) {
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
    let {id} = req.query;
    let agentConfigData = await agentConfigsModels
      .findOne({userId  : id})
      .populate("userId")
      .populate("companyId")
      .populate("privilegePlansIds")
      .populate("commercialPlanIds")
      .populate("agencyGroupId")
    console.log(agentConfigData);
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

const updateAgencyProfile = async (req,res) => {
    try{
        let uploadDataId = req.query.id;
        let dataForUpdate = {
            ...req.body
        };
        let updateCompayProfile;
  // console.log(req.files)
    if (req.files?. upload_TDS_Exemption_Certificate_URL ||req.files?.gst_URL ||req.files?.panUpload_URL || req.files?.logoDocument_URL ||req.files?.signature_URL||req.files?.aadhar_URL||req.files?.agencyLogo_URL) {
        updateCompayProfile = await companyModel.findByIdAndUpdate(
          uploadDataId,
          {
            $set: dataForUpdate,
            upload_TDS_Exemption_Certificate_URL: req?.files?.tds_exemption_certificate_URL[0]?.path,
            gst_URL: req?.files?.gst_URL[0]?.path,
            panUpload_URL : req?.files?.panUpload_URL[0]?.path,
            logoDocument_URL : req?.files?.logoDocument_URL[0]?.path,
            signature_URL : req?.files?.signature_URL[0]?.path,
            aadhar_URL : req?.files.aadhar_URL[0]?.path,
            agencyLogo_URL : req?.files?.agencyLogo_URL[0]?.path
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
    if(updateCompayProfile){
        return {
            response : 'Agency/Distributer details updated sucessfully',
            data : updateCompayProfile
        }
    }else{
        return {
            response : 'Agency/Distributer details not updated'
        }
    }
    }catch(error){
      console.log(error)
      throw error
    }
};

const getUserProfile = async (req,res) => {
  try{
  let {userId} = req.query;
  let userData = await userModel.findById(userId).populate('roleId', 'name type').populate({
    path: 'company_ID',
    model: 'Company',
    select: 'companyName type cashBalance creditBalance maxCreditLimit updatedAt',
    populate: {
      path: 'parent',
      model: 'Company',
      select: 'companyName type'
    }
  }).populate('cityId').populate('roleId')
  if(userData){
    return {
      response : 'User data found SucessFully',
      data : userData
    }
  }else{
     return {
      response : 'User data not found'
     }
  }
  
  }catch(error){
    console.log(error);
    throw error
  }
}
module.exports = {
  addAgentConfiguration,
  updateAgentConfiguration,
  getAgentConfig,
  updateAgencyProfile,
  getUserProfile
};
