const mongoose = require('mongoose');

const assignUserHasPlbGroupMaster = new mongoose.Schema({
    companyId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
      },
    salesInchargeId: {
       type : mongoose.Schema.Types.ObjectId,
       ref: 'PLBGroupMaster',
    }
    
    },
    {
            timestamp: true
    }
    );
    const UserPlbGroupMasterConfig = mongoose.model("UserPlbGroupMasterConfig", assignUserHasPlbGroupMaster);
    module.exports = UserPlbGroupMasterConfig;