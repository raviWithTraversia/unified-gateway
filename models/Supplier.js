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
        type : String,
        required: true
    },
    supplierUserId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Company' /// need to discuss
    },
    supplierPassword: {
        type : String,
        required : true
    },
    supplierSudo: {
        type : String,
        required : true
    },
    accountNumber: {
        type : String,
        required : true
    },
    accountPassword: {
        type : String,
        required : true
    },
    accountVersion: {
        type : String,
        required : true
    },
    credentialsType: {
        type : String,
        required : true
    },
    status: {
        type : Boolean,
        required : true
    },
    supplierOfficeId: {
        type : String,
        required : true
    },
    domesticExcludeAirline: {
        type : String,
        required : true
    },
    domesticIncludeAirline: {
        type : String,
        required : true
    },
    searchAllow: {
        type : Boolean,
        required : true
    },
    bookAllow: {
        type : Boolean,
        required : true
    },
    importAllow: {
        type : Boolean,
        required : true
    },
    productClass: {
        type : String,
        required : true
    },
    fareType: {
        type : String,
        required : true
    },
    GKPnrAllow: {
        type : Boolean,
        required : true
    },
    internationalncludeAirline: {
        type : String,
        rrquired : true
    },
    internationalExcludeAirline: {
        type : String ,
        required : true
    },
    billingAccountCode: {
        type : String,
        required : true
    }
  }, {
    timestamps: true // Adds created_at and updated_at fields
  });
module.exports = mongoose.model('Supplier' , supplierSchema);
