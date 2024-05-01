const mongoose = require('mongoose');

const protalApiLogSchema = new mongoose.Schema({
    traceId : {
        type : String,
        required : false,
        default : null
    },
    companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    source : {
        type : String,
        required : false,
        default : null
    },
    type : { // portal log / api logs
        type : String,
        required : false,
        default : null
    },
    product : { // Flight , Hotel 
        type : String,
        required : false,
        default : null
    },
    BookingId : { // Flight , Hotel 
        type : String,
        required : false,
        default : null
    },    
    logName : { // search , airpricing, booking 
        type : String,
        required : false,
        default : null
    },
    request : {
        type : String,
        required : false,
        default : null
    },
    responce : {
        type : String,
        required : false,
        default : null 
    } 
}, {
    timestamps: true // Adds created_at and updated_at fields
}
);

module.exports = mongoose.model('PortalApiLog' , protalApiLogSchema);