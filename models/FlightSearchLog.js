const mongoose = require('mongoose');

const flightSerchSchema = new mongoose.Schema({
   companyId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Company'
   } ,
   userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
   },
   origin : {
     type : String
   },
   destination : {
    type : String
   },
   travelType : {
    type : String
   },
   classOfService : {
     type : String
   },
   paxDetail : {
     type : Object
   },
   AirlineCode : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'AirlineCode'
   },
   departureDate : {
    type : Date
   }
}, {
    timestamps : true
});
const flightSerchReport = mongoose.model("flightSerchReport", flightSerchSchema);
module.exports = flightSerchReport;