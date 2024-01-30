const mongoose = require('mongoose');
const countryMapSchema = new mongoose.Schema(
    {
      countries : {
         type : String
      },
      continentCode : {
        type : String
      },
      companyId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
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