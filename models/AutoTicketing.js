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
    }
}, {
   timestamps : true
});
const autoTicketing = mongoose.model("autoTicketing", autoTicketingConfig);
module.exports = autoTicketing;