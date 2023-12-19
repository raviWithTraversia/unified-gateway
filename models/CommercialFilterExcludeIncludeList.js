const mongoose = require('mongoose');

const AirCommercialFilterListSchema = new mongoose.Schema({
    commercialAirPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CommercialAirPlanSchema'
    },
    airCommercialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AirCommercial' // Corrected 'ref' value
    },
    commercialFilter: [{
        commercialFilterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AirCommercialFilter'
        },
        type: {
            type: String, // Changed to String
            enum: ["exclude", "include"]
        },
        value: {
            type: String,
            default: null
        }
    }]
});


module.exports = mongoose.model('AirCommercialFilterList' , AirCommercialFilterListSchema)


