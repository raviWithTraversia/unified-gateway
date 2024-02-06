const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', 
        default : '6538c030475692887584081e'
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
        default: null
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        trim: true
        
    },
    gstNumber: {
        type: String,
        default: null
    },
    gstName: {
        type: String,
        default: null
    },
    gstAddress_1: {
        type: String,
        default : null
    },
    gstAddress_2: {
        type: String,
        default : null
    },
    street: {
        type: String,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status',
        default: '6544519c2e87b61867441992'
    },
    isIATA: {
        type : Boolean,
        default : false
    },
    gstState : {
        type: String,
        default : null
    },
    gstPinCode : {
        type: String,
        default : null
    },
    gstCity : {
        type: String,
        default : null
    },
    roleId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    agencyGroupId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'agencyGroupModel' 
    },
    parent : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default : null
    },
},{
    timestamps : true  //Add created_at and updated_at coloumn
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;