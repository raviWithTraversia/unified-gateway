const mongoose = require('mongoose');

const assignUserHasCommercial = new mongoose.Schema({
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
    const UserComerCialConfig = mongoose.model("UserComerCialConfig", assignUserHasCommercial);
    module.exports = UserComerCialConfig