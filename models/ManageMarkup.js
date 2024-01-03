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
    type: String,
    required: true
  },
  companyId: {
    type: String,
    required: true
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
  }
}, {
    timestamps : true
});

const manageMarkup = mongoose.model("manageMarkup", markupDataSchema);
module.exports = manageMarkup;