const mongoose = require("mongoose");

const diSetupSchema = new mongoose.Schema(
  {
    diType: {
      type: String,
    },
    minAmount: {
      type: String,
    },
    maxAmount: {
      type: String,
    },
    diPersentage: {
      type: String,
    },
    diOfferType: {
      type: String,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    validFromDate: {
      type: Date,
    },
    validToDate: {
      type: Date,
    },
    gst: {
      type: Boolean,
    },
    tds: {
      type: Boolean,
    },
    status: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const diSetup = mongoose.model("diSetup", diSetupSchema);
module.exports = diSetup;
