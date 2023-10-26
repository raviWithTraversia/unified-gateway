const mongoose = require('mongoose');

const CabinClassMasterSchema = new mongoose.Schema({
    cabinClassCode : {
        type : String,
        required : true,
        default : null
    },
    cabinClassName : {
        type : String,
        required : true,
        default : null
    }
},{
    timestamps : true //add created and updated date time
});

module.exports = mongoose.model('CabinClassMaster' , CabinClassMasterSchema);