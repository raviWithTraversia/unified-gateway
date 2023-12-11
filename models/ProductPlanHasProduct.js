const mongoose = require('mongoose');

const ProductPlanHasProducts = new mongoose.Schema({
    productPlanId : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductPlan',
    },
    productId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }
},{
    timestamps : true  //Add created_at and updated_at coloumn
});

module.exports = mongoose.model('ProductPlanHasProducts' , ProductPlanHasProducts)