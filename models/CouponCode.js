const mongoose = require("mongoose");

const coupanCodeSchema = new mongoose.Schema(
  {
    journeyType: {
      type: String,
      enum: ["Domestic", "International"],
      default: "Domestic",
    },
    rbd: {
      type: String,
      default: null,
    },
    discountType: {
      type: String,
      enum: ["Percentage", "Fixed"],
      default: "Fixed",
    },
    calculateTds: {
      type: Boolean,
      default: false,
    },
    minTicketValue: {
      type: Number,
    },
    maxDiscountValue: {
      type: Number,
    },
    agentThresholdTotalCount: {
      type: Number,
    },
    agentThresholdDayCount: {
      type: Number,
    },
    globalThresholdUsesCount: {
      type: Number,
    },
    globalThresholdValueCount: {
      type: Number,
    },
    codeName: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "InActive"],
      default: "InActive",
    },
    assignUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifyBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  {
    timestamps: true,
  }
);

const coupanCode = mongoose.model("coupanCode", coupanCodeSchema);
module.exports = coupanCode;
