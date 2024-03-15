const mongoose = require("mongoose");
const bookingDetailsSchema = new mongoose.Schema({
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
      default: null
    },  
    provider: {
    type: String,
    default: null 
    },
    bookingType: { // The type of booking (e.g., "Staff", "Agency", etc.)
     type: String,
     default: null 
    },
    bookingDateTime: { // 9/14/2023  3:46:53 PM
        type: Date,
        default: Date.now(),
    },
    bookingStatus: { 
        type: String,
       // enum: ['INCOMPLETE', 'FAILED','CONFIRMED','CANCELLED','PENDING']
    },
    bookingRemarks: { 
        type: String,
        default: null       
    },      
    bookingTotalAmount: {
      type: Number,
      default : 0
    },
    PNRConfirmation: {
        type: String,
        default : null
    },
    sourceMedia: {
        type: String,
        default : null
    },
    productType: {
        type: String,
        default : "Flight"
    },
    Supplier: { // KAfila, 1G, ACH
        type: String, 
        default : null      
    },
    mailIssued: {
        type: Boolean, 
        default : 0      
    },
    PNRConfirmation: {
        type: String, 
        default : null      
    },
    creationDate: { 
        type: Date,
        default: Date.now(),
    },
    travelType: { 
        type: String,
        enum: ['Domestic', 'International']
    },
    booking_Type: { 
        type: String,
        enum: ['Automated', 'Mannual']
    },
    bookingCancelDate: { 
        type: Date,
        default: Date.now(),
    },
    invoiceNo: { 
        type: String,
        default: null,
    },
    invoicingDate:{
        type: Date,
        default : Date.now(),
    },
    PromoCode:{
        type: String,
        default : null,
    },
    universalPNR:{
        type:String,
        default:null
    },
    cancelledRemarks:{
        type:String,
        default:""
    },
    cancelledBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    amendmentType:{
        type:String,
        default:null
    },
    searchId:{
        type:String,
        default:null
    },    
    passengerDetails: [{
      bookingAmendmentId: { type: String, default:null },
      title: { type: String, default:null },
      firstName: { type: String, default:null },
      middleName: { type: String, default:null },
      lastName: { type: String, default:null },
      dob: { type: String, default:null },
      paxType:{ type: String, default:null },
      paxSex:{type:String, enum:['M','F'] },
      modifyBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
      modifyAt: { type: Date, default: Date.now() },
      ticketNumber: { type: String, default:null }, 
      passNumber: { type: String, default:null },
      passIssueDate: { type: Date, default:Date.now() },
      expiryDate: { type: Date, default:Date.now() },
      bookingStatus: { type: String, default:null }, // OPEN, AMENDED, UNDER PROCESS
      amendmentRefNo: { type: String, default:null },
    }],     
       
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

const BookingDetails = mongoose.model(
  "BookingDetails",
  bookingDetailsSchema
);
module.exports = BookingDetails;
