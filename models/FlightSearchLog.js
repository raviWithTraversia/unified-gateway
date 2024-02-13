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
   creationDate : {
     type : Date,
     default : Date.now
   }
}, {
    timestamps : true
});
const flightSerchReport = mongoose.model("flightSerchReport", flightSerchSchema);
module.exports = flightSerchReport;