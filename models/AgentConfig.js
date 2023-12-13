const mongoose = require('mongoose');

const agentConfigSchema = new mongoose.model({
    privilegePlansIds : {  
        privilegePlansId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'privilagePlan'
    }
},
commercialPlanIds : { 
    commercialPlanId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'CommercialAirPlan'
    }
},
creditPlansIds : {
    creditPlansId: {  
    type : mongoose.Schema.Types.ObjectId,
    ref : 'CommercialAirPlan'
}
},
fareRuleGroupIds : {
    fareRuleGroupId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : ' fareRuleGroup'
    } 
},
portalLedgerAllowed  : {
    type : Boolean
},
salesInchargeIds : {
    salesInchargeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : ' User'

    }
},
plbGroupIds : {
    plbGroupId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : ' PLBGroupMaster'
    }
},
incentiveGroupIds : {
    incentiveGroupId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : ' IncentiveGroupMaster'
    }
},
accountCode : {
    type :  String
},

tds : {
    type :  String 
},
maxcreditLimit : {
    type : Number
},
holdPNRAllowed : {
    type : Boolean
},
acencyLogoOnTicketCopy : {
    type : Boolean
},
addressOnTicketCopy : {
    type : Boolean
},
fareTypes : {
    regular : { type : Boolean},
    sme : { type : Boolean},
    corporate : {type : Boolean},
    agency : {type : Boolean},
    series : {type : Boolean}
},
UserId : {
   type : mongoose.Schema.Types.ObjectId,
   ref : 'User'
}

},{
    timestamps: true 
});
const agentConfiguration = mongoose.model("agentConfiguration", agentConfigSchema);
module.exports = agentConfiguration;