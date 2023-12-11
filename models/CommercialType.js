const mongoose = require('mongoose');

const CommercialTypeSchema = new mongoose.Schema({
    airCommercialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AirCommercial'
    },
    AirCommertialColumnMasterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AirCommercial'
    },
    AirCommertialRowMasterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AirCommercial'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    textType: {
        type : String,
        required : true,
        default : null
    }
}, {
    timestamps: true  // Use "timestamps" instead of "timestamp"
});

module.exports = mongoose.model('CommercialType', CommercialTypeSchema);
