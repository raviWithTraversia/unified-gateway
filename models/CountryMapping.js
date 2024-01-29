const mongoose = require('mongoose');
const countryMapSchema = new mongoose.Schema(
    {
      countries : {
         type : String
      },
      ContinentCode : {
        type : String
      },
      modifyBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    },
    {
      timestamps: true,
    }
  );
  
  const countryMaping = mongoose.model("countryMaping", countryMapSchema);
  module.exports = countryMaping;