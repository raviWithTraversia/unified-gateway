const mongoose = require('mongoose');

const PassengerSchema = new Schema({
    passengarSerialNo: { type: Number, default: null },
    title: { type: String, default: null },
    fName: { type: String, default: null },
    lName: { type: String, default: null },   
    cancellationStatus: { type: String, enum: ['Cancelled', 'Not Cancelled'], required: true },
    cancellationCharges: { type: Number, default: 0 },
    refundAmount: { type: Number, default: 0 },
    serviceCharges: { type: Number, default: 0 },
}, { _id: false }); 

const CreditNoteSchema = new Schema({
    creditNoteNo: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
      PNR: { type: Number, required: true },
    bookingDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    passengers: [PassengerSchema],
    totalCancellationCharges: { type: Number, default: 0 },
    totalRefundAmount: { type: Number, default: 0 },
    totalServiceCharges: { type: Number, default: 0 },
    status: { type: String, enum: ['Issued', 'Cancelled', 'Refunded'], default: 'Issued' },
    modifyBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      modifyAt: {
        type: Date,
        default: Date.now(),
      }
});
module.exports = mongoose.model('creditNotesSchema' , creditNotesSchema);