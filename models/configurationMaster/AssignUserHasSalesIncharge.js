const mongoose = require('mongoose');

const assignUserHasSalesIncharge = new mongoose.Schema({
    companyId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
      },
    salesInchargeId: {
       type : mongoose.Schema.Types.ObjectId,
       ref: 'User',
    }
    
    },
    {
            timestamp: true
    }
    );
    const UserHasSalesInchargeConfig = mongoose.model("UserHasSalesInchargeConfig", assignUserHasSalesIncharge);
    module.exports = UserHasSalesInchargeConfig;