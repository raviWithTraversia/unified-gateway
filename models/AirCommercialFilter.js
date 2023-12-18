const mongoose = require('mongoose');

const AirCommercialFilterSchema = new mongoose({
    AllAirport :{
        type : String,
        require : false,
        default : null
    },
    bookingDate:{
        type: Date,
        default: null,
    },
    onTravelDate:{
        type: Date,
        default: null,
    },

});

module.exports = mongoose.model('AirCommercialFilter' , AirCommercialFilterSchema);