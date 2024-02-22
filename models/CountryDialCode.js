const mongoose = require('mongoose')
const countrySchema = new mongoose.Schema({
    name: String,
    dial_code: String,
    code: String
  });

  const countryDialMaping = mongoose.model("countryDialMaping", countrySchema);
  module.exports = countryDialMaping;