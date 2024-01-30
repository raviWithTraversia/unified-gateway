const mongoose = require('mongoose');

const markupSchema = new mongoose.Schema({
  fixCharge: Number,
  percentCharge: Number,
  MaxValue: Number,
});

const BookingfeeSchema = new mongoose.Schema({
  fixCharge: Number,
  percentCharge: Number,
  MaxValue: Number,
  gst:{
    type :Boolean
  }
});

const discountSchema = new mongoose.Schema({
  fixCharge: Number,
  percentCharge: Number,
  MaxValue: Number,
  tds: {
    type :Boolean
  }
});

const serviceRequestSchema = new mongoose.Schema({
  seat: {
    markup: markupSchema,
    Bookingfee: BookingfeeSchema,
    discount: discountSchema,
  },
  meal: {
    markup: markupSchema,
    Bookingfee: BookingfeeSchema,
    discount: discountSchema,
  },
  baggage: {
    markup: markupSchema,
    Bookingfee: BookingfeeSchema,
    discount: discountSchema,
  },
  bookingType: {
    type : String,
    enum : ['PreBooking', 'PostBooking'],
  },
  flightCode: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'AirlineCode'
  },
  travelType: {
    type: String,
    enum: ['Domestic', 'International'],
  },
  source: {
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

