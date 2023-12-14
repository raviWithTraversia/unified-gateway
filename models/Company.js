const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: false,
      default: null,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    type: {
      type: String,
      required: false,
      default: null,
    },
    companyStatus: {
      type: String,
      required: false,
      default: null,
    },
    modifiedBy: {
      type: String,
      required: false,
      default: null,
    },
    logo_URL: {
      type: String,
      required: false,
      default: null,
    },
    office_Type: {
      type: String,
      required: false,
      default: null,
    },
    cashBalance: {
      type: Number,
      default: 0,
    },
    creditBalance: {
      type: Number,
      default: 0,
    },
    incentiveBalance: {
      type: Number,
      default: 0,
    },
    fixedCreditBalance: {
      type: Number,
      default: 0,
    },
    maxCreditLimit: {
      type: Number,
      default: 0,
    },
    isAutoInvoicing: {
      type: Boolean,
      default: false,
    },
    invoicingPackageName: {
      type: String,
      required: false,
      default: null,
    },
    planType: {
      type: String,
      required: false,
      default: null,
    },
    creditPlanType: {
      type: String,
      required: false,
      default: null,
    },
    booking_Prefix: {
      type: String,
      required: false,
      default: null,
    },
    invoicing_Prefix: {
      type: String,
      required: false,
      default: null,
    },
    invoicingTemplate: {
      type: String,
      required: false,
      default: null,
    },
    cin_number: {
      type: String,
      required: false,
      default: null,
    },
    signature: {
      type: String,
      required: false,
      default: null,
    },
    pan_Number: {
      type: String,
      required: false,
      default: null,
    },
    HSN_SAC_Code: {
      type: String,
      required: false,
      default: null,
    },
    hierarchy_Level: {
      type: String,
      required: false,
      default: null,
    },
    pan_upload: {
      type: String,
      required: false,
      default: null,
    },
    gstState: {
      type: String,
      default: null,
    },
    gstPinCode: {
      type: String,
      default: null,
    },
    gstCity: {
      type: String,
      default: null,
    },
    gstNumber: {
      type: String,
      default: null,
    },
    gstName: {
      type: String,
      default: null,
    },
    gstAddress_1: {
      type: String,
      default: null,
    },
    gstAddress_2: {
      type: String,
      default: null,
    },
    isIATA: {
      type : Boolean,
      default : false
  },
  holdPnrAllowed : {
    type : Boolean,
    dafault : false
  },
  modifiedBy : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
  },
  {
    timestamps: true, // Adds created_at and updated_at fields
  }
);

const Company = mongoose.model("Company", companySchema);
module.exports = Company; // Export the User model
