const mongoose = require('mongoose');

const depositePaymentRequestSchema = new mongoose.Schema({
    serialNumber: { type: Number, required: true, unique: true },
    agentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    topupAmount : {
        type : Number
    },
    remarks : { 
       type : String 
    },
    paymentMode : {
      type : String,
      enum : ['Online' , 'Manual']
    },
    paymentRequestType : {
        type : String,
        enum : ['PENDING', 'ACCEPTED']
    }

}, {
    timestamps : true
});
const depositePaymentRequest = mongoose.model("depositePaymentRequest",depositePaymentRequestSchema);
depositePaymentRequestSchema.pre('save', async function (next) {
    if (!this.serialNumber) {
        const count = await depositePaymentRequest.countDocuments();
        this.serialNumber = count + 1;
    }
    next();
});
module.exports = depositePaymentRequest;

