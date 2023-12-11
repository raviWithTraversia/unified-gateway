const mongoose = require('mongoose');

const AirCommertialColumnMasterSchema = new mongoose.Schema({
    name: {
        type : String,
        required : false,
        default : null
    },
    commercialType: {
        type : String,
        required : false,
        default : null
    },
    type: {
        type : String,
        required : false,
        default : null
    },
    modifiedBy: {
        type : mongoose.Schema.Types.ObjectId,
        'ref' : 'User'
    },
    lastModifiedDate: {
        type : Date,
        required : false,
        default : null
    },
},{
    timestamp : true
});

module.exports = mongoose.model('AirCommertialColumnMaster' , AirCommertialColumnMasterSchema);