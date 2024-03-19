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
    type : {
      type : String
    }
  });
const quotedPriceSchema = new mongoose.Schema({
  totalPrice : {
    type : Number,
    default : 0
  },
  adultPrice : {
    type : Number,
    default : 0
  },  
  childPrice : {
    type : Number,
    default : 0
  },
  infantPrice : {
    type : Number,
    default : 0
  }

});
const groupTicketSchema = new mongoose.Schema({
  status : {
    type : String,
    enum : ['Pending', 'Quoted', 'Cancelled', 'Completed']
  },
  agentId : {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'User'
  },
  comapnyId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Company'
  },
  segment : {
    type : [segmentSchema]
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
  },
  quotedPrice : {
    type : [quotedPriceSchema]
  },
  tripType : {
    type : String,
    enum : ['ONEWAY', 'ROUNDTRIP']
  },
  travelType : {
    type : String,
    enum : ['Domestic' , 'International']
  },
  groupId: {
    type: String,
    default: () => {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substr(2, 5);
      const numericPart = ('0000' + (parseInt(random, 36) % 10000)).slice(-4);
      return 'GRP_' + numericPart;
  },
    unique: true
},
},{
    timeStamp : true 
});
const groupTicketRequest = mongoose.model("groupTicketRequest", groupTicketSchema);
module.exports = groupTicketRequest;