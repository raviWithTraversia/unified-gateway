const mongoose = require('mongoose');

const userBalanceSchema = new mongoose.Schema({
   userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref: "User"
   },
   totalCashBalance : {
    type : Number
   },
   flightCashBalance : {
    type : Number
   },
   railCashBalance : {
    type : Number
   },
   hotelCashBalance : {
    type : Number
   },
   flightTempBalance : {
     type : Number
   },
   railTempBalance : {
     type : Number
   },

   createdBy : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'User'
   },
   modifyBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'   
   }
},{
    timestamps : true
});

const userBalance = mongoose.model("userBalance", userBalanceSchema);
module.exports = userBalance; 
