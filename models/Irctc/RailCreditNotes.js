const mongoose=require('mongoose')
const RailCreditNoteSchema = new mongoose.Schema({
    creditNoteNo: { type: String, default:null },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
      invoiceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"InvoicingData"
      },
      RailCancelationData:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RailCancellation"
},

BookingData:{
     type:mongoose.Schema.Types.ObjectId,
        ref:"bookingDetailsRail"
},
status: { type: String,  default: 'Issued' },
bookingId:{type:String,default:""},

    modifyBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      modifyAt: {
        type: Date,
        default: Date.now,
      }
});
module.exports = mongoose.model('RailcreditNotesSchema' , RailCreditNoteSchema);