const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
    bookingType : {
        type : String,
        enum : ['PreBooking', 'PostBooking']
    },
    flightCode : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'AirlineCode'
    },
    travelType : {
        type : String,
        enum : ['Domestic', 'International', 'domestic',,'DOMESTIC', 'international', 'INTERNATIONAL']
    },
    source : {
        type : String
    },
    fixCherge : {
        type : Number
    },
    percentCharge : {
        type : Number
    },
    fromDate : {
        type : Date
    },
    toDate : {
        type : Date
    }
}, {
    timestamps : true
});
const ssr = mongoose.model("ssr", serviceRequestSchema);
module.exports = ssrmodel;
