const mongoose = require('mongoose');

const PLBGroupMasterSchema = mongoose.Schema({
    PLBGroupName: {
        type : String,
        required : false,
        default : null
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        'ref': 'Company'
    },
    isDefault: {
        type : Boolean,
        default : false
    }
},{
    timestamps : true
});

module.exports = mongoose.model('PLBGroupMaster' , PLBGroupMasterSchema);