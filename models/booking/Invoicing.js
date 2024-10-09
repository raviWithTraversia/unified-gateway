const mongoose = require('mongoose');

const InvoicingSchema = new mongoose.Schema({ 
    cartId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "BookingDetails",
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        default:null
    },
    passenger:{
        type: Object,  
        required: true
    },
    invoiceNumber:{
        type:String,
        default:null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default:null
    },
    modifyAt: {
        type: Date,
        default: Date.now,
    },
    additionalInvoiceType:{
        type:String,
        default:null
    },
    invoiceStatus:{
        type:String,
        default:null
    }
},{
    timestamps : true  
});

module.exports = mongoose.model('Invoicing' , InvoicingSchema);