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
    const UserHasSalesIncharge = mongoose.model("UserHasSalesIncharge", assignUserHasSalesIncharge);
    module.exports = UserHasSalesIncharge