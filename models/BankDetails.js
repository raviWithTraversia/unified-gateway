const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
companyId: {
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  accountName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  ifscCode: {
    type: String,
    required: true,
  },
  bankAddress: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  bankCode: {
    type: String,
    required: true,
  },
  QrcodeImagePath: {
    type : String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifyAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type : mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  modifyBy: {
    type : mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: Boolean,
    default: true,
  }
},
{
        timestamp: true
}
);
const manageBankDetails = mongoose.model("manageBankDetails", bankDetailsSchema);
module.exports = manageBankDetails