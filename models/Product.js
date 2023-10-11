const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName : {
        type : String,
        required : true,
        default : null
    },
    status : {
        type : Boolean,
        default : true
    }
},{
    timestamps : true  //add create_at updated_at coloumn
});

module.exports = mongoose.model('Product' , productSchema);