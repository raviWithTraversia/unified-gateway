const mongoose = require('mongoose');

const IncentiveGroupHasIncentiveMasterSchema = new mongoose.Schema({
    incentiveGroupId:{
        type: mongoose.Schema.Types.ObjectId,
        'ref' : 'IncentiveGroupMaster'
    },
    incentiveMasterId: {
        type: mongoose.Schema.Types.ObjectId,
        'ref' : 'IncentiveMaster'
    }
},{
    timestamps : true 
});

module.exports = mongoose.model('IncentiveGroupHasIncentiveMaster' , IncentiveGroupHasIncentiveMasterSchema)