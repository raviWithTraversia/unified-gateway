const mongoose = require('mongoose');

const InvoicePriceBreakupSchema = new mongoose.Schema({ 
    invoiceNumber:{
        type:String,
        default:null
    },
    priceCategory:{
        type:String,
        default:null
    },
    priceType:{
        type:String,
        default:null
    },
    basicPrice:{
        type: Number, 
        default: null
    },
    tax:{
        type: Number, 
        default: null
    },
    passenger:{
        type: Object,  
        required: true
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        default:null
    }
});

module.exports = mongoose.model('InvoicePriceBreakup' , InvoicePriceBreakupSchema);