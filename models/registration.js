const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', 
    },
    companyName: {
        type: String,
        required: true,
    },
    panNumber: {
        type: String,
        required: true,
    },
    panName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    saleInChargeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    gstNumber: {
        type: String,
        required: true,
    },
    gstName: {
        type: String,
        required: true,
    },
    gstAddress: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country', 
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State', 
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City', 
    },
    remark: String, 
    statusId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'status'
    },
    type: {
        type : String,
        required : true
    },
    isIATA: {
        type : Boolean,
        required : true
    }
},{
    timestamps : true  //Add created_at and updated_at coloumn
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
