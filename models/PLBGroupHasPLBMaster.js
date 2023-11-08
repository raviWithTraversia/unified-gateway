const mongoose = require('mongoose');

const PLBGroupHasPLBMasterSchema = new mongoose.Schema({
    PLBGroupId:{
        type: mongoose.Schema.Types.ObjectId,
        'ref': 'PLBGroupMaster'
    },
    PLBMasterId: {
        type: mongoose.Schema.Types.ObjectId,
        'ref': 'PLBMaster' 
    }
},{
    timestamps : true
});

module.exports = mongoose.model('PLBGroupHasPLBMaster' , PLBGroupHasPLBMasterSchema);