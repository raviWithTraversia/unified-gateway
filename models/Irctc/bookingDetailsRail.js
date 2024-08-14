const mongoose = require("mongoose");


const bookingDetailsRailSchema = new mongoose.Schema(
    
    {
        companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company",
      },
     
        userID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,

    },

    credentialType:{
        type: String,
      default:"TEST",
    },

    salesChannel:{
        type: String,
        enum: [ 'B2C','B2E', 'B2B'],
    },

    trainNo:{
        type: String,
        required: true,
    },

    ticketNo:{
        type: Number,
        required: true,
    },

    ticketPnrNo:{
        type: Number,
        required: true,
    },

    departureDate:{
        type: Date,
        required: true,
    },

    arrivalDate:{
        type: Date,
        default: null,
    },


    boardingStation:{
        type: String,
        required: true,
    },

    dropStation:{
        type: String,
        required: true,
    },
       
    jClass:{
        type: String,
        default:"null",
    },

    jQuota:{
        type: String,
        default:"null",
    },

    noFSeats:{
        type: Number,
        default: 1,
    },

    bookingId:{
        type: String,
        required: true,
    },
    
    providerBookingId:{
        type: String,
        required: true,
    },

    bookingDate:{
        type: Date,
        default: new Date(),
    },

    ticketCharges:{
        type: Number,
        required: true,
    },

    totalCost:{
        type: Number,
        required: true,
    },
    
    
    createdBy: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },

      accountName: {
        type: String,
        required: true,
      },
      accountNumber: {
        type: String,
        required: true,
      },
      ifscCode: {
        type: String,
        required: true,
      },
      bankAddress: {
        type: String,
        required: true,
      },
      bankName: {
        type: String,
        required: true,
      },
      bankCode: {
        type: String,
        required: true,
      },
      QrcodeImagePath: {
        type : String
      },


    createdAt:{
        type: Date,
        default: new Date(),

    },

    updatedAt:{
        type: Date,
        default: new Date(),
},
    },
    
    {
      timestamps: true,
    }
  );
  const bookingDetailsRail = mongoose.model("bookingDetailsRail", bookingDetailsRailSchema);
  module.exports = bookingDetailsRail;


 
  
  