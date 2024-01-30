const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
    {
      bookingType: {
        type: String,
        enum: ['PreBooking', 'PostBooking'],
        required: true
      },
      flightCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AirlineCode',
        required: true
      },
      travelType: {
        type: String,
        enum: ['Domestic', 'International'],
        required: true
      },
      source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SupplierCode',
        required: true
      },
      validDateFrom: {
        type: Date
      },
      validDateTo: {
        type: Date
      },
      status: {
        type: Boolean
      },
      description: {
        type: String
      },
      gst: Boolean,
      tds: Boolean,
      seat: {
        fixCharge: Number,
        percentCharge: Number,
        maxValue: Number
      },
      meal: {
        fixCharge: Number,
        percentCharge: Number,
        maxValue: Number
      },
      baggage: {
        fixCharge: Number,
        percentCharge: Number,
        maxValue: Number
      },
      companyId : {
       type : mongoose.Schema.Types.ObjectId,
       ref : 'Company'
      }
    },
    {
      timestamps: true
    }
  );
  
const ssrCommercial = mongoose.model("ssrCommercial", serviceRequestSchema);
module.exports = ssrCommercial;

