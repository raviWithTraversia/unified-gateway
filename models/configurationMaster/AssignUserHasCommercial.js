const mongoose = require('mongoose');

const assignUserHasCommercial = new mongoose.Schema({
    companyId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
      },
      commercialPlanId: {
       type : mongoose.Schema.Types.ObjectId,
       ref : 'CommercialAirPlan'
    }
    },
    {
            timestamp: true
    }
    );
    const UserCommercialConfig = mongoose.model("UserCommercialConfig", assignUserHasCommercial);
    module.exports = UserCommercialConfig;