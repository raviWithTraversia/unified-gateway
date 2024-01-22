const mongoose = require('mongoose');

const depositePaymentRequestSchema = new mongoose.Schema({
    agentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    topupAmount : {
        type : Number
    },
    remarks : {
       type : String 
    }
});
const depositePaymentRequest = mongoose.model("depositePaymentRequest",depositePaymentRequestSchema);
module.exports = depositePaymentRequest;

