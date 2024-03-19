
const mongoose = require("mongoose");
const contactDetailsSchema = new mongoose.Schema({
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
    bid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BookingDetails",
    },
    prodBookingId: {  // 1,2,3,4,5,6,7,8,9
        type: String,
        default: null
    },  
    paxId:{ // 1,2,3,4,5,6,7,8
        type: String,
        default: null
    },   
    phoneNo: { type: String, default:null },
    mobileNo: { type: String, default:null },
    fAX: { type: Date, default: Date.now() },
    emailAddress: { type: String, default:null },
    country: { type: Date, default: Date.now() },
    state: { type: String, default:null },
    city:{ type: String, default:null },
    address:{ type:String, default:null },
    postCode: { type:String, default:null },
    addressType: { type:String, default:null },    
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

const contactDetails = mongoose.model(
  "contactDetails",
  contactDetailsSchema
);
module.exports = contactDetails;
