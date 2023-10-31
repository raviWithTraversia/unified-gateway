const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    stateId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'State'
    },
    state_name : {
        type : String,
        required : false,
        default : null
    },
    state_code : {
        type : String,
        required : false,
        default : null
    },
    countryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Country'
    },
    country_name : {
        type : String,
        required : false,
        default : null
    },
    country_code : {
        type : String,
        required : false,
        default : null
    },
    latitude : {
        type: String,
        required : false,
        default : null
    },
    longitude : {
        type: String,
        required : false,
        default : null
    },
    
},{
    timestamps : true
});

module.exports = mongoose.model('City' , CitySchema);