const mongoose = require('mongoose');
const markupMasterData = require('./MangeMarkupMaster')

const markupDataSchema =  new mongoose.Schema ({
  markupData: [markupMasterData.schema],
  markupOn: {
    type: String,
    enum : ['Domestic', 'International'],
    default: 'Domestic'
  },
  markupFor: {
    type: String,
    enum : ['Ticket', 'Coupan'],
    default: 'Ticket'
  },
  airlineCodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AirlineCode'
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  isDefault: {
    type : Boolean,
    default : false
  },
  createdAt : {
   type : Date
  },
  modifyAt : {
   type : Date,
   default : new Date()
  },
  createdBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },
  modifyBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },
}, {
    timestamps : true
});

const manageMarkup = mongoose.model("manageMarkup", markupDataSchema);
module.exports = manageMarkup;