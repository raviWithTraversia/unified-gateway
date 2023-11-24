const mongoose = require('mongoose');

const paymentGateway = new mongoose.Schema({
    paymentGatewayProvider : {
     type : String
    },
    paymetMethod : {
        Global: {type: String},
        Upi: { type: String },
        Wallet: { type: String },
        Card: { type: String },
        Paylater: { type: String },
        Emi: { type: String },
        NetBanking : { type: String }

    },
    gatewayChargesOnMethod : {
        Global : {type : Number},
        Upi: { type: Number },
        Wallet: { type: Number },
        Card: { type: Number },
        Paylater: { type: Number },
        Emi : { type: String },
        NetBanking : { type: String }
    },
    gatewaySurchargesOnMethod : {
        Global : {type : Number},
        Upi: { type: Number },
        Wallet: { type: Number },
        Card: { type: Number },
        Paylater: { type: Number },
        Emi : { type: String },
        NetBanking : { type: String }
    }
});
const pgCharges = mongoose.model("pgCharges", paymentGateway);
module.exports = pgCharges;