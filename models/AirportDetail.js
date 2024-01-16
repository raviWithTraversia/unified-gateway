const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({           
    City_Name: { type: String, required: true },
    Country_Name: { type: String, required: true },
    Country_Code: { type: String, required: true },
    Country_Code_3Letter: { type: String, required: true },
    Airport_Name: { type: String, required: true },
    Airport_Code: { type: String, required: true },
    City_Code: { type: String, required: true },
    INS_GEO_Code: { type: Number, required: true },
    Continent_Name: { type: String, required: true },
    Continent_Code: { type: String, required: true },
    Language_Code: { type: String, required: true },
  });
const airport  = mongoose.model("airport", airportSchema);
module.exports = airport;