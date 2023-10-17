const mongoose = require('mongoose');


const airlineCodeSchema = new mongoose.Schema({
    airlineCode : {
        type : String,
        required: true
    },
    companyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Company'
    },
    airlineName : {
        type : String,
        required : true
    },
    theeeDCode : {
       type : String ,
       required : true
    },
    isLcc : {
        type : Boolean,
        required : true
    },
    allinceCode : {
        type : String ,
        required : true
    },
    timeStaamp : {

    }
},{
    timestamps : true  //Add created_at and updated_at coloumn
} );

module.exports = mongoose.model('AirlineCode' , airlineCodeSchema);