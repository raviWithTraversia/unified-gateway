const mongoose = require('mongoose');

const markupSchema = new mongoose.Schema({
  fixCharge: Number,
  percentCharge: Number,
  maxValue: Number,
});

const bookingFeeSchema = new mongoose.Schema({
  fixCharge: Number,
  percentCharge: Number,
  maxValue: Number,
  gst:{
    type :Boolean
  }
});

const discountSchema = new mongoose.Schema({
  fixCharge: Number,
  percentCharge: Number,
  maxValue: Number,
  tds: {
    type :Boolean
  }
});

const serviceRequestSchema = new mongoose.Schema({
  seat: {
    markup: markupSchema,
    bookingFee: bookingFeeSchema,
    discount: discountSchema,
  },
  meal: {
    markup: markupSchema,
    bookingFee: bookingFeeSchema,
    discount: discountSchema,
  },
  baggage: {
    markup: markupSchema,
    bookingFee: bookingFeeSchema,
    discount: discountSchema,
  },
  bookingType: {
    type : String,
    enum : ['AtIssuance', 'PostBooking'],
  },
  airlineCodeId: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'AirlineCode',
    default : null
  },
  travelType: {
    type: String,
    enum: ['Domestic', 'International'],
  },
  supplierCode: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'SupplierCode'
  },
  validDateFrom: Date,
  validDateTo: Date,
  status: Boolean,
  description: String,
  modifyBy: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }
});

const ssrCommercial = mongoose.model("ssrCommercial", serviceRequestSchema);
module.exports = ssrCommercial;

