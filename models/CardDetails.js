const mongoose = require('mongoose');

const CardDetailsSchema = new mongoose.Schema({
    bankName : {
        type : String,
        required : true
    },
    cardNumber : {
        type : String,
        required : true
    },
    cardHolderName : {
        type : String,
        required : true
    },
    expiryMonth : {
        type : String,
        required : true
    },
    expiryYear : {
        type : String,
        required : true
    },
    Address1 : {
      type : String,
      
    },
    Address2 : {
        type : String,
      
    },
    cityId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'City'
    },
    Pincode : {
        type : String,
        required : true 
    },
    DisplayName : {
        type : String,
        required : true
    },
    billingCycleDayFrom : {
        type : Number,
        required : true
    },
    billingCycleDayTo : {
        type : Number,
        required : true
    },
    cardType : {
        type : String,
        required : true
    },
    ApplicableOnBookingSupplier : {
        type : String,
        required : true
    },
    cvv : {
        type : String,
        required : true 
    },
    isEnabled : {
        type : Boolean,
        default : false
        
    },
    IsShowLast4Digit : {
        type : Boolean,
        default : false
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    createdAt :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    modifyBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    modifyAt : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
 
},{
    timestamps : true 
});
const CardDetailsModel = mongoose.model("CardDetailsModel", CardDetailsSchema);
module.exports = CardDetailsModel;