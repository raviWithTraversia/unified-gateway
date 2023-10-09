const mongoose = require("mongoose");

const evenLogSchema = new mongoose.Schema({
    eventName : {
        type: String,
        required: false,        
        default: null
    },
    doerId : {
        type : String,
        required : false,
        default : null
    },
    doerName : {
        type : String,
        required : false,
        default : null
    },
    ipAddress : {
        type : String,
        required : false,
        default : null
    },
    companyId : {
        type : String,
        required : false,
        default : null  
    } 
},{
    timestamps: true // Adds created_at and updated_at fields
});

module.exports = mongoose.model('EventLog' , evenLogSchema);