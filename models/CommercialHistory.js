const mongoose = require('mongoose');

const CommercialHistory = new mongoose.Schema({
    commercialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AirCommercial'
    },
    newValue: {
        type: 'object',
        properties: {
            AirCommertialRowMasterId:{type:mongoose.Schema.Types.ObjectId,
                ref:"AirCommertialColumnMaster"
            },
            AirCommertialColumnMasterId:{type:mongoose.Schema.Types.ObjectId,
                ref:"AirCommertialColumnMaster"
            },
            numberValue: { type: 'number' },
            stringValue: { type: 'string' },
            booleanValue: { type: 'boolean' }
        },
    },
    oldValue: {
        type: 'object',
         properties: {
            AirCommertialRowMasterId:{type:mongoose.Schema.Types.ObjectId,
                ref:"AirCommertialColumnMaster"
            },
            AirCommertialColumnMasterId:{type:mongoose.Schema.Types.ObjectId,
                ref:"AirCommertialColumnMaster"
            },
            numberValue: { type: 'number' },
            stringValue: { type: 'string' },
            booleanValue: { type: 'boolean' }
        },
    },
    commercialFilterNewValue: [{
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
        },
        valueType: {
            type: String,
            default: null
        }
    }],
    commercialFilterOldValue: [{
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
        },
        valueType: {
            type: String,
            default: null
        }
    }]
});


module.exports = mongoose.model('CommercialHistory', CommercialHistory);