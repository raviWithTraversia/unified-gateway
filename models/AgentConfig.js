const mongoose = require("mongoose");

const agentConfigSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    userType: {
      type : String
    },
    privilegePlansIds: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "privilagePlan",
        default : null
      },
    commercialPlanIds: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommercialAirPlan",
        default : null
      },
    fareRuleGroupIds: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fareRuleGroup",
        default : null
      },
    salesInchargeIds: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default : null
      },
    plbGroupIds: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PLBGroupMaster",
        default : null
      },
    incentiveGroupIds: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "IncentiveGroupMaster",
        default : null
      },
      diSetupIds : {
      type: mongoose.Schema.Types.ObjectId,
        ref: "diSetupGroupModel",
        default : null
    },
    airlinePromocodeIds : {
      type: mongoose.Schema.Types.ObjectId,
        ref: "airlinePromoCodeGroupModel",
        default : null
    },
    paymentGatewayIds : {
    type: mongoose.Schema.Types.ObjectId,
        ref: "paymentGatewayGroupModel",
        default : null
  },
    portalLedgerAllowed: {
      type: Boolean
    },
    accountCode: {
      type: String
    },
    tds: {
      type: String,
    },
    maxcreditLimit: {
      type: Number,
      default : 0
    },
    holdPNRAllowed: {
      type: Boolean
    },
    acencyLogoOnTicketCopy: {
      type: Boolean
    },
    addressOnTicketCopy: {
      type: Boolean
    },
    fareTypes: {
      regular: { type: Boolean },
      sme: { type: Boolean },
      corporate: { type: Boolean },
      agency: { type: Boolean },
      series: { type: Boolean },
    },
    agencyGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'agencyGroupModel'
    },
    modifyBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifyAt: {
      type: Date,
      default: Date.now(),
    },
    discountPercentage : {
      type : Number,
      default : 0
    },
    bookingPrefix : {
      type : String
    },
    InvoiceingPrefix : {
      type : String
    }
  },
  {
    timestamps: true,
  }
);

const AgentConfiguration = mongoose.model(
  "AgentConfiguration",
  agentConfigSchema
);
module.exports = AgentConfiguration;
