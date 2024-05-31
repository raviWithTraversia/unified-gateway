const mongoose = require("mongoose");
const amendmentpassengerPreferenceSchema = new mongoose.Schema({
    amendmentId: {
        // AMD103425
        type: String,
        default: null,
      },
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
    GstData:{
      gstNumber:{ type: String, default:null },
      gstName:{ type: String, default:null },
      gstmobile:{ type: String, default:null },
      gstEmail:{ type: String, default:null },
      gstAddress:{ type: String, default:null }
    },
    PaxEmail:{ type: String, default:null },
    PaxMobile:{ type: String, default:null },
    Passengers:[{
      PaxType:{ type: String, default:null },      
      passengarSerialNo:{ type: Number, default:null },
      Title:{ type: String, default:null },
      FName:{ type: String, default:null },
      LName:{ type: String, default:null },
      Gender:{ type: String, default:null },
      Dob:{ type: String, default:null },
      barCode2D:[{        
        FCode:{ type: String, default:null },
        FNo:{ type: String, default:null }, 
        Src:{ type: String, default:null },
        Des:{ type: String, default:null },
        Code:{ type: String, default:null }        
        }],
      Optional:{
      TicketNumber:{ type: String, default:null },
      PassportNo:{ type: String, default:null },
      PassportExpiryDate:{ type: String, default:null },
      FrequentFlyerNo:{ type: String, default:null },
      Nationality:{ type: String, default:null },
      ResidentCountry:{ type: String, default:null }
      },
      Meal:[{
      Trip:{ type: String, default:null },
      FCode:{ type: String, default:null },
      FNo:{ type: String, default:null },
      SsrCode:{ type: String, default:null },
      SsrDesc:{ type: String, default:null },
      Complmnt:{ type: String, default:true },
      Currency:{ type: String, default:null },
      Price:{ type: Number, default:0 },
      rePrice:{ type: Number, default:0 },
      Src:{ type: String, default:null },
      Des:{ type: String, default:null },
      SsrFor:{ type: String, default:null },
      OI:{ type: String, default:null },
      }],
      Baggage:[{
      Trip:{ type: String, default:null },
      FCode:{ type: String, default:null },
      FNo:{ type: String, default:null },
      SsrCode:{ type: String, default:null },
      SsrDesc:{ type: String, default:null },
      Complmnt:{ type: String, default:true },
      Currency:{ type: String, default:null },
      Price:{ type: Number, default:0 },
      rePrice:{ type: Number, default:0 },
      Src:{ type: String, default:null },
      Des:{ type: String, default:null },
      SsrFor:{ type: String, default:null },
      OI:{ type: String, default:null },
      }],
      Seat:[{
        Trip:{ type: String, default:null },
      FCode:{ type: String, default:null },
      FNo:{ type: String, default:null },
      SsrCode:{ type: String, default:null },
      SsrDesc:{ type: String, default:null },
      Complmnt:{ type: String, default:true },
      Currency:{ type: String, default:null },
      Price:{ type: Number, default:0 },
      TotalPrice:{ type: Number, default:0 },
      Src:{ type: String, default:null },
      SeatCode:{ type: String, default:null },
      Des:{ type: String, default:null },
      SsrFor:{ type: String, default:null },
      OI:{ type: String, default:null },
      }],
      totalPublishedPrice: { type: Number, default:0 },
      totalBaggagePrice: { type: Number, default:0 },
      totalMealPrice: { type: Number, default:0 },
      totalSeatPrice: { type: Number, default:0 },
    }],       
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

const AmendmentPassengerPreference = mongoose.model(
  "AmendmentPassengerPreference",
  amendmentpassengerPreferenceSchema
);
module.exports = AmendmentPassengerPreference;
