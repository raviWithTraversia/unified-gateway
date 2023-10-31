const mongoose = require('mongoose');

const AirCommercialSchema = new mongoose.Schema({
    commercialAirPlanId: {
        type : mongoose.Schema.Types.ObjectId,
        'ref' : 'CommercialAirPlanSchema'
    },
    travelType: {
        type : String,
        required : false,
        default : null
    },
    carrier: {
        type : String,
        required : false,
        default : null
    },
    cabinClass: {
        type : String,
        required : false,
        default : null
    },
    commercialCategory: {
        type : String,
        required : false,
        default : null
    },
    supplier: {
        type : String,
        required : false,
        default : null
    },
    source: {
        type : String,
        required : false,
        default : null
    },
    fareFamily: {
        type : String,
        required : false,
        default : null
    },
    issueFromDate: {
        type : Date,
        required : false,
        default : null
    },
    issueToDate: {
        type : Date,
        required : false,
        default : null
    },
    travelFromDate: {
        type : Date,
        required : false,
        default : null
    },
    travelToDate: {
        type : Date,
        required : false,
        default : null
    },
    tourCodes: {
        type : Date,
        required : false,
        default : null
    },
    modifiedBy: {
        type : String,
        required : false,
        default : null
    },
    lastModifiedDate: {
        type : String,
        required : false,
        default : null
    }
},{
    timestamp : true
});

module.exports = mongoose.model('AirCommercial' , AirCommercialSchema);