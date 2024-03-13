const mongoose = require('mongoose');
const segmentSchema = new mongoose.Schema({
    Origin: {
      type: String,
      required: true,
    },
    Destination: {
      type: String,
      required: true,
    },
    OriginName: {
      type: String,
      required: true,
    },
    DestinationName: {
      type: String,
      required: true,
    },
    DepartureDate: {
      type: Date,
      required: true,
    },
    DepartureTime: {
      type: String,
      required: true,
    },
    DepartureTimeTo: {
      type: String,
      required: true,
    },
    ClassOfService: {
      type: String,
    },
  });
const groupTicketSchema = new mongoose.Schema({
  groupId : {
    type : String,
    enum : ['Pending', 'Quoted', 'Cancelled', 'Completed']
  },
  agentId : {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'User'
  } ,
  comapnyId : {
    type : mongoose.Schema.Types.ObjectId
  },
  segment : {
    type : [segmentSchema]
  },
  status : {
    type : "String"
  },
  remarks : {
    type : String
  },
  totalCount : {
    type : Number
  },
  adultCount : {
    type : Number
  },
  childCount : {
    type : Number
  },
  infantCount : {
    type : Number
  }
}, {
    timeStamp : true 
});
const groupTicketRequest = mongoose.model("groupTicketRequest", groupTicketSchema);
module.exports = groupTicketRequest;