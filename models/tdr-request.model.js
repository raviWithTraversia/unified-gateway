const { Schema, model } = require("mongoose");

const tdrRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    txnId: String,
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Processing", "Completed", "Failed"],
    },
    failReason: String,
    irctcUserId: String,
    passengerToken: String,
    irctcTdrResponse: {},
  },
  { timestamps: true }
);

const TDRRequest = model("TDRRequest", tdrRequestSchema);
module.exports = TDRRequest;
