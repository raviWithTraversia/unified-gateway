const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    supplierCode: {
        type : String,
        required: true
    } ,
    companyId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Company'
    },
    supplierName: {
        type : String,
        required : true
    },
    type: {
        type : String,
        required : true
    }, 
    status: {
        type : Boolean,
        default : true
    },

},{
    timestamps : true  //Add created_at and updated_at coloumn
});

module.exports = mongoose.model('Provider' , providerSchema);
