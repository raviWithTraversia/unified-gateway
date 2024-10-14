const mongoose = require('mongoose');

const InvoicingRailDataSchema = new mongoose.Schema({ 
    invoiceNumber:{
        type:String,
        default:null
    },
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "RailBookingDetails",
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        default:null
    },
    passenger:{
        type: Object,  
        required: true
    },
    generatedByuserID:{
        type: mongoose.Schema.Types.ObjectId,
        default:null
        // ref: "User",
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    AgencyId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    }]
},{
    timestamps : true  
});

module.exports = mongoose.model('InvoicingRailData' , InvoicingRailDataSchema);