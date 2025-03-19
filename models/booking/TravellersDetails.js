const mongoose = require("mongoose");
const travellersDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    TravellersDetails: [
      {
        PaxType: { type: String, default: null, required: true },
        passengarSerialNo: { type: Number, default: null },
        Title: { type: String, default: null, required: true },
        FName: { type: String, default: null, required: true },
        LName: { type: String, default: null, required: true },
        Gender: { type: String, default: null, required: true },
        Dob: { type: String, default: null },
        Optional: {
          PassportNo: { type: String, default: null },
          PassportExpiryDate: { type: String, default: null },
          PassportIssuedDate: { type: String, default: null },
          FrequentFlyerNo: { type: String, default: null },
          Nationality: { type: String, default: null },
          ResidentCountry: { type: String, default: null },
        },
      },
    ],
    emailId: { type: String, default: null, required: true },
    phoneNumber: { type: String, default: null,  },
    modifyBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifyAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const TravellersDetails = mongoose.model(
  "TravellersDetails",
  travellersDetailsSchema
);
module.exports = TravellersDetails;
