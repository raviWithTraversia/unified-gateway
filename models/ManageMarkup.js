const mongoose = require('mongoose');
const markupMasterData = require('./MangeMarkupMaster')

const markupDataSchema =  new mongoose.Schema ({
  markupData: [markupMasterData.schema],
  markupOn: {
    type: String,
    default: 'Domestic'
  },
  markupFor: {
    type: String,
    default: 'Ticket'
  },
  airlineCodeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'AirlineCode'
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'Company'
  },
  isDefault: {
    type : Boolean,
    required : false
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