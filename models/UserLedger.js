const mongoose = require('mongoose');
const userLedgerSchema = new mongoose.Schema({
    serialNumber: { type: Number, required: true, unique: true }, 
    transactionDate : {
        type : Date
    },
    referenceCartID	: {
        type : String
    },
    remarks : {
        type : String
    },
    transactionType : {
        type : String,
        enum : ['Credit','Debit']
    },
    debit : {
      type : Number
    },
    credit : {
      type : Number
    },
    runningBalance : {
        type : Number
    }
},{
    timestamps : true
});
userLedgerSchema.pre('save', async function (next) {
    if (!this.serialNumber) {
        const count = await depositePaymentRequest.countDocuments();
        this.serialNumber = count + 1;
    }
    next();
});