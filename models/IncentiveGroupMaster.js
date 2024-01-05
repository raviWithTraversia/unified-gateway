const mongoose = require('mongoose');

const IncentiveGroupMasterSchema = new mongoose.Schema({
    incentiveGroupName:{
        type: String,
        default:null,
        required: true
    },
    companyId:{
        type: mongoose.Schema.Types.ObjectId,
        'ref' : 'Company'
    },
    isDefault:{
        type : Boolean,
        default : false
    }
},{
    timestamps : true 
});

module.exports = mongoose.model('IncentiveGroupMaster' , IncentiveGroupMasterSchema)