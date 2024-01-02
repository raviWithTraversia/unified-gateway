const mongoose = require('mongoose');
const Ajv = require('ajv');
const { Schema } = mongoose;

const UpdateAirCommercialMatrixSchema = new Schema({
  comercialPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommercialAirPlan'
  },
  airCommercialPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AirCommercial'
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  data: [{
    AirCommertialRowMasterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AirCommertialColumnMaster'
    },
    AirCommertialColumnMasterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AirCommertialColumnMaster'
    },
    value: {
      type: 'object',
      properties: {
        numberValue: { type: 'number' },
        stringValue: { type: 'string' },
        booleanValue: { type: 'boolean' }
      },
    },
    textType: {
      type: String
    }
  }],
});

module.exports = mongoose.model('UpdateAirCommercialMatrix', UpdateAirCommercialMatrixSchema);