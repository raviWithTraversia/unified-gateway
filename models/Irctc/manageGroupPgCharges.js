const mongoose = require('mongoose');

const railpaymentGatewayGroupSchema = new mongoose.Schema({
    paymentGatewayIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'railPaymentGatewayCharges'
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
const railpaymentGatewayModel = mongoose.model("railPaymentGatewayGroupModel", railpaymentGatewayGroupSchema);
module.exports = railpaymentGatewayModel;