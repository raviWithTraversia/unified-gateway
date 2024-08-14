const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
    paxName: {
      type: String,
      required: true
    },
    paxAge: {
      type: Number, 
      required: true
    },
    paxType: {
      type: String, 
      required: true
    },
    
  }, {
    _id: false 
  });


const passengerDetailsRailSchema = new mongoose.Schema(
    
    {

    bookingId:{
        type: String,
        ref: "bookingDetailsRail",
    },

    passengers: [passengerSchema], 

    },

    {
    timestamps: true,
  }
);
const passengerDetailsRail = mongoose.model("passengerDetailsRail", passengerDetailsRailSchema);
module.exports = passengerDetailsRail;