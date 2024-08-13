const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    company_ID: {
        type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    title: {
        type: String
    },
    fname: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, 'Password is Required']
    },
    securityStamp: {
        type: String,
        default: null
    },
    phoneNumber: {
        type: String,
        required: true
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
        type: Boolean,
        default: false
    },
    phoneNumberConfirmed: {
        type: Boolean,
        default: false
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    last_LoginDate: {
        type: Date,
        default: Date.now,
    },
    activation_Date: {
        type: Date,
        default: Date.now,
        default: null
    },
    sex: {
        type: String,
        default: null
    },
    dob: {
        type: Date,
        default: null
    },
    nationality: {
        type: String,
        default: "IN"
    },
    deviceToken: {
        type: String,
        default: null
    },
    deviceID: {
        type: String,
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
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City"
    },

    resetToken: String,
    ip_address: String,
    refreshToken: {
        type: String
    },
    userId: {
        type: Number,
        unique: true,
    },
    adhar_Detail:{
        type:Object,
        default:null
     },
    encryptUserId: {
        type: Object,
        default: {}
    }
}, { timestamps: true });
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1000 },
});

const Counter = mongoose.model("Counter", counterSchema);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
});
userSchema.pre("save", async function (next) {
    if (!this.isNew) return next();

    try {
        const counter = await Counter.findByIdAndUpdate({ _id: "userId" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        this.userId = counter.seq;
        const algorithm = 'aes-256-cbc';
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        let encrypted = cipher.update(this.userId.toString());
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        // Convert to base64 and truncate/pad to desired length
        let encryptedText = encrypted.toString('base64').substring(0, 5);
        this.encryptUserId = { encryptedText, key: key.toString('hex'), iv: iv.toString('hex') };
        //-=-=-=-=-=-=-=-=-=-=-=-=* function for decrypting the above encryption *=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=
        // function decrypt(encryptedText, key, iv) {
        //     const algorithm = 'aes-256-cbc';

        //     let encryptedBuffer = Buffer.from(encryptedText, 'base64');
        //     const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
        //     let decrypted = decipher.update(encryptedBuffer);
        //     decrypted = Buffer.concat([decrypted, decipher.final()]);

        //     return decrypted.toString();
        // }
        //-=-=-==-=-=--=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=-=        
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    let res = await bcrypt.compare(password, this.password);
    return await bcrypt.compare(password, this.password)
};
userSchema.methods.generateAccessToken = function () {
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
userSchema.methods.generateRefreshToken = function () {
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

