const mongoose = require('mongoose');

const StateSchema = mongoose.Schema({
    state : {
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
    }
},{
    timestamps : true
});

module.exports = mongoose.model('State' , StateSchema);