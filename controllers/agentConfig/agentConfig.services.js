const agentConfigs = require('../../models/AgentConfig');
const  userModel = require('../../models/User');

const addAgentConfiguration = async (req,res) => {
    try{
        let {
            privilegePlansIds,
            commercialPlanIds,
            creditPlansIds,
            fareRuleGroupIds,
            portalLedgerAllowed,
            salesInchargeIds,
            plbGroupIds,
            incentiveGroupIds,
            accountCode,
            tds,
            maxcreditLimit,
            holdPNRAllowed,
            acencyLogoOnTicketCopy,
            addressOnTicketCopy,
            fareTypes,
            UserId
        } = req.body;
        let userId = req.user._id
        let checkIsRole =  await userModel.findById(userId).populate('roleId').exec();
        if(checkIsRole.roleId.name == 'Tmc' ||checkIsRole.roleId.name == 'TMC' ){
            let agentConfigsInsert = await agentConfigs.create({
                privilegePlansIds,
                commercialPlanIds,
                creditPlansIds,
                fareRuleGroupIds,
                portalLedgerAllowed,
                salesInchargeIds,
                plbGroupIds,
                incentiveGroupIds,
                accountCode,
                tds,
                maxcreditLimit,
                holdPNRAllowed,
                acencyLogoOnTicketCopy,
                addressOnTicketCopy,
                fareTypes,
                UserId
            });
            agentConfigsInsert = await agentConfigsInsert.save();
            
        }else{
            return {
                response : 'User Role is not Tmc'
            }
        }

    }catch(error){
        console.log(error);
        throw error
    }
};


module.exports = {
    addAgentConfiguration
}