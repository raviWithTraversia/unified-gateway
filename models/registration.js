const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    companyId: {
        type : String,
        required : true
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
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    remark: String, 
    statusId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'status'
    },
},{
    timestamps : true  //Add created_at and updated_at coloumn
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
