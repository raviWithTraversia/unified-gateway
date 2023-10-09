const mongoose = require('mongoose');

const protalApiLogSchema = new mongoose.Schema({
    traceId : {
        type : String,
        required : false,
        default : null
    },
    companyId : {
        type : String,
        required : false,
        default : null
    },
    source : {
        type : String,
        required : false,
        default : null
    },
    product : {
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