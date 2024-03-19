
const mongoose = require("mongoose");
const sectorDetailsSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },    
    bookingId: {
      type: String,
      default: null
    },
    prodBookingId: {  // 1,2,3,4,5,6,7,8,9
        type: String,
        default: null
    },     
    carierName: { type: String, default:null },
    fromDestination: { type: String, default:null },
    fromDateTime: { type: Date, default: Date.now() },
    toDestination: { type: String, default:null },
    toDateTime: { type: Date, default: Date.now() },
    flightNo: { type: String, default:null },
    class:{ type: String, default:null },
    status:{ type:String, default:null },
    fareBasis: { type:String, default:null },
    notValidBefor: { type:String, default:null },
    notValidAfter: { type: String, default:null }, 
    airportTerminalFrom: { type: String, default:null },
    airportTerminalTo: { type: String, default:null },
    segId: { type: String, default:null },
    segRemarks: { type: String, default:null  }, // OPEN, AMENDED, UNDER PROCESS
    tripId: { type: String, default:null },
    flyingTime:{ type: String, default:null },
    travelTime:{ type: String, default:null },
    layoverTime:{ type: String, default:null },
    baggageAdt:{ type: String, default:null },
    baggageChd:{ type: String, default:null },
    baggageInf:{ type: String, default:null },
    cabinClass:{ type: String, default:null },
    operatingCarier:{ type: String, default:null },
    operatingFltNo:{ type: String, default:null },
    equipType:{ type: String, default:null },    
    modifyBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifyAt: {
      type: Date, default: Date.now(),
    }    
  },
  {
    timestamps: true,
  }
);

const sectorDetails = mongoose.model(
  "sectorDetails",
  sectorDetailsSchema
);
module.exports = sectorDetails;
