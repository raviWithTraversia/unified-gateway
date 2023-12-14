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
        ref : 'SupplierCode'
    },
    airlineCodeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'AirlineCode'
    },
    fareFamilyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'FareFamilyMaster'
    },
    cabinclassId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'CabinClassMaster'
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
   },
   desceription : {
    type : String
   },
   rbd :{
    type : String
   },
   fareBasis : {
    type : String
   },
   modifyAt : {
    type : Date
   },
   modifyBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
   }
});
const fareRule = mongoose.model("fareRule", fareRuleSchema);
module.exports = fareRule;
