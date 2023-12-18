const mongoose = require('mongoose');

const paymentGateway = new mongoose.Schema({
    companyId : {
      type : mongoose.Schema.Types.ObjectId,
      required : true,
      ref : 'Company'
    },
    paymentGatewayProvider : {
     type : String,
     required : true
    },
    paymentMethod : {
        Global: {type: String, default : null},
        Upi: { type: String , default : null},
        Wallet: { type: String ,default : null },
        Card: { type: String, default : null },
        Paylater: { type: String ,default : null},
        Emi: { type: String,default : null },
        NetBanking : { type: String,default : null }

    },
    gatewayChargesOnMethod : {
        Global : {type : Number,required : false, default: null},
        Upi: { type: Number, required : false,  default: null },
        Wallet: { type: Number,required : false, default: null},
        Card: { type: Number ,required : false, default: null},
        Paylater: { type: Number,required : false, default: null },
        Emi : { type: Number,required : false, default: null },
        NetBanking : { type: Number,required : false, default: null }
    },
    gatewayFixchargesOnMethod : {
        Global : {type : Number,required : false, default: null},
        Upi: {type : Number,required : false, default: null},
        Wallet: {type : Number,required : false, default: null},
        Card: {type : Number,required : false, default: null},
        Paylater: {type : Number,required : false, default: null},
        Emi : {type : Number,required : false, default: null},
        NetBanking :{type : Number,required : false, default: null}
    }
});
const pgCharges = mongoose.model("pgCharges", paymentGateway);
module.exports = pgCharges;