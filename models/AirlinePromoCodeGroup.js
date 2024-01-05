const mongoose = require('mongoose');

const airlinePromoCodeGroupSchema = new mongoose.Schema({
    airlinePromcodeIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'airlinePromoCode'
      }],
      airlinePromcodeGroupName : {
        type : String
      },
      modifyAt :{
        type : Date,
        default : Date.now
      },
      modifyBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
      },
      companyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Company'
      },
      isDefault : {
        type : Boolean,
        default: false
      }
},{
    timestamps : true
});
const airlinePromoCodeGroupModel = mongoose.model("airlinePromoCodeGroupModel", airlinePromoCodeGroupSchema);
module.exports = airlinePromoCodeGroupModel;