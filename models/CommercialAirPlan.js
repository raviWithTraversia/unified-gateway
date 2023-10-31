const mongoose = require('mongoose');

const CommercialAirPlanSchema = new mongoose.Schema({
    commercialPlanName : {
        type : String,
        required : true,
        default : null
    },
    companyId : {
        type : mongoose.Schema.Types.ObjectId,
        'ref' : 'Company'
    },
    modifiedBy : {
        type : mongoose.Schema.Types.ObjectId,
        'ref': 'User'
    },
    modifiedDate : {
        type : Date,
        required : false,
        default : null
    },
    status : {
        type : Boolean,
        default : true
    },
    IsDefault : {
        type : Boolean,
        default : false
    }
} ,{
    timestamp : true  // Created at and updated at coloumn add
});

module.exports = mongoose.model('CommercialAirPlan' , CommercialAirPlanSchema);