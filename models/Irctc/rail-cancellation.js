const { Schema, model } = require("mongoose");

const railCancellationSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reservationId: { type: String, required: true, unique: true },
    txnId: { type: String, required: true },
    passengerToken: { type: String, required: true },
    isSuccess: Boolean,
    refundAmount: Number,
    pnrNo: String,
    amountCollected: Number,
    cashDeducted: Number,
    cancelledDate: Date,
    name: [String],
    currentStatus: [String],
    cancellationId: String,
    gstChargeDTO: {},
    gstFlag: Boolean,
    serverId: String,
    timeStamp: Date,
    travelInsuranceRefundAmount: Number,
    addonServiceFlag: String,
    status: {
      type: String,
      enum: ["pending", "cancelled", "issued", "refund"],
      default: "pending",
    },
    isRefunded: {
      type: Boolean,
      default: false,
    },
    dmrcFlag: String,
    metroBookingAmnt: String,
    cancellationChargeMetro: String,
    refundAmntMetro: String,
    dmrcCancellationId: String,
    totalCanCountMetro: String,
    dmrcCanPsgnFare: String,
    dmrcErrorCode: String,
    noOfPsgn: Number,
  },
  { timestamps: true }
);

const RailCancellation = model("RailCancellation", railCancellationSchema);
module.exports = RailCancellation;
