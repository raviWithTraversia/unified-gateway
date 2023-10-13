const { boolean } = require('joi');
const mongoose = require('mongoose');

const emailSchema  = new mongoose.schema({

    companyId : {
        type : String,
        required : true
    },
    EmailConfigDescriptionId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'EmailConfigDiscription'
    },

    mailDescription : {
        type : String,
        required : true
    },
    emailCc : {
        type : String,
        required : true
    },
    emailBcc : {
        type : String,
        required : true
    },

    smptConfigId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'smtp'
    },
    
    status : {
        type : Boolean,
        required : true
    }
})

const emailConfig = mongoose.model("emailConfig", emailSchema);

module.exports = emailConfig;