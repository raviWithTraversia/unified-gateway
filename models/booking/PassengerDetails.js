
const mongoose = require("mongoose");
const passengerDetailsSchema = new mongoose.Schema({
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
    paxId:{ // 1,2,3,4,5,6,7,8
        type: String,
        default: null
    },
    bookingAmendmentId: { type: String, default:null },
    title: { type: String, default:null },
    firstName: { type: String, default:null },
    middleName: { type: String, default:null },
    lastName: { type: String, default:null },
    dob: { type: String, default:null },
    paxType:{ type: String, default:null },
    paxSex:{type:String, enum:['M','F'] },
    modifyBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    modifyAt: { type: Date, default: Date.now() },
    ticketNumber: { type: String, default:null }, 
    passNumber: { type: String, default:null },
    passIssueDate: { type: Date, default:Date.now() },
    expiryDate: { type: Date, default:Date.now() },
    bookingStatus: { type: String, default:null }, // OPEN, AMENDED, UNDER PROCESS
    amendmentRefNo: { type: String, default:null },
    modifyBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifyAt: {
      type: Date,
      default: Date.now(),
    }    
  },
  {
    timestamps: true,
  }
);

const PassengerDetails = mongoose.model(
  "PassengerDetails",
  passengerDetailsSchema
);
module.exports = PassengerDetails;
