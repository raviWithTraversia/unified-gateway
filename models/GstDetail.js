const mongoose = require('mongoose');

const gstDetailSchema = new mongoose.Schema({
  gstName : {
    type : String
  },
  gstNumber : {
    type : String
  },
  gstMobileNumber : {
    type : String
  },
  gstEmail :  {
    type : String
  },
  gstAddress :  {
    type : String
  },
  userId :  {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },
  companyId :  {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Company'
  }
}, {
    timestamps : true
});
const gstDetails = mongoose.model("gstDetails", gstDetailSchema);
module.exports = gstDetails;