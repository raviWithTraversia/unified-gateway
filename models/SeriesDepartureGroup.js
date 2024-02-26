const mongoose = require('mongoose');

const seriesDepartureGroupSchema = new mongoose.Schema({
    seriesDepartureIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seriesDeparture'
      }],
      groupId : {
        type : Number
      },
      groupName : {
        type : String
      },
      count : {
        type : Number
      }
}, {
    timestamps : true
});
const seriesDepartureGroup = mongoose.model("seriesDepartureGroup" ,seriesDepartureGroupSchema);
module.exports = seriesDepartureGroup;