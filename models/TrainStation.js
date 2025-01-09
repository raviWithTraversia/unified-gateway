const mongoose = require('mongoose');

const TrainStationSchema=new mongoose.Schema({
    StationCode:{
        type:String,
    },
    StationName:{
        type:String,
    },

})
const TrainStationName = mongoose.model("TrainStationMaster", TrainStationSchema);

module.exports = TrainStationName