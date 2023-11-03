const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
        companyId: {
    type: String,
    required: true,
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
  uploadQRCode: {
    data: Buffer,       
    contentType: String 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifyAt: {
    type: Date,
  },
  createdBy: {
    type: String,
  },
  modifyBy: {
    type: String,
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