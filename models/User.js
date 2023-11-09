const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({       
    company_ID: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    userType: {
        type: String
    },
    login_Id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    deactivation_Date: {
        type: String,
        default: null
    },
    logoURI: {
      type: String
    },
    roleId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    title: {
        type : String,
        required : true
    },
    fname:  {
        type : String,
        required : true
    },
    lastName:  {
        type : String,
        required : true
    },
    password:  {
        type : String,
        required : true
    },
    securityStamp: String,
    phoneNumber:  {
        type : String,
        required : true
    },
    twoFactorEnabled: Boolean,
    lockoutEnabled: Boolean,
    accessfailedCount: Number,
    emailConfirmed: Boolean,
    phoneNumberConfirmed: Boolean,
    userStatus: String,
    userPanName: String,
    userPanNumber: String,
    created_Date: Date,
    lastModifiedDate: Date,
    userModifiedBy: String,
    last_LoginDate: Date,
    activation_Date: Date,
    sex: String,
    dob: Date,
    nationality: String,
    deviceToken: String,
    deviceID: String,
    user_planType: Number,
    sales_In_Charge: Boolean,
    personalPanCardUpload: String,
    resetToken: String,
    ip_address : String  
}, {
    timestamps: true // Adds created_at and updated_at fields
  });

const User = mongoose.model("User", userSchema);

module.exports = User; // Export the User model

