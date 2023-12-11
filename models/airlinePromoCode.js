const mongoose = require('mongoose');

const airLinePremoSchema = new mongoose.Schema({
    companyId : {
       type : mongoose.Schema.Types.ObjectId,
       ref : 'company'
    },
    supplierCode : {
        type : String,
        default : null
    },
    airLineCode : {
        type : String ,
        default : null
    },
    fareFamily : {
        type : String,
        default : null
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