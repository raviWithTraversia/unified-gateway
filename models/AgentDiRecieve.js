const mongoose = require('mongoose');
const { diSetupSchema } = require('./DiSetup');

const AgentDiRecieveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  amountDeposit: {
    type: Number,
    required: true
  },
  diAmount: {
    type: Number,
    default: 0
  },
  slabBreakups: [{
    diType: {
      type: String,
    },
    minAmount: {
      type: String,
    },
    maxAmount: {
      type: String,
    },
    diPersentage: {
      type: String,
    },
    diOfferType: {
      type: String,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    validFromDate: {
      type: Date,
    },
    validToDate: {
      type: Date,
    },
    gst: {
      type: Boolean,
    },
    tds: {
      type: Boolean,
    },
    status: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  }]
}, { timestamps: true });

module.exports = mongoose.model('AgentDiRecieve', AgentDiRecieveSchema);
