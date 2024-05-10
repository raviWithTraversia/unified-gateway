const mongoose = require("mongoose");

const fareRuleSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  origin: {
    type: String,
  },
  destination: {
    type: String,
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SupplierCode",
  },
  airlineCodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AirlineCode",
  },
  fareFamilyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FareFamilyMaster",
  },
  cabinclassId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CabinClassMaster",
  },
  travelType: {
    type: String,
  },
  validDateFrom: {
    type: Date,
  },
  validDateTo: {
    type: Date,
  },
  status: {
    type: Boolean,
  },
  desceription: {
    type: String,
  },
  rbd: {
    type: String,
  },
  fareBasis: {
    type: String,
  },
  CBHA: { //  cancel before 96 hours
    type: Number,
    default: 0,
  },
  CWBHA: { // cancel within 96 hours
    type: Number,
    default: 0,
  },
  RBHA: { // reshedule before 96 hours 
    type: Number,
    default: 0,
  },
  RWBHA: { // Reshedule within 96 hours 
    type: Number,
    default: 0,
  },
  SF: { // Service Fee
    type: Number,
    default: 0,
  },
  modifyAt: {
    type: Date,
  },
  modifyBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const fareRule = mongoose.model("fareRule", fareRuleSchema);
module.exports = fareRule;
