const mongoose = require("mongoose");

const ledgerRailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    ledgerId: { 
      type: String,
      default: null,
    },
    transationDate: {
      type: Date,
      default: Date.now,
    },
    transactionAmount: {
      type: Number,
      default: null,
    },
    deal:{
      type: Number,
      default: 0,
    },
    tds:{
      type: Number,
      default: 0,
    },
    product: {
      type: String,
    },
    currencyType: {  
      type: String,
      default: null,
    },
    fop: {  
      type: String,
      default: null,
    },
    transactionType: { 
      type: String,
      default: null,
    },
    accountType: {
      type: String,
      default: null,
    },
    runningAmount: {
      type: Number,
      default: null,
    },
    referenceID: {
      type: String,
      default: null,
    },
    remarks: {
      type: String,
      default: null,
    },
    transactionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cartId: {
      type: String,
      default: null,
    },
    creationDate: {
      type: Date,
      default: Date.now(),
    },
    modifyBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifyAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const ledgerRail = mongoose.model("ledgerRail", ledgerRailSchema);
module.exports = ledgerRail;
