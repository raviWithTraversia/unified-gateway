const mongoose = require('mongoose');

const assignUserHasFairRuleGroup = new mongoose.Schema({
    companyId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
      },
    fairRuleGroupId: {
       type : mongoose.Schema.Types.ObjectId,
       ref : 'FareRuleGroup'
    }
    },
    {
            timestamp: true
    }
    );
    const UserHasFairRuleConfig = mongoose.model("UserHasFairRuleConfig", assignUserHasFairRuleGroup);
    module.exports = UserHasFairRuleConfig;