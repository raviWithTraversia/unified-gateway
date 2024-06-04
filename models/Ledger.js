const mongoose = require("mongoose");
const ledgerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    ledgerId: { // random number generator LG100007
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
    product: {
      type: String,
    },
    currencyType: {  // INR 
      type: String,
      default: null,
    },
    fop: {  // FixedCredit, Cash, DI, Credit
      type: String,
      default: null,
    },
    transactionType: { // Debit, Credit
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

const ledger = mongoose.model("ledger", ledgerSchema);
module.exports = ledger;
