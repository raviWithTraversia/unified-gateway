const mongoose = require('mongoose');

const emailConfigSchema = new mongoose.Schema({
    descriptionName : {
        type : String,
        required : true
    }

});
const emailConfigDiscription = mongoose.model("emailConfigDiscription", emailConfigSchema);

module.exports = emailConfigDiscription;
