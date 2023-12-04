const mongoose = require('mongoose');

const assignUserHasIncentiveGroup = new mongoose.Schema({
    companyId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
      },
    salesInchargeId: {
       type : mongoose.Schema.Types.ObjectId,
       ref : 'IncentiveGroupMaster'
    }
    },
    {
            timestamp: true
    }
    );
    const UserIncentiveGroupConfig = mongoose.model("UserIncentiveGroupConfig", assignUserHasIncentiveGroup);
    module.exports = UserIncentiveGroupConfig;