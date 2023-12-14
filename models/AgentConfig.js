const mongoose = require("mongoose");

const agentConfigSchema = new mongoose.Schema(
  {
    privilegePlansIds: {
      privilegePlansId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "privilagePlan",
      },
    },
    commercialPlanIds: {
      commercialPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommercialAirPlan",
      },
    },
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    creditPlansIds: {
      creditPlansId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommercialAirPlan",
      },
    },
    fareRuleGroupIds: {
      fareRuleGroupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: " fareRuleGroup",
      },
      salesInchargeIds: {
        salesInchargeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: " User",
        },
      },
      plbGroupIds: {
        plbGroupId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: " PLBGroupMaster",
        },
      },
      incentiveGroupIds: {
        incentiveGroupId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: " IncentiveGroupMaster",
        },
      },
      portalLedgerAllowed: {
        type: Boolean,
      },
      accountCode: {
        type: String,
      },

      tds: {
        type: String,
      },
      maxcreditLimit: {
        type: Number,
      },
      holdPNRAllowed: {
        type: Boolean,
      },
      acencyLogoOnTicketCopy: {
        type: Boolean,
      },
      addressOnTicketCopy: {
        type: Boolean,
      },
      fareTypes: {
        regular: { type: Boolean },
        sme: { type: Boolean },
        corporate: { type: Boolean },
        agency: { type: Boolean },
        series: { type: Boolean },
      },
      modifyBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      modifyAt : {
        type : Date,
        default : Date.now()
      }
    },
  },
  {
    timestamps: true,
  }
);

const AgentConfiguration = mongoose.model( "AgentConfiguration", agentConfigSchema);
module.exports = AgentConfiguration;
