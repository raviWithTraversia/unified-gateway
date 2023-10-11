const mongoose = require('mongoose');

const productPlanSchema = new mongoose.Schema({
    productPlanName : {
        type : String,
        required : true,
        default : null
    },
    companyId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    status : {
        type : Boolean,
        default : true
    }
}, {
    timestamps : true //add created_at and updated_at coloumn
});

module.exports = mongoose.model('ProductPlan' , productPlanSchema);