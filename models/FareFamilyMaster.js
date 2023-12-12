const mongoose = require('mongoose');

const FareFamilyMasterSchema = new mongoose.Schema({
    companyId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    fareFamilyCode: {
        type : String,
        required: true,
        default : null
    },
    fareFamilyName: {
        type : String,
        required : false,
        default : null
    },
    status: {
        type: Boolean,
        default : true,
    },
    
},{
    timestamp : true
});

module.exports = mongoose.model('FareFamilyMaster' , FareFamilyMasterSchema);