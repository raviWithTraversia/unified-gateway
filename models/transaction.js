const { union } = require("lodash");
const mongoose = require("mongoose");
const transactionDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    bookingId: {
      type: String,
      default: null,
    },
    trnsNo: {
      type: String,
      unique:true

    },
    cardNo: {
      // INR
      type: String,
      default: null,
    },
    holderName: {
      type: String,
      default: null,
    },
    cardExpDate: {
      // Debit, Credit
      type: String,
      default: null,
    },
    cardValidFrom: {
      type: String,
      default: null,
    },
    cardIssueNo: {
      type: Number,
      default: null,
    },
    securityCode: {
      type: String,
      default: null,
    },
    cardType: {
      type: String,
      default: null,
    },
    deliveryName: {
      type: String,
      default: null,
    },
    deliveryCountry: {
      type: String,
      default: null,
    },
    deliveryState: {
      type: String,
      default: null,
    },
    deliveryCity: {
      type: String,
      default: null,
    },
    deliveryZip: {
      type: String,
      default: null,
    },
    deliveryAddress: {
      type: String,
      default: null,
    },
    deliveryTel: {
      type: String,
      default: null,
    },
    billingName: {
      type: String,
      default: null,
    },
    billingCountry: {
      type: String,
      default: null,
    },
    billingState: {
      type: String,
      default: null,
    },
    billingCity: {
      type: String,
      default: null,
    },
    billingZip: {
      type: String,
      default: null,
    },
    billingAddress: {
      type: String,
      default: null,
    },
    cardBillingTel: {
      type: String,
      default: null,
    },
    billingEmail: {
      type: String,
      default: null,
    },
    chargesType: {
      type: String,
      default: null,
    },
    bankName: {
      type: String,
      default: null,
    },
    trnsType: {
      // debit, credit
      type: String,
      default: null,
    },
    paymentMode: {
      // UPI , DI, CL
      type: String,
      default: null,
    },
    paymentGateway:{
      type: String,
      default: null,
    },
    trnsStatus: {
      // Virtual_Success, success,
      type: String,
      default: null,
    },
    statusDetail: {
      // APPROVED OR COMPLETED SUCCESSFULLY
      type: String,
      default: null,
    },
    trnsVSPTxID: {
      // APPROVED OR COMPLETED SUCCESSFULLY
      type: String,
      default: null,
    },
    trnsBankRefNo: {
      // APPROVED OR COMPLETED SUCCESSFULLY
      type: String,
      default: null,
    },
    trnsAVSCV2: {
      // APPROVED OR COMPLETED SUCCESSFULLY
      type: String,
      default: null,
    },
    trnsAddressResult: {
      // APPROVED OR COMPLETED SUCCESSFULLY
      type: String,
      default: null,
    },
    trnsPostCodeResult: {
      // APPROVED OR COMPLETED SUCCESSFULLY
      type: String,
      default: null,
    },
    pgCharges:{
      type: String,
      default: null,
    },
    billingNumber:{
      type:Number,
      unique:true

    },
    transactionAmount:{
      type: String,
      default: null,
    },
    trnsStatusMessage: {
      // APPROVED OR COMPLETED SUCCESSFULLY
      type: String,
      default: null,
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

transactionDetailsSchema.pre("save", async function (next) {
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

transactionDetailsSchema.methods.getFormattedBillingNumber = function () {
  return this.billingNumber.toString().padStart(3, "0");
};

const transactionDetails = mongoose.model(
  "transactionDetails",
  transactionDetailsSchema
);
module.exports = transactionDetails;
