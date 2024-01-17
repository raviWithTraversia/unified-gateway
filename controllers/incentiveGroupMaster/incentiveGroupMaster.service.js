const IncentiveGroupMaster = require('../../models/IncentiveGroupMaster');
const IncentiveMaster = require('../../models/IncentiveMaster');
const User = require('../../models/User');
const IncentiveGroupHasIncentiveMaster = require('../../models/IncentiveGroupHasIncentiveMaster');
const commonFunction = require('../commonFunctions/common.function');

const addIncGroupMaster = async(req ,res) => {
    try {
        const {
            incentiveGroupName,
            companyId,
            IncentiveMasterId
        } = req.body;

        if(!companyId || !incentiveGroupName || !IncentiveMasterId) {
            return {
                response : 'All fields are required'
            }
        }
        const checkIncentiveMasterExistByComId = await IncentiveGroupMaster.findOne({companyId : companyId});
        if(checkIncentiveMasterExistByComId){
            isDefault = false;
        }else{
            isDefault = true
        }

        const saveIncGrp = new IncentiveGroupMaster({
            incentiveGroupName,
            companyId,
            isDefault
        });
        const result = await saveIncGrp.save();

        // PLBGroupHasPLBMaster add
        const incentiveGroupId = result._id
        IncentiveMasterId.forEach(async(element) => {
            const incentiveMasterId = element.incentiveMasterId;
            const addPIncGrpHasIncMaster = new IncentiveGroupHasIncentiveMaster({
                incentiveGroupId : incentiveGroupId,
                incentiveMasterId
            });
           const result = await addPIncGrpHasIncMaster.save();
        });

         // Log add 
         const doerId = req.user._id;
         const loginUser = await User.findById(doerId);
         await commonFunction.eventLogFunction(
             'IncentiveGroupMaster' ,
             doerId ,
             loginUser.fname ,
             req.ip , 
             companyId , 
             'IncentiveGroupMaster added successfully'
         );

        return {
            response : 'Incentive Group Master added successfully'
        }
    } catch (error) {
        throw error
    }
}

const updateIncGroupMaster = async(req ,res) => {
    try {
    
        const _id = req.params.incentiveGroupId;
        const {incentiveGroupName , IncentiveMasterId} = req.body;
        if(!incentiveGroupName || !IncentiveMasterId) {
            return {
                response : 'All fields are required'
            }
        }
       
        const updateIncGrpMaster =  await IncentiveGroupMaster.findByIdAndUpdate(_id, {
            incentiveGroupName
        }, { new: true })

       
        // Previous PLBGHasPLBMaster delete
        const result = await IncentiveGroupHasIncentiveMaster.deleteMany({ incentiveGroupId: _id });
       
        const incentiveGroupId = _id;
        IncentiveMasterId.forEach(async(element) => {
            const incentiveMasterId = element.incentiveMasterId;
            const addPLBGHasPLBM = new IncentiveGroupHasIncentiveMaster({
                incentiveGroupId : incentiveGroupId,
                incentiveMasterId
            });
           const result = await addPLBGHasPLBM.save();
        });

         // Log add 
         const doerId = req.user._id;
         const loginUser = await User.findById(doerId);
         await commonFunction.eventLogFunction(
            'IncentiveGroupMaster' ,
            doerId ,
            loginUser.fname ,
            req.ip , 
            loginUser.companyId , 
            'updated IncentiveGroupMaster successfully'
         );

        return {
            response : 'Incentive Group Master updated successfully'
        }


    } catch (error) {
        throw error;
    }
}


const removeIncGroup = async(req ,res) => {
    try {
        const result = await IncentiveGroupMaster.deleteOne({ _id: req.params.id });
        
        const checkIncentiveGroupHasPermissionExist = await IncentiveGroupHasIncentiveMaster.findOne({ incentiveGroupId: req.params.id });

        if (checkIncentiveGroupHasPermissionExist) {

            await IncentiveGroupHasIncentiveMaster.deleteMany({ incentiveGroupId: req.params.id });
        }

        // Log add 
        const doerId = req.user._id;
        const loginUser = await User.findById(doerId);

        await commonFunction.eventLogFunction(
            'IncentiveGroupMaster' ,
            doerId ,
            loginUser.fname ,
            req.ip , 
            loginUser.companyId , 
            'deleted Incentive Group Master deleted successfully'
        );
        return {
            response : 'Incentive Group Master deleted Successfully!'
        }

    } catch (error) {
        throw error;
    }
}


const getIncGrpMasterList = async(req , res) => {
    try {
        const companyId = req.params.companyId;
        const result = await IncentiveGroupMaster.find({ companyId: companyId });
        if (result.length > 0) {
            const allData = await Promise.all(result.map(async (IncentiveGroup) => {
                const newObj = {
                    "_id": IncentiveGroup._id,
                    "incentiveGroupName": IncentiveGroup.incentiveGroupName,
                    "companyId": IncentiveGroup.companyId,
                    "isDefault": IncentiveGroup.isDefault,
                    "createdAt": IncentiveGroup.createdAt,
                    "updatedAt": IncentiveGroup.updatedAt,
                    "IncentiveGroup": []
                };

                const IncentiveGroupH = await IncentiveGroupHasIncentiveMaster.find({ incentiveGroupId: IncentiveGroup._id })
              
                if (IncentiveGroupH.length > 0) {
                    newObj.IncentiveGroup.push(...IncentiveGroupH); // Use push with spread operator
                }

                return newObj;
            }));

            return {
                data: allData
            }
        } else {
            return {
                response: 'Incentive Group Master not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}


const getIncGroupHasIncMaster = async(req, res) => {
    try {
        const incentiveGroupId = req.params.incentiveGroupId;
        const result = await IncentiveGroupHasIncentiveMaster.find({ incentiveGroupId: incentiveGroupId });
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Incentive Group Master has not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}


const defineIncetiveGroupDefault = async(req , res) => {
    try {
        const _id = req.params.id;
        const {companyId} = req.body;
        if(!companyId) {
            return {
                response : 'Company Id is required'
            }
        }
        await IncentiveGroupMaster.updateMany({ companyId }, { isDefault: false });

        const result = await IncentiveGroupMaster.findByIdAndUpdate( _id , {isDefault : true }, { new: true });
        return {
            response : 'Incentive group master define as default'
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    addIncGroupMaster,
    updateIncGroupMaster,
    removeIncGroup,
    getIncGrpMasterList,
    getIncGroupHasIncMaster,
    defineIncetiveGroupDefault
}