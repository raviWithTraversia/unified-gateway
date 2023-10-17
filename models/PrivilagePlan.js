const mongoose = require('mongoose');

const privilagePlanSchema = new mongoose.Schema({
    companyId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    privilagePlanName : {
        type :String,
        required : false,
        default : null
    },
    productPlanId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductPlan', 
    },
    status : {
        type :Boolean,
        default : true
    }
},{
    timestamps : true  //add created_at and updated_at
});

module.exports = mongoose.model('privilagePlan' , privilagePlanSchema);