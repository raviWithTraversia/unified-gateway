const PLBGroupMaster = require('../../models/PLBGroupMaster');
const PLBMaster = require('../../models/PLBMaster');
const User = require('../../models/User');
const PLBGroupHasPLBMaster = require('../../models/PLBGroupHasPLBMaster');
const commonFunction = require('../commonFunctions/common.function');

const addPLBGrpMaster = async(req ,res) => {
    try {
        const {
            PLBGroupName,
            companyId,
            PLBMasterID
        } = req.body;

        if(!companyId || !PLBGroupName || !PLBMasterID) {
            return {
                response : 'All fields are required'
            }
        }
        const savePLBGrp = new PLBGroupMaster({
            PLBGroupName,
            companyId,
        });
        const result = await savePLBGrp.save();

        // PLBGroupHasPLBMaster add
        const PLBGroupId = result._id
        PLBMasterID.forEach(async(element) => {
            const PLBMasterId = element.PLBMasterId;
            const addPLBGHasPLBM = new PLBGroupHasPLBMaster({
                PLBGroupId : PLBGroupId,
                PLBMasterId
            });
           const result = await addPLBGHasPLBM.save();
        });

         // Log add 
        
         const doerId = req.user._id;
         const loginUser = await User.findById(doerId);
         await commonFunction.eventLogFunction(
             'PLBMasterGroup' ,
             doerId ,
             loginUser.fname ,
             req.ip , 
             companyId , 
             'add PLB Master Group'
         );

        return {
            response : 'PLB Group master added successfully'
        }
    } catch (error) {
        throw error
    }
}

const updatePLBGroupMaster = async(req ,res) => {
    try {
    
        const _id = req.params.plbGroupId;
        const {PLBGroupName , PLBMasterID} = req.body;
        if(!PLBGroupName || !PLBMasterID) {
            return {
                response : 'All fields are required'
            }
        }
       
        const updatePLB =  await PLBGroupMaster.findByIdAndUpdate(_id, {
            PLBGroupName
        }, { new: true })

       
        // Previous PLBGHasPLBMaster delete
        const result = await PLBGroupHasPLBMaster.deleteMany({ PLBGroupId: _id });
       
        const PLBGroupId = _id;
        PLBMasterID.forEach(async(element) => {
            const PLBMasterId = element.PLBMasterId;
            const addPLBGHasPLBM = new PLBGroupHasPLBMaster({
                PLBGroupId : PLBGroupId,
                PLBMasterId
            });
           const result = await addPLBGHasPLBM.save();
        });

         // Log add 
         const doerId = req.user._id;
         const loginUser = await User.findById(doerId);
         await commonFunction.eventLogFunction(
            'PLBMasterGroup' ,
            doerId ,
            loginUser.fname ,
            req.ip , 
            loginUser.companyId , 
            'updated PLB Master Group'
         );

        return {
            response : 'PLB Group master updated successfully'
        }


    } catch (error) {
        throw error;
    }
}


const removePLBGroup = async(req ,res) => {
    try {
        const result = await PLBGroupMaster.deleteOne({ _id: req.params.id });

        // Log add 
        const doerId = req.user._id;
        const loginUser = await User.findById(doerId);

        await commonFunction.eventLogFunction(
            'PLBMasterGroup' ,
            doerId ,
            loginUser.fname ,
            req.ip , 
            loginUser.companyId , 
            'deleted PLB Master Group'
        );
        return {
            response : 'PLB group master deleted Successfully!'
        }

    } catch (error) {
        throw error;
    }
}


const getPLBGroupMasterList = async(req , res) => {
    try {
        const companyId = req.params.companyId;
        const result = await PLBGroupMaster.find({ companyId: companyId });
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'PLB Group Master not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}


const getPLBGroupHasPLBMaster = async(req, res) => {
    try {
        const PLBGroupId = req.params.PLBGroupId;
        const result = await PLBGroupHasPLBMaster.find({ PLBGroupId: PLBGroupId });
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'PLB Group has master not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

module.exports = {
    addPLBGrpMaster,
    updatePLBGroupMaster,
    removePLBGroup,
    getPLBGroupMasterList,
    getPLBGroupHasPLBMaster
}