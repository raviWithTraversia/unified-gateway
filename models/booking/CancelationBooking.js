const mongoose = require("mongoose");
const cancelationSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    calcelationStatus: {
      type: String,
      default: null,
    },
    AirlineCode: { type: String, default: null },
    PNR: {
      type: String,
      default: null,
    },
    fare: {
      type: Number,
      default: 0,
    },
    AirlineCancellationFee: {
      type: Number,
      default: 0,
    },
    AirlineRefund: {
      type: Number,
      default: 0,
    },
    ServiceFee: {
      type: Number,
      default: 0,
    },
    RefundableAmt: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: null,
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

const cancelationBooking = mongoose.model(
  "cancelationBooking",
  cancelationSchema
);
module.exports = cancelationBooking;
