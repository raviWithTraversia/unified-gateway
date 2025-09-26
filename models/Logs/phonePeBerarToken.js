const mongoose = require('mongoose');

const berarTokenPhonePe = new mongoose.Schema({
    berarToken:{
        type:String
    },
    expiresAt:{
        type:Number
    }

 
}, {
  timestamps: true
});

module.exports = mongoose.model('phonePeBerarToken', berarTokenPhonePe);
