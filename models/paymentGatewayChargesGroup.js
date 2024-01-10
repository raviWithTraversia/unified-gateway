const mongoose = require('mongoose');

const paymentGatewayGroupSchema = new mongoose.Schema({
    paymentGatewayIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'paymentGatewayCharges'
      }],
      paymentGatewayGroupName : {
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
const paymentGatewayModel = mongoose.model("paymentGatewayGroupModel", paymentGatewayGroupSchema);
module.exports = paymentGatewayModel;