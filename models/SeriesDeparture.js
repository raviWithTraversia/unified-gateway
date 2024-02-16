const mongoose = require("mongoose");

const seriesDepartureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  pnr: {
    type: String,
    unique: true,
  },
  accountCode: {
    type: Number,
  },
  flightType: {
    type: String,
    enum: ["D", "I"],
  },
  cabinClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CabinClassMaster",
  },
  tripType: {
    type: String,
    enum: ["O", "R"],
  },
  fareName: {
    type: String,
  },
  aircraftType: {
    type: String,
  },
  airLineCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AirlineCode",
  },
  flightNumber: {
    type: String,
  },
  originAirportCode: {
    
  },
  originAirportTerminal: {
    type : String
  },
  destinationAirportCode: {},
  destinationAirportTerminal: {
    type : String
  },
  departureDate: {
    type : Date
  },
  departureTime: {
    type : Time
  },
  arrivalDate: {
    type : Date
  },
  arrivaltime: {},
  Distance: {
    type : Number
  },
  travelTime: {
    type : Number
  },
  stops: {
    type : Number
  },
  totalSeats: {
    type : Number
  },
  availableSeats: {
    type : Number
  },
  rbd: {
    type: String,
    enum: ["Y", "N"],
  },
  baseAmount: {
    type: Number,
  },
  fuleSurcharge: {
    type: Number,
  },
  taxAmount: {
    type: Number,
  },
  baseAmountChd: {
    type: Number,
  },
  fuleSurchargeChd: {
    type: Number,
  },
  taxAmountChd: {
    type: Number,
  },
  baseAmountInf: {
    type: Number,
  },
  fuleSurchargeInf: {
    type: Number,
  },
  taxAmountInf: {
    type: Number,
  },
  carryOnAllowance : {
    type : String
  },
  baggageAllowance : {
    type : String
  },
  isRefundable : {
    type : Boolean
  },
  canclePenalty : {
    type : String
  },
  changePenalty : {
    type : String
  },
  isActive : {
    type : Boolean
  },
  baseAmountConst : {
    type : Number
  },
  fuleSurchargeConst : {
    type : Number
  },
  taxAmountConst : {
    type : Number
  },
  baseAmountChildConst : {
    type : Number
  },
  fuleSurchargeChildConst : {
    type : Number
  },
  taxAmountChildConst : {
    type : Number
  },
  baseAmountInftConst : {
    type : Number
  },
  fuleSurchargeInftConst : {
    type : Number
  },
  taxAmountInftConst : {
    type : Number
  },
  airLineDetails : {
    type : Object
  }


});
