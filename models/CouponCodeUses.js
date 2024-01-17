const mongoose = require("mongoose");

const couponCodeUsesSchema = new mongoose.Schema(
  {
    codeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coupanCode",
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    airline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AirlineCode",
    },
    fromDate: {
      type: Date,
    },
    toDate: {
      type: Date,
    },
    cartId: {
      type: String, // need to be change from booking detail
    },
    tripType: {
      type: String,
      enum: ["Domestic", "International"],
      default: "Domestic",
    },
    couponValue: {
      type: Number,
    },
    cartValueBeforeApply: {
      type: Number,
    },
    cartValuePostApply: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const couponCodeUses = mongoose.model("couponCodeUses", couponCodeUsesSchema);
module.exports = couponCodeUses;
