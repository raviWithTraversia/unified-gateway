const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({       
    company_ID: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: true,
    },
    login_Id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    title: String,
    fname: String,
    lastName: String,
    password: String,
    securityStamp: String,
    phoneNumber: String,
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
    deactivation_Date: Date,
    sex: String,
    dob: Date,
    nationality: String,
    deviceToken: String,
    deviceID: String,
    user_planType: Number,
    sales_In_Charge: Boolean,
    personalPanCardUpload: String,
    isNewUser: Boolean,
    resetToken: String,
    
}, {
    timestamps: true // Adds created_at and updated_at fields
  });

const User = mongoose.model("User", userSchema);

module.exports = User; // Export the User model

