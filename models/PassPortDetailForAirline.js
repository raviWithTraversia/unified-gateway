const mongoose = require('mongoose');
const makePassportDetailSchema = new mongoose.Schema({
    airlineCode : {
      type : String
    },
    passportNumber : {
       type : Boolean,
       default : false
    },
    passportExpiry : {
        type : Boolean,
        default : false
    },
    dateOfBirth : {
        type : Boolean,
        default : false
    },
    dateOfIssue : {
        type : Boolean,
        default : false
    },
    updatedBy: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    companyId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Company'
    }

}, {
    timestamps : true
});

const passportDetailsForAirline = mongoose.model("passportDetailsForAirline", makePassportDetailSchema);
module.exports = passportDetailsForAirline;