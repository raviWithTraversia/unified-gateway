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
        ref: 'AirlineCode'
    },
    commercialCategory: {
        type: String,
        required: false,
        default: null
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SupplierCode'
    },
    source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SupplierCode'
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
