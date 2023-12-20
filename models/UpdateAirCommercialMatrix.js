const mongoose = require('mongoose');

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
  ComanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
     },
  rateValue: [{
    rowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AirCommertialColumnMaster'
    },
    coloumn: [{
      coloumnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AirCommertialColumnMaster'
      },
      type: {
        type: String,
      },
      value: {
        type: String
      },
      textType: {
        type: String
      }
    }]
  }],
  fixedValue: [{
    rowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AirCommertialColumnMaster'
    },
    coloumn: [{
      coloumnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AirCommertialColumnMaster'
      },
      type: {
        type: String,
      },
      value: {
        type: String
      },
      textType: {
        type: String
      }
    }]
  }]
});

module.exports = mongoose.model('UpdateAirCommercialMatrix', UpdateAirCommercialMatrixSchema);