const mongoose = require('mongoose');

const autoTicketingConfig = new mongoose.Schema({
    airLineList : {
       type : String
    },
    provider : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'SupplierCode'
    },
    travelType : {
       type : String
    },
    companyId : {
      type :  mongoose.Schema.Types.ObjectId,
      ref : 'Company'
    },
    modifyBy : {
      type :  mongoose.Schema.Types.ObjectId,
      ref : 'User'
    },
    fareFamily : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'FareFamilyMaster'
    },
    queueNumber : {
       type : String
    },
    queueOfficeId : {
      type : String
   },
   queuePcc : {
    type : String
 },
 status : {
  type : String
},
ticketingOn : {
  type : String
},
ticketingType : {
  type : String
},

}, {
   timestamps : true
});
const autoTicketing = mongoose.model("autoTicketing", autoTicketingConfig);
module.exports = autoTicketing;