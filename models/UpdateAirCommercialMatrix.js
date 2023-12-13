const mongoose = require('mongoose');

const UpdateAirCommercialMatrixSchema = new mongoose.Schema({
    comercialPlanId:{
        type : mongoose.Schema.Types.ObjectId,
        'ref' : 'CommercialAirPlan'
    },
    airCommercialPlanId:{
        type : mongoose.Schema.Types.ObjectId,
        'ref' : 'CommercialAirPlan'
    },
    ComanyId:{
        type : mongoose.Schema.Types.ObjectId,
        'ref' : 'Company'
    },
    type:{
        type : mongoose.Schema.Types.ObjectId,
        'ref' : 'Company'
    },
    coloumnId:{
        type : mongoose.Schema.Types.ObjectId,
        'ref' : 'AirCommertialColumnMaster'
    },
    rowId:[{
        type : mongoose.Schema.Types.ObjectId,
        'ref' : 'AirCommertialColumnMaster',  
    }],
    textType:{
        type: String,
        default : null
    },
    value: {
        type: String,
        default : null
    }

});

module.exports = mongoose.model("UpdateAirCommercialMatrix" , UpdateAirCommercialMatrixSchema);