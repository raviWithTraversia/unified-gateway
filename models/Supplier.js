const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    cadeId: {
        type : String,
        required : true
    },
    companyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Company'
    },
    supplierCode: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'SupplierCode'
    },
    supplierUserId: {
        type : String,
    },
    supplierPassword: {
        type : String,
        default: null
    },
    supplierSudo: {
        type : String,
        default: null
    },
    accountNumber: {
        type : String,
        default: null
    },
    accountPassword: {
        type : String,
        default: null
    },
    accountVersion: {
        type : String,
        default: null
    },
    credentialsType: {
        type : String,
        default: null
    },
    status: {
        type : Boolean,
        default: false
    },
    supplierOfficeId: {
        type : String,
        default: null
    },
    domesticExcludeAirline: {
        type : String,
        default: null
    },
    domesticIncludeAirline: {
        type : String,
        default: null
    },
    searchAllow: {
        type : Boolean,
        default: null
    },
    bookAllow: {
        type : Boolean,
        default: null
    },
    importAllow: {
        type : Boolean,
        default: null
    },
    productClass: {
        type : String,
        default: null
    },
    fareType: {
        type : String,
        default: null
    },
    GKPnrAllow: {
        type : Boolean,
        default: null
    },
    internationalncludeAirline: {
        type : String,
        default: null
    },
    internationalExcludeAirline: {
        type : String ,
        default: null
    },
    billingAccountCode: {
        type : String,
        default: null
    }
  }, {
    timestamps: true // Adds created_at and updated_at fields
  });
module.exports = mongoose.model('Supplier' , supplierSchema);
