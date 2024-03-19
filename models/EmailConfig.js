const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({  // Changed mongoose.schema to mongoose.Schema

    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
    EmailConfigDescriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'emailConfigDiscription'
    },
    mailDescription: {
        type: String,
        required: true
    },
    emailCc: {
        type: String,
        required: true
    },
    emailBcc: {
        type: String,
        required: true
    },
    smptConfigId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SmtpConfig'
    },
    status: {
        type: Boolean,  // Corrected the type to Boolean
        required: true
    },
    productType : {
      type : String
    }
});

const emailConfig = mongoose.model("emailConfig", emailSchema);

module.exports = emailConfig;
