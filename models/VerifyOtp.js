const { number } = require("joi");
const mongoose = require("mongoose");


    const otpSchema = new mongoose.Schema({
        otpFor : {
           type : String,
           required : true
        },
        typeName : {
            type : String,
            required : true
        },
        otp : {
            type : Number,
            required : true
        },
        otpExpireTime: {
            type: Date,
            required: true,
            default: Date.now() + 60 * 1000, 
          },

        status : {
            type : Boolean,
            required : true,
            default : true
        }
    }, {
      timestamps : true   
    });

    
const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp; // Export the Otp model