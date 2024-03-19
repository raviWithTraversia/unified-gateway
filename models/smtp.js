const mongoose = require('mongoose');
const smtpConfigSchema = new mongoose.Schema({
    companyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    host : {
        type : String,
        required : true
    },
    port : {
        type : Number,
        required : true
    },
    security : {
        type : String ,
        enum : ['SSL' , 'TLS', 'Default SSL'],
        required : true
    },
    userName : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    emailFrom : {
        type : String,
        required : true
    },
    status : {
        type : Boolean,
        required : true
    }
});
const SmtpConfig = mongoose.model("SmtpConfig", smtpConfigSchema);
module.exports = SmtpConfig;