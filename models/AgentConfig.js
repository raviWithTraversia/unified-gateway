const mongoose = require("mongoose");

const agentConfigSchema = new mongoose.Schema(
  {
    userId : {
     type : mongoose.Schema.Types.ObjectId,
     ref : 'User'
    },
    companyId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Company'
    },

    privilegePlansIds:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "privilagePlan",
      }],
    commercialPlanIds:[{
    
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommercialAirPlan",
      
    }],
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    creditPlansIds:[{
    
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommercialAirPlan",
   
    }],
    fareRuleGroupIds: [{
     
        type: mongoose.Schema.Types.ObjectId,
        ref: " fareRuleGroup",
      }],
      salesInchargeIds: [{
      
          type: mongoose.Schema.Types.ObjectId,
          ref: " User",
        
      }],
      plbGroupIds: [{
       
          type: mongoose.Schema.Types.ObjectId,
          ref: " PLBGroupMaster",
      
      }],
      incentiveGroupIds:[{
       
          type: mongoose.Schema.Types.ObjectId,
          ref: " IncentiveGroupMaster",
      
      }],
      portalLedgerAllowed: {
        type: Boolean,
      },
      accountCode: {
        type: String,
      },

      tds: {
        type: String,
      },
      maxcreditLimit: {
        type: Number,
      },
      holdPNRAllowed: {
        type: Boolean,
      },
      acencyLogoOnTicketCopy: {
        type: Boolean,
      },
      addressOnTicketCopy: {
        type: Boolean,
      },
      fareTypes: {
        regular: { type: Boolean },
        sme: { type: Boolean },
        corporate: { type: Boolean },
        agency: { type: Boolean },
        series: { type: Boolean },
      },
      modifyBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      modifyAt : {
        type : Date,
        default : Date.now()
      }
    },
  {
    timestamps: true,
  }
);

const AgentConfiguration = mongoose.model( "AgentConfiguration", agentConfigSchema);
module.exports = AgentConfiguration;
