const mongoose = require('mongoose');

const CommercialHistory = new mongoose.Schema({
    commercialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AirCommercial'
    },
    newValue: {
        type: 'object',
        properties: {
            numberValue: { type: 'number' },
            stringValue: { type: 'string' },
            booleanValue: { type: 'boolean' }
        },
    },
    oldValue: {
        type: 'object',
        properties: {
            numberValue: { type: 'number' },
            stringValue: { type: 'string' },
            booleanValue: { type: 'boolean' }
        },
    },
});


module.exports = mongoose.model('CommercialHistory', CommercialHistory);