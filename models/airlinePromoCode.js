const mongoose = require('mongoose');

const airLinePremoSchema = new mongoose.Schema({
    companyId : {
       type : mongoose.Schema.Types.ObjectId,
       ref : 'company'
    },
    supplierCode : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'SupplierCode'
    },
    airLineCode : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'AirlineCode'
    },
    fareFamily : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'FareFamilyMaster'
    },
    premoCode :{
        type : String,
        default : null
    },
    displayName : {
        type : String,
        default : null
    },
    type : {
        type : String,
        dafault : null
    }
}, {
    timestamps : true 
});
const airlinePromoCode = mongoose.model("airlinePromoCode", airLinePremoSchema);
module.exports = airlinePromoCode;