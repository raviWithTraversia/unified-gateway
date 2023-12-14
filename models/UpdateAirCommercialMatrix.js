const mongoose = require('mongoose');

const { Schema } = mongoose;

const columnSchema = new Schema({
  coloumnId: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: String, required: true },
  textType: { type: String, required: true }
});

const rowSchema = new Schema({
  rowId: { type: String, required: true },
  coloumn: [columnSchema]
});

const UpdateAirCommercialMatrixSchema = new Schema({
  comercialPlanId: { type: String, required: true },
  airCommercialPlanId: { type: String, required: true },
  ComanyId: { type: String, required: true },
  rateValue: [rowSchema],
  fixedValue: [rowSchema]
});

module.exports = mongoose.model('UpdateAirCommercialMatrix', UpdateAirCommercialMatrixSchema);