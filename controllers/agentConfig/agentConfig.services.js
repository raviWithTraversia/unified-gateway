const agentConfigs = require('../../models/AgentConfig');
const  userModel = require('../../models/User');
const mongoose = require('mongoose');

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
    const { userId , companyId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return {
            response: 'Invalid userId format',
        };
    }
    let checkIsAcgencyConfigExist = await agentConfigs.findOne({
        $or: [{ userId: userId }, { companyId: companyId }],
      });
    //console.log(checkIsAcgencyConfigExist,",,,,,,,,,,,,,,,,,,checkIsAcgencyConfigExist")
    if(checkIsAcgencyConfigExist !== null || checkIsAcgencyConfigExist.length !== 0){
        let updateData = req.body;
        let updateConfig = await agentConfigs.findByIdAndUpdate(
          { _id : req.query.id},
            {
                $set: {
                    ...updateData
                },
            },
            { new: true }
        );
        
        if (updateConfig) {
            return {
                response: "Config data updated successfully",
                data: updateConfig,
            };
        } else {
            return {
                response: 'Agency config data not found or not updated',
            };
        }

    }else{
    try{
        let {
            tds,
            maxcreditLimit,
            holdPNRAllowed,
            privilegePlansIds,
            commercialPlanIds,
            creditPlansIds,
            fareRuleGroupIds,
            portalLedgerAllowed,
            salesInchargeIds,
            plbGroupIds,
            incentiveGroupIds,
            accountCode,
            acencyLogoOnTicketCopy,
            addressOnTicketCopy,
            fareTypes,
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
            companyId,
                modifyAt: new Date(),
                modifyBy: req.user._id,
            });
            console.log(agentConfigsInsert, "[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]")
            agentConfigsInsert = await agentConfigsInsert.save();
            if(agentConfigsInsert){
                return {
                    response : 'TMC Config Insert Sucessfully',
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
                userId,
                companyId,
                modifyAt: new Date(),
                modifyBy: req.user._id,
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