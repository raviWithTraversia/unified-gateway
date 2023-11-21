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
    const UserSalesIncharge = mongoose.model("UserSalesIncharge", assignUserHasSalesIncharge);
    module.exports = UserSalesIncharge