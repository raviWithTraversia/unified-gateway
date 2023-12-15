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
            UserId,
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
                UserId,
                modifyBy : req.user._id
            });
            agentConfigsInsert = await agentConfigsInsert.save();
            if(agentConfigsInsert){
                return {
                    response : 'Agent Config Insert Sucessfully',
                    data : agentConfigsInsert
                }
            }
            
        }else if(checkIsRole.roleId.name == 'Agent' ||checkIsRole.roleId.name == 'agent'){
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
                UserId,
                modifyBy : req.user._id
            });
            agentConfigsInsert = await agentConfigsInsert.save();
            if(agentConfigsInsert){
                return {
                    response : 'Agent Config Insert Sucessfully',
                    data : agentConfigsInsert
                }
            }
        }
        else{
            return {
                response : 'User  is not Tmc or agent or distributer'
            }
        }
    }catch(error){
        console.log(error);
        throw error
    }
};
const updateAgentConfiguration = async (req,res) => {
    try{
    console.log(req, "cccccccccccccccccccccccccccccccc")
    let userId = req.body.userId;   
    let checkIsAcgencyConfigExist = await agentConfigs.find(userId);
    if(checkIsAcgencyConfigExist){
        let updateData = req.body;
        let updateConfig= await agentConfigs.findOneAndUpdate(
            req.body.userId,
          {
            $set: updateData,
            modifyAt: new Date(),
            modifyBy: req.user._id,
          },
          { new: true }
        );
        if (updateConfig) {
          return {
            response: "Agency config data update Sucessfully",
            data: updateFareRuleData,
          };

        }else{
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
            UserId,
        } = req.body
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
            UserId,
            modifyBy : req.user._id
        });
        agentConfigsInsert = await agentConfigsInsert.save();
        if(agentConfigsInsert){
            return {
                response : 'Agency config data update Sucessfully',
                data : agentConfigsInsert
            }
        }
       }
       return{
        response : 'Agency config data not update'
       }

}
    }catch(error){
        console.log(error)
        throw error
    }
}


module.exports = {
    addAgentConfiguration,
    updateAgentConfiguration
}