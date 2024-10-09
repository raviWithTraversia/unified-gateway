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
    ledgerId: {
      // random number generator LG100007
      type: String,
      default: null,
    },
    transationDate: {
      type: Date,
      default: Date.now,
    },
    transactionId: {
      type: String,
      default: null,
    },
    transactionAmount: {
      type: Number,
      default: null,
    },
    deal: {
      type: Number,
      default: 0,
    },
    tds: {
      type: Number,
      default: 0,
    },
    product: {
      type: String,
    },
    currencyType: {
      // INR
      type: String,
      default: null,
    },
    fop: {
      // FixedCredit, Cash, DI, Credit
      type: String,
      default: null,
    },
    transactionType: {
      // Debit, Credit
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
    billingNumber:{
      type:Number,
      default:null
    },
    creationDate: {
      type: Date,
      default: Date.now,
    },
    modifyBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifyAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

ledgerSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const lastBilling = await this.constructor.findOne().sort("-billingNumber");
      if (lastBilling && lastBilling.billingNumber) {
        this.billingNumber = lastBilling.billingNumber + 1;
      } else {
        this.billingNumber = 1;
      }
    } catch (err) {
      console.error("Error setting billing number:", err);
      return next(err); // Pass error to next middleware
    }
  }
  next();
});

ledgerSchema.methods.getFormattedBillingNumber = function () {
  return this.billingNumber.toString().padStart(3, "0");
};



const ledger = mongoose.model("ledger", ledgerSchema);
module.exports = ledger;
