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
  slabBreakups: [diSetupSchema]
}, { timestamps: true });

module.exports = mongoose.model('AgentDiRecieve', AgentDiRecieveSchema);
