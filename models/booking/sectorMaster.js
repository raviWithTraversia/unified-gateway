const mongoose = require("mongoose");
const sectorMasterSchema = new mongoose.Schema(
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
    prodBookingId: {
      // 1,2,3,4,5,6,7,8,9
      type: String,
      default: null,
    },
    JourneyType: { type: String, default: null }, // "MULTYCITY", "ONEWAY", "ROUNDTRIP"
    lastTktDate: { type: String, default: null },
    origin: { type: String, default: null },
    destination: { type: String, default: null },
    validatingCarrier: { type: String, default: null },
    cabinClass: { type: String, default: null },
    ticketIssuedDatenTime: {
      type: Date,
      default: Date.now(),
    },
    fareFamily: {
      type: String,
      default: null,
    },
    fare_Basis: {
      type: String,
      default: null,
    },
    nonRefundable: {
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

const sectorMaster = mongoose.model("sectorMaster", sectorMasterSchema);
module.exports = sectorMaster;
