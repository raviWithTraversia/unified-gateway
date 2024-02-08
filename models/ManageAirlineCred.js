const mongoose = require('mongoose');

const manageAirlineCredSchema = new mongoose.Schema({
    supplierCodeId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'SupplierCode'
    },
    allowed : {
        type : Boolean,
        default : false
    },
    searchAllowed : {
        type : Boolean,
        default : false
    },
    bookAllowed : {
        type : Boolean,
        default : false
    },
    importAllowed : {
        type : Boolean,
        default : false
    },
    companyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Company'
    },
    modifyBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
},{
    timestamps : true
});
const manageAirlineCredential = mongoose.model("manageAirlineCredential",manageAirlineCredSchema);
module.exports = manageAirlineCredential;