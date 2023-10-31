const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    countryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Country'
    },
    stateCode : {
        type : String,
        required : false,
        default : null
    },
    country_code : {
        type: String,
        required : false,
        default : null
    },
    country_name : {
        type: String,
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

module.exports = mongoose.model('State' , StateSchema);