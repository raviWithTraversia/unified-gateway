const mongoose = require("mongoose");

const PassengerSchema = new mongoose.Schema({
  passengerSerialNumber: { type: Number, default: null },
  passengerName: { type: String, default: null },
  passengerAge: { type: Number, default: null },
  passengerGender: { type: String, default: null },
  passengerBerthChoice: { type: String, default: null },
  passengerBedrollChoice: { type: String, default: null },
  passengerConcession: { type: String, default: null },
  passengerIcardFlag: { type: Boolean, default: false },
  childBerthFlag: { type: Boolean, default: false },
  passengerNationality: { type: String, default: null },
  fareChargedPercentage: { type: Number, default: null },
  validationFlag: { type: String, default: null },
  bookingStatusIndex: { type: Number, default: null },
  bookingStatus: { type: String, default: null },
  bookingCoachId: { type: String, default: null },
  bookingBerthNo: { type: Number, default: null },
  bookingBerthCode: { type: String, default: null },
  currentStatusIndex: { type: Number, default: null },
  currentStatus: { type: String, default: null },
  currentCoachId: { type: String, default: null },
  currentBerthNo: { type: Number, default: null },
  currentBerthCode: { type: String, default: null },
  passengerNetFare: { type: Number, default: null },
  currentBerthChoice: { type: String, default: null },
  insuranceIssued: { type: String, default: null },
  psgnwlType: { type: Number, default: null },
  dropWaitlistFlag: { type: Boolean, default: false },
});
const GstChargeSchema = new mongoose.Schema({
  totalPRSGst: { type: Number, default: null },
  irctcCgstCharge: { type: Number, default: null },
  irctcSgstCharge: { type: Number, default: null },
  irctcIgstCharge: { type: Number, default: null },
  irctcUgstCharge: { type: Number, default: null },
  totalIrctcGst: { type: Number, default: null },
});

// Meal Transaction Schema
const MealTransactionSchema = new mongoose.Schema({
  ticketId: { type: Number, default: null },
  reservationId: { type: Number, default: null },
  mealBooked: { type: Boolean, default: false },
  tktCanStatus: { type: Number, default: null },
  bookingMode: { type: Number, default: null },
  bookingSource: { type: Number, default: null },
});
const ReservationSchema = new mongoose.Schema({
  reservationId: { type: String, default: null },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  AgencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
  },
  cartId: { type: String, default: null },

  bookingStatus: {
    type: String,
    default: "INCOMPLETE",
    enum: ["CONFIRMED", "PENDING", "FAILED", "CANCELLED", "INCOMPLETE"],
  },

  lapNumber: { type: Number, default: null },
  numberOfpassenger: { type: Number, default: null },
  timeTableFlag: { type: Number, default: null },
  pnrNumber: { type: String, default: null },
  departureTime: { type: String, default: null },
  arrivalTime: { type: String, default: null },
  reasonType: { type: String, default: null },
  reasonIndex: { type: Number, default: null },
  informationMessage: [{ type: String, default: null }],
  destArrvDate: { type: String, default: null }, // Consider converting to a Date object if needed
  bookingDate: { type: Date, default: null }, // Consider converting to a Date object if needed
  numberOfChilds: { type: Number, default: null },
  numberOfAdults: { type: Number, default: null },
  trainNumber: { type: String, default: null },
  fromStn: { type: String, default: null },
  destStn: { type: String, default: null },
  resvnUptoStn: { type: String, default: null },
  fromStnName: { type: String, default: null },
  boardingStnName: { type: String, default: null },
  resvnUptoStnName: { type: String, default: null },
  journeyClass: { type: String, default: null },
  journeyQuota: { type: String, default: null },
  insuranceCharge: { type: Number, default: null },
  totalCollectibleAmount: { type: Number, default: null },
  psgnDtlList: [PassengerSchema], // Embedded Passenger Schema
  clientTransactionId: { type: String, default: null },
  scheduleDepartureFlag: { type: Boolean, default: false },
  scheduleArrivalFlag: { type: Boolean, default: false },
  serviceChargeTotal: { type: Number, default: null },
  ticketType: { type: String, default: null },
  bookedQuota: { type: String, default: null },
  avlForVikalp: { type: Boolean, default: false },
  gstCharge: GstChargeSchema, // Embedded GST Schema
  gstFlag: { type: Boolean, default: false },
  monthBkgTicket: { type: Number, default: null },
  sai: { type: Boolean, default: false },
  journeyLap: { type: Number, default: null },
  sectorId: { type: Boolean, default: false },
  canSpouseFlag: { type: Boolean, default: false },
  mahakalFlag: { type: Boolean, default: false },
  tourismUrl: { type: String, default: null },
  rrHbFlag: { type: String, default: null },
  mealTransaction: MealTransactionSchema, // Embedded Meal Transaction Schema
  mealChoiceEnable: {type:Boolean,default:false},
  complaintFlag: {type:Number,default:null},
  travelnsuranceRefundAmount: {type:Number,default:null},
  totalRefundAmount: {type:Number,default:null},
  addOnOpted: {type:Boolean,default:false},
  metroServiceOpted: {type:Boolean,default:false},
  eligibleForMetro: {type:Boolean,default:false},
  multiLapFlag: {type:Boolean,default:false},
  mlUserId: {type:Number,default:null},
  paymentMethod:{type:String,default:null},
  mlReservationStatus: {type:Number,default:null},
  mlTransactionStatus: {type:Number,default:null},
  mlJourneyType: {type:Number,default:null},
  timeDiff: {type:Number,default:null},
  mlTimeDiff: {type:Number,default:null},
  travelProtectOpted: {type:Boolean,default:false},
  postMealRefundStatusId: {type:Number,default:null},
  postMealRefundAmount: {type:Number,default:null},
  postMealCancellationCharge: {type:Number,default:null},
  postMealComplaintFlag: {type:Number,default:null},
  postMealOpt: {type:Boolean,default:false},
  mealCancellationId: {type:Number,default:null},
  dmrcRefundStatusId: {type:Number,default:null},
  dmrcRefundAmount: {type:Number,default:null},
  dmrcCancellationCharge: {type:Number,default:null},
  dmrcCancellationId: {type:Number,default:null},
  trainName: {type:String,default:null},
  distance: {type:Number,default:null},
  boardingStn: {type:String,default:null},
  boardingDate: {type:String,default:null}, // Consider converting to a Date object if needed
  journeyDate: {type:String,default:null},  // Consider converting to a Date object if needed
  trainOwner: {type:Number,default:null},
  reservationCharge: {type:Number,default:null},
  superfastCharge: {type:Number,default:null},
  fuelAmount: {type:Number,default:null},
  tatkalFare: {type:Number,default:null},
  serviceTax: {type:Number,default:null},
  cateringCharge: {type:Number,default:null},
  totalFare: {type:Number,default:null},
  wpServiceCharge: {type:Number,default:null},
  wpServiceTax: {type:Number,default:null},
  insuredPsgnCount: {type:Number,default:null},
  serverId: {type:String,default:null},
  jClass:{type:String,default:""},
  reservationMode:{type:String,default:""},
  mobileNumber:{type:String,default:""},
  emailId:{type:String,default:""},
  jQuota:{type:String,default:""}
 
},{timestamps:true});


// const bookingDetailsRailSchema = new mongoose.Schema(

//     {
//         companyId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "company",
//       },

//         userID:{
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "user",
//             required: true,

//     },

//     agencyId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },

//     credentialType:{
//         type: {type:String,default:null},
//       default:"TEST",
//     },

//     salesChannel:{
//         type: String,
//         enum: [ 'B2C','B2E', 'B2B'],
//     },

//     trainNo:{
//         type: String,
//         required: true,
//     },

//     ticketNo:{
//         type: {type:Number,default:null},
//         required: true,
//     },

//     ticketPnrNo:{
//         type: Number,
//         required: true,
//     },

//     departureDate:{
//         type: Date,
//         required: true,
//     },

//     arrivalDate:{
//         type: Date,
//         default: null,
//     },

//     boardingStation:{
//         type: String,
//         required: true,
//     },

//     dropStation:{
//         type: String,
//         required: true,
//     },

//     jClass:{
//         type: String,
//         default:"null",
//     },

//     jQuota:{
//         type: String,
//         default:"null",
//     },

//     noFSeats:{
//         type: Number,
//         default: 1,
//     },

//     bookingId:{
//         type: String,
//         required: true,
//     },

//     providerBookingId:{
//         type: String,
//         required: true,
//     },

//     bookingDate:{
//         type: Date,
//         default: new Date(),
//     },

//     ticketCharges:{
//         type: Number,
//         required: true,
//     },

//     totalCost:{
//         type: Number,
//         required: true,
//     },

//     createdBy: {
//         type : mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//       },

//       accountName: {
//         type: String,
//         required: true,
//       },
//       accountNumber: {
//         type: String,
//         required: true,
//       },
//       ifscCode: {
//         type: String,
//         required: true,
//       },
//       bankAddress: {
//         type: String,
//         required: true,
//       },
//       bankName: {
//         type: String,
//         required: true,
//       },
//       bankCode: {
//         type: String,
//         required: true,
//       },
//       QrcodeImagePath: {
//         type : String
//       },

//     createdAt:{
//         type: Date,
//         default: new Date(),

//     },

//     updatedAt:{
//         type: Date,
//         default: new Date(),
// },
//     },

//     {
//       timestamps: true,
//     }
//   );
const bookingDetailsRail = mongoose.model(
  "bookingDetailsRail",
  ReservationSchema
);
module.exports = bookingDetailsRail;
