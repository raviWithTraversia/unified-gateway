const mongoose = require("mongoose");
const amountChargesSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    bid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BookingDetails",
    },
    paxId:{ // 1,2,3,4,5,6,7,8
        type: String,
        default: null
    },    
    bookingId: {
      type: String,
      default: null
    },
    prodBookingId: {  // 1,2,3,4,5,6,7,8,9
        type: String,
        default: null
    },  
    chargesCategory: { // Basefare, Markup, Tax, BookingFees
    type: String,
    default: null 
    },
    chargeType: { // Basefare, Markup, Tax, BookingFees,IGST
     type: String,
     default: null 
    },    
    chargesFor: { // ADT, CHD, IFT
        type: String,
        default: null 
    },
    costPrice: { // 
        type: Number,
        default: 0 
    },
    sellPrice: { // 
        type: Number,
        default: 0 
    },
    chargesStatus: { 
        type: String,
        default:null
    },
    supplierId: { 
        type: String,
        default:null
    },
    chargesRemarks: { 
        type: String,
        default:null
    },
    bookingRemarks: { 
        type: String,
        default: null       
    },
    chargesDate: { 
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
    }    
  },
  {
    timestamps: true,
  }
);

const amountCharges = mongoose.model(
  "amountCharges",
  amountChargesSchema
);
module.exports = amountCharges;
