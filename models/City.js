const mongoose = require('mongoose');

const CitySchema = mongoose.Schema({
    city : {
        type : String,
        required : true,
    },
    countryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Country'
    },
    stateId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'State'
    },
},{
    timestamps : true
});

module.exports = mongoose.model('City' , CitySchema);