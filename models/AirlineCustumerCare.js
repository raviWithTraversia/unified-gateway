const mongoose = require('mongoose');


const airlineCustumerSchema = new mongoose.Schema({
    airlineCode : {
        type : String,
        required: true
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

module.exports = mongoose.model('AirlineCustumereCare' , airlineCustumerSchema);