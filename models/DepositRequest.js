const mongoose = require('mongoose');

const DepositRequestSchema = new mongoose.Schema({
    companyId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    agencyId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    depositDate : {
        type : Date,
        required : true,
        default : Date.now // Set the default value to the current date and time,
    },
    modeOfPayment : {
        type : String,
        require : false,
        default : null
    },
    purpose : {
        type : String,
        required : false,
        default : null
    },
    amount : {
        type : Number,
        min : 0,
        max : Number.MAX_SAFE_INTEGER,
        required : true,
        default : 0
    },    
    status : {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    remarks : {
        type : String,
        required : false,
        default : null
    },    
    createdDate : {
        type : Date,
        required : false,
        default : Date.now // Set the default value to the current date and time,
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },   
    product: {
        type : String,
        required : false,
        default : null
    }
},{
    timestamps : true  //add created_at and updated_at
});

module.exports = mongoose.model('DepositRequest' , DepositRequestSchema);