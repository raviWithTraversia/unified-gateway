const mongoose = require('mongoose');

const BookingTempSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    source: {
        type: String,
        default: null
    },
    BookingId: {
        type: String,
        default: null
    },
    request: {
        type: String,
        default: null
    },
    responce: {
        type: String,
        default: null
    },
    count: {
        type: Number,
        default: 0
    }, 
    cartId: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

/* 🔹 Indexes */
BookingTempSchema.index({ BookingId: 1 });
BookingTempSchema.index({ cartId: 1 });

module.exports = mongoose.model('BookingTemp', BookingTempSchema);
