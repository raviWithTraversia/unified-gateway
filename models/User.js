const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({       
    company_ID: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    userType: {
        type: String,
        default: null
    },
    login_Id: {
        type: String,
        default: null
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
      type: String,
      default: null
    },
    roleId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    title: {
        type : String
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
        required : [true, 'Password is Required']
    },
    securityStamp: {
        type: String,
        default: null
    },
    phoneNumber:  {
        type : String,
        required : true
    },
    twoFactorEnabled: {
        type: Boolean,
        default: null
    },
    lockoutEnabled: {
        type: Boolean,
        default: null
    },
    accessfailedCount: {
        type: Number,
        default: null
    },
    emailConfirmed: {
        type : Boolean,
        default : false
    },
    phoneNumberConfirmed: {
        type : Boolean,
        default : false
    },
    userStatus: {
        type: String,
        default: null
    },
    userPanName: {
        type: String,
        default: null
    },
    userPanNumber: {
        type: String,
        default: null
    },
    created_Date: {
        type: Date,
         default: Date.now,
    },
    lastModifiedDate: {
        type: Date,
        default: Date.now,
    },
    userModifiedBy: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    last_LoginDate:  {
        type: Date,
        default: Date.now,
    },
    activation_Date: {
        type: Date,
        default: Date.now,
        default: null  
    },
    sex: {
      type : String,
      default: null  
    },
    dob: {
        type: Date,
        default: null    
    },
    nationality: {
        type : String,
        default : "IN"
    },
    deviceToken: {
        type : String,
        default: null 
    },
    deviceID: {
        type : String,
        default: null 
    },
    sales_In_Charge: {
        type: Boolean,
        default: false
    },
    personalPanCardUpload: {
        type: String,
        default: null
    },
    modifiedBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      cityId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "City"
      },
     
    resetToken: String,
    ip_address : String,
    refreshToken : {
        type : String
    },
    userId: {
        type: Number,
        unique: true,
      },
}, {
    timestamps: true 
  });
  const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1000 },
  });
  
  const Counter = mongoose.model("Counter", counterSchema);

userSchema.pre("save", async function (next) {
    console.log("===>>>>>>>",this.password, "<<<<<<<================");
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
});
userSchema.pre("save", async function (next) {
    if (!this.isNew) return next();
  
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "userId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
  console.log("====>>>>", counter,)
      this.userId = counter.seq;
  console.log(this.userId)
      next();
    } catch (error) {
      next(error);
    }
  });

userSchema.methods.isPasswordCorrect = async function(password){
    console.log(this.password)
    let res =  await bcrypt.compare(password, this.password);
    console.log("========>", res , "p???????????????????")
    return await bcrypt.compare(password, this.password)
};
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fname: this.fname,
            lastName: this.lastName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};

const User = mongoose.model("User", userSchema);

module.exports = User; 

