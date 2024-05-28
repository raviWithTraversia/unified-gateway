const mongoose = require('mongoose');

const paymentGateway = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Company'
  },
  paymentGatewayProvider: {
    type: String,
    required: true,
    trim: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    trim: true,
  },
  paymentType: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  flatFee: {
    type: Number,
    required: false,
    default: null,
  },
  percentageFee: {
    type: Number,
    required: false,
    default: null,
  }
}, {
  timestamps: true
});

const paymentGatewayCharges = mongoose.model("paymentGatewayCharges", paymentGateway);
module.exports = paymentGatewayCharges;