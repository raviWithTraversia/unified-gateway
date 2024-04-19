const mongoose = require('mongoose');


const airlineCodeSchema = new mongoose.Schema({
    airlineCode : {
        type : String,
        required: true
    },
    airlineName : {
        type : String,
        required : true
    },
    theeeDCode : {
       type : String ,
       required : false,
       default : null
    },
    isLcc : {
        type : Boolean,
        required : true,
        default : false
    },
    allinceCode : {
        type : String ,
        required : false,
        default : null
    },
    customerCareNumber : {
        type : String ,
        required : false,
        default : null
    },
    timeStaamp : {

    }
},{
    timestamps : true  //Add created_at and updated_at coloumn
} );

module.exports = mongoose.model('AirlineCode' , airlineCodeSchema);