const mongoose = require('mongoose');

const InvoicingDataSchema = new mongoose.Schema({ 
    invoiceNumber:{
        type:String,
        default:null
    },
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
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
        ref: "User",
    }]
},{
    timestamps : true  
});
InvoicingDataSchema.index({bookingId: 1 });

module.exports = mongoose.model('InvoicingData' , InvoicingDataSchema);