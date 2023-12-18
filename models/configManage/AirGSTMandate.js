const mongoose = require('mongoose');

const airGSTMandateSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', 
        default : '6555f84c991eaa63cb171a9f'
    },
    airLine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AirlineCode',
        default: null
        
    },
    fareFamily: {
        type: String,
        required: false,
        default: null        
    },
    promoCode: {
        type: String,
        required: false,
        default: null        
    }    
},{
    timestamps : true  //Add created_at and updated_at coloumn
});

const AirGSTMandate = mongoose.model('AirGSTMandate', airGSTMandateSchema);

module.exports = AirGSTMandate;