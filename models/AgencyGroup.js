const mongoose = require("mongoose");

const agencyGroupSchema = new mongoose.Schema(
  {
    privilagePlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "privilagePlan",
    },
    commercialPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommercialAirPlan",
    },
    plbGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PLBGroupMaster",
    },
    incentiveGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncentiveGroupMaster",
    },
    fareRuleGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fareRuleGroup",
    },
    diSetupGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "diSetupGroupModel",
    },
    pgChargesGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "paymentGatewayGroupModel",
    },
    airlinePromoCodeGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "airlinePromoCodeGroupModel",
    },
    ssrCommercialGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ssrCommercialGroup",
      default: null
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    modifyBy: {
        type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    name : {
        type : String
    }
  },
  {
    timestamps: true,
  }
);
const agencyGroupModel = mongoose.model("agencyGroupModel", agencyGroupSchema);
module.exports = agencyGroupModel;