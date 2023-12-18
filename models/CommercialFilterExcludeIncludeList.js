const mongoose = require('mongoose');

const AirCommercialFilterListSchema = new mongoose.Schema({
    commercialAirPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CommercialAirPlanSchema'
    },
    airCommercialId: {
        type : mongoose.Schema.Types.ObjectId,
        'ref': 'AirCommercial'
    },
    commercialFilterId: {
        type : mongoose.Schema.Types.ObjectId,
        'ref': 'AirCommercialFilter'
    },
    type:{
        type: String,
        default : null
    },
    value:{
        type: String,
        default : null
    }
});

module.exports = mongoose.model('AirCommercialFilterList' , AirCommercialFilterListSchema)