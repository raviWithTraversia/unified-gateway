const mongoose = require("mongoose");
const passengerPreferenceSchema = new mongoose.Schema({
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
    ProdBookingId: {  // 1,2,3,4,5,6,7,8,9
        type: String,
        default: null
    }, 
    paxId: {
        type: String,
        default: null     
    },   
    PAX_PRF_Carier_Name:{ type: String, default:null },
    PAX_PRF_From_Destination:{ type: String, default:null },
    PAX_PRF_To_Destination:{ type: String, default:null},
    PAX_PRF_Flight_No:{ type: String, default:null },
    PAX_PRF_Meal:{ type: String, default:null },
    PAX_PRF_Meal_Name: { type: String, default: null },
    PAX_PRF_Seat: { type: String, default: null },
    PAX_PRF_SeatMap: { type: String, default: null },
    PAX_PRF_Baggage: {  type: String, default: null },
    PAX_PRF_Baggage_Name:  { type: String, default: null },
    PAX_PRF_SpecialRequest: { type: String, default: null },
    PAX_PRF_SR_Name: { type: String, default: null },
    PAX_PRF_Comment: { type: String, default: null },
    PAX_PRF_TripType: { type: String, default:null }, // 1,2...3
    PAX_PRF_BagOutFirst_Code : { type: String, default: null },
    PAX_PRF_BagOutFirst_Name: { type: String, default: null },
    PAX_PRF_PriorityCheckin_Code: { type: String ,default: null },
    PAX_PRF_PriorityCheckin_Name: { type: String ,default: null },
    PAX_PRF_Lounge_Code: { type: String ,default: null },
    PAX_PRF_Lounge_Name: { type: String ,default: null },
    PAX_PRF_IsWebCheckin: {  type: String, default: null },
    Status: { typr: String, default:null },       
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

const PassengerPreference = mongoose.model(
  "PassengerPreference",
  passengerPreferenceSchema
);
module.exports = PassengerPreference;
