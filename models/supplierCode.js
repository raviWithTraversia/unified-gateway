const mongoose = require('mongoose');

const supplierCodeSchema = new mongoose.Schema({
    supplierCode: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
const SupplierCode = mongoose.model("SupplierCode", supplierCodeSchema);

module.exports = SupplierCode;