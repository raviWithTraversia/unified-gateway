const mongoose = require('mongoose');

const AirCommercialRateSchema = new mongoose.Schema({
    airCommercialId: {
        type : mongoose.Schema.Types.ObjectId,
        'ref': 'AirCommercial'
    },
    airCommertialRowMasterId: {
        type : mongoose.Schema.Types.ObjectId,
        'ref': 'AirCommertialRowMaster'
    },
    airCommertialColumnMasterName: {
        type : String,
        required : false,
        default : null
    },
    modifiedBy: {
        type : mongoose.Schema.Types.ObjectId,
        'ref': 'User'
    },
    modifiedDate: {
        type: Date,
        required : false,
        default : new Date()
    }
},{
    timestamp : true
});

module.exports = mongoose.model('AirCommercialRate' , AirCommercialRateSchema);