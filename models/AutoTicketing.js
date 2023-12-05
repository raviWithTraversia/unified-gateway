const mongoose = require('mongoose');

const autoTicketingConfig = new mongoose.Schema({
    userId : {
      type :  mongoose.Schema.Types.ObjectId,
      ref : 'User'
    },
    airLineList : {
       type : String
    },
    provider : {
       type : String
    },
    travelType : {
       type : String
    }
});
const autoTicketing = mongoose.model("autoTicketing", autoTicketingConfig);
module.exports = autoTicketing;