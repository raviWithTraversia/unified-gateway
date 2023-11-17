const mongoose = require('mongoose');

const airGSTMandateSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', 
        default : '6538c030475692887584081e'
    },
    airLine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AirlineCode',
    },
    fareFamily: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FareFamilyMaster',
    },
    promoCode: {
        type: String,
        required: false,
    }    
},{
    timestamps : true  //Add created_at and updated_at coloumn
});

const AirGSTMandate = mongoose.model('AirGSTMandate', airGSTMandateSchema);

module.exports = AirGSTMandate;