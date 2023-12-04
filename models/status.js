const mongoose = require('mongoose');

const StatusSchema = new  mongoose.Schema({
    name : {
        type : String,
        required : true
    }, 
    type : {
        type : String,
        required : true
    }, 
    timestamp  : {
        type: Date,
        default: Date.now,
    }
});
const Status = mongoose.model("Status", StatusSchema);

module.exports = Status;