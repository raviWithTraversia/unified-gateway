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
   credentialType : {
    type : String
   },
   salesChannel : {
    type : String
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
   airlines: [String],
   fareFamily : [String],
   departureDate : {
    type : Date
   },
   traceId : {
    type : String
   },
   createdDate : {
    type : Date,
    default : Date.now
   },
   typeOfTrip : {
    type : String
   }
}, {
    timestamps : true
});
const flightSerchReport = mongoose.model("flightSerchReport", flightSerchSchema);
module.exports = flightSerchReport;