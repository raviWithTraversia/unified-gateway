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
        type : Number,
        default : 0,
      },
      userId : {
        type : mongoose.Schema.Types.ObjectId,
        'ref': 'User'
      },
      companyId : {
        type : mongoose.Schema.Types.ObjectId,
        'ref': 'Company'
      }
}, {
    timestamps : true
});
const groupCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000 },
});

const GroupCounter = mongoose.model("GroupCounter", groupCounterSchema);
seriesDepartureGroupSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  try {
    const counter = await GroupCounter.findByIdAndUpdate(
      { _id: "groupId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.groupId = counter.seq;
    next();
  } catch (error) {
    next(error);
  }
});
const seriesDepartureGroup = mongoose.model("seriesDepartureGroup" ,seriesDepartureGroupSchema);
module.exports = seriesDepartureGroup;