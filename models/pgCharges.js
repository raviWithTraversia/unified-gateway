const mongoose = require('mongoose');

const paymentGateway = new mongoose.Schema({
    companyId : {
      type : mongoose.Schema.Types.ObjectId,
      required : true
    },
    paymentGatewayProvider : {
     type : String,
     required : true
    },
    paymentMethod : {
        Global: {type: String},
        Upi: { type: String },
        Wallet: { type: String },
        Card: { type: String },
        Paylater: { type: String },
        Emi: { type: String },
        NetBanking : { type: String }

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