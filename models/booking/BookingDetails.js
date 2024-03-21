const mongoose = require("mongoose");
const bookingDetailsSchema = new mongoose.Schema(
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
    provider: {
      type: String,
      default: null,
    },
    bookingType: {
      // The type of booking (e.g., "Staff", "Agency", etc.)
      type: String,
      default: null,
    },
    bookingDateTime: {      
      type: Date,
      default: Date.now,
    },
    bookingStatus: {
      type: String,
      default: null,
      // enum: ['INCOMPLETE', 'FAILED','CONFIRMED','CANCELLED','PENDING']
    },
    bookingRemarks: {
      type: String,
      default: null,
    },
    bookingTotalAmount: {
      type: Number,
      default: 0,
    },
    PNRConfirmation: {
      type: String,
      default: null,
    },
    sourceMedia: {
      type: String,
      default: null,
    },
    productType: {
      type: String,
      default: "Flight",
    },
    Supplier: {
      // KAfila, 1G, ACH
      type: String,
      default: null,
    },
    mailIssued: {
      type: Boolean,
      default: false,
    },
    PNRConfirmation: {
      type: String,
      default: null,
    },
    creationDate: {
      type: Date,
      default: Date.now(),
    },
    travelType: {
      type: String,
      enum: ["Domestic", "International"],
    },
    booking_Type: {
      type: String,
      enum: ["Automated", "Manual"],
    },
    bookingCancelDate: {
      type: Date,
      default: Date.now(),
    },
    invoiceNo: {
      type: String,
      default: null,
    },
    invoicingDate: {
      type: Date,
      default: Date.now(),
    },
    PromoCode: {
      type: String,
      default: null,
    },
    universalPNR: {
      type: String,
      default: null,
    },
    cancelledRemarks: {
      type: String,
      default: null,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amendmentType: {
      type: String,
      default: null,
    },
    searchId: {
      type: String,
      default: null,
    },
    bookingGST: {
      GSTNumber: { type: String, default: null },
      GSTEmail: { type: String, default: null },
      GSTHolderName: { type: String, default: null },
      GSTPhoneNumber: { type: String, default: null },
      GSTAddress: { type: String, default: null },
      GSTStateCode: { type: String, default: null },
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

const BookingDetails = mongoose.model("BookingDetails", bookingDetailsSchema);
module.exports = BookingDetails;
