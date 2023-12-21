const agentConfigsModels = require("../../models/AgentConfig");
const userModel = require("../../models/User");
const mongoose = require("mongoose");

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
    let id = req.query.id;
    let agentConfigData = await agentConfigsModels
      .findById(id)
      .populate("userId")
      .populate("companyId")
      .populate("privilegePlansIds")
      .populate("commercialPlanIds")
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
module.exports = {
  addAgentConfiguration,
  updateAgentConfiguration,
  getAgentConfig,
};
