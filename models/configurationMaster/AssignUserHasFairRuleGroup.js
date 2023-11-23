const mongoose = require('mongoose');

const assignUserHasFairRuleGroup = new mongoose.Schema({
    companyId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
      },
    salesInchargeId: {
       type : mongoose.Schema.Types.ObjectId,
       ref : 'FairRuleGroup'
    }
    },
    {
            timestamp: true
    }
    );
    const UserHasFairRuleGroup = mongoose.model("UserHasFairRuleGroup", assignUserHasFairRuleGroup);
    module.exports = UserHasFairRuleGroup