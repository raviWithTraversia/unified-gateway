const mongoose = require('mongoose');

const CountrySchem = mongoose.Schema({
    country : {
        type : String,
        required : true,
    },
    countryCode : {
        type : String,
        required : false,
        default : null
    }
},{
    timestamps : true
}
);

module.exports = mongoose.model('Country' , CountrySchem);