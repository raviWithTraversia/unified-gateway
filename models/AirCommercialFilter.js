const mongoose = require('mongoose');

const AirCommercialFilterSchema = new mongoose.Schema({
    rowName :{
        type : String,
        require : false,
        default : null
    },
    type : {
        type : String,
        default : null
    }
});

module.exports = mongoose.model('AirCommercialFilter' , AirCommercialFilterSchema);