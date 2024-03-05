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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AirlineCode',
        default : null,
    },
    commercialCategory: {
        type: String,
        required: false,
        default: null
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SupplierCode',
        default : null,
    },
    source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SupplierCode',
        default : null,
    },
    fareFamily: {
        type: mongoose.Schema.Types.ObjectId,
        'ref': 'FareFamilyMaster',
        default : null
    },
    priority: {
        type: String,
        required: false,
        default: null
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
}, {
    timestamps: true  // Use "timestamps" instead of "timestamp"
});

module.exports = mongoose.model('AirCommercial', AirCommercialSchema);
