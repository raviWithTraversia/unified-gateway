const mongoose = require('mongoose');

const assignUserHasPrevillagePlan = new mongoose.Schema({
    companyId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
      },
      privilagePlanId: {
       type : mongoose.Schema.Types.ObjectId,
       ref : 'PrivilagePlan'
    }
    
    },
    {
            timestamp: true
    }
    );
    const UserPervillagePlanConfig = mongoose.model("UserPervillagePlanConfig", assignUserHasPrevillagePlan);
    module.exports = UserPervillagePlanConfig;