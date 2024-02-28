const mongoose = require('mongoose');

const seriesDepartureCounterSchema = new mongoose.Schema({
    counter : {
        type : Number
    }
});
const seriesDepartureCounter = mongoose.model("seriesDepartureCounter", seriesDepartureCounterSchema);
module.exports = seriesDepartureCounter;
