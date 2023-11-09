const mongoose = require('mongoose');

const PLBMasterHistorySchema = new mongoose.Schema({
    PLBMasterId : {
        type: mongoose.Schema.Types.ObjectId,
        'ref' : 'PLBMaster'
    },
    companyId:{
        type: mongoose.Schema.Types.ObjectId,
        'ref' : 'Company'
    },
    oldChanges:{
        type: String,
        default: null
    },
    newChanges: {
        type: String,
        default: null
    }
},{
    timestamps: true
});

module.exports = mongoose.model('PLBMasterHistory' , PLBMasterHistorySchema);