const mongoose = require('mongoose');

const fareRuleSchema = new mongoose.Schema({
    companyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Company'
    },
    origin : {
        type : String
    },
    destination : {
        type : String
    },
    providerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Provider'
    },
    airlineCodeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'AirlineCode'
    },
    fareFamilyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'FareFamilyMaster'
    },
    cabinclass : {
        type : String
    },
   travelType: {
    type : String
   },
   validDateFrom : {
     type : Date
   },
   validDateTo : {
    type : Date
   },
   status : {
    type : Boolean
   }
});
const fareRule = mongoose.model("fareRule", fareRuleSchema);
module.exports = fareRule;
