const mongoose = require('mongoose');

const AirCommercialSchema = new mongoose.Schema({
    commercialAirPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CommercialAirPlanSchema'
    },
    travelType: {
        type: String,
        required: false,
        default: null
    },
    carrier: {
        type: String,
        required: false,
        default: null
    },
    cabinClass: {
        type: String,
        required: false,
        default: null
    },
    commercialCategory: {
        type: String,
        required: false,
        default: null
    },
    commercialType: {
        type: String,
        required: false,
        default: null
    },
    supplier: {
        type: String,
        required: false,
        default: null
    },
    source: {
        type: String,
        required: false,
        default: null
    },
    fareFamily: {
        type: String,
        required: false,
        default: null
    },
    RBD: {
        type: String,
        required: false,
        default: null
    },
    issueFromDate: {
        type: Date,
        required: false,
        default: null
    },
    issueToDate: {
        type: Date,
        required: false,
        default: null
    },
    travelFromDate: {
        type: Date,
        required: false,
        default: null
    },
    travelToDate: {
        type: Date,
        required: false,
        default: null
    },
    tourCodes: {
        type: String,  // Change to the correct data type if it's not a Date
        required: false,
        default: null
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastModifiedDate: {
        type: Date,
        required: false,
        default: null
    }
}, {
    timestamps: true  // Use "timestamps" instead of "timestamp"
});

module.exports = mongoose.model('AirCommercial', AirCommercialSchema);
