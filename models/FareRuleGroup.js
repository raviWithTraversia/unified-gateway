const mongoose = require('mongoose');

const fairRuleGroupSchema = new mongoose.Schema({
    fareRuleIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fareRule'
      }],
      fareRuleGroupName : {
        type : String
      },
      fareRuleGroupDescription : {
        type : String
      },
      modifyAt :{
        type : Date
      },
      modifyBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
      },
      companyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Company'
      },
      isDefault : {
        type : Boolean,
        default: false
      }
});
const fareRuleGroup = mongoose.model("fareRuleGroup", fairRuleGroupSchema);
module.exports = fareRuleGroup;