const PLBGroupMaster = require('../../models/PLBGroupMaster');
const PLBMaster = require('../../models/PLBMaster');
const User = require('../../models/User');
const PLBGroupHasPLBMaster = require('../../models/PLBGroupHasPLBMaster');
const commonFunction = require('../commonFunctions/common.function');

const addPLBGrpMaster = async (req, res) => {
    try {
        const {
            PLBGroupName,
            companyId,
            PLBMasterID
        } = req.body;

        if (!companyId || !PLBGroupName || !PLBMasterID) {
            return {
                response: 'All fields are required'
            }
        }
        const checkPLBExist = await PLBGroupMaster.findOne({ companyId: companyId });
        if (checkPLBExist) {
            isDefault = false;
        } else {
            isDefault = true;
        }


        const savePLBGrp = new PLBGroupMaster({
            PLBGroupName,
            companyId,
            isDefault
        });
        const result = await savePLBGrp.save();

        // PLBGroupHasPLBMaster add
        const PLBGroupId = result._id
        PLBMasterID.forEach(async (element) => {
            const PLBMasterId = element.PLBMasterId;
            const addPLBGHasPLBM = new PLBGroupHasPLBMaster({
                PLBGroupId: PLBGroupId,
                PLBMasterId
            });
            const result = await addPLBGHasPLBM.save();
        });

        // Log add 

        const doerId = req.user._id;
        const loginUser = await User.findById(doerId);
        await commonFunction.eventLogFunction(
            'PLBMasterGroup',
            doerId,
            loginUser.fname,
            req.ip,
            companyId,
            'add PLB Master Group'
        );

        return {
            response: 'PLB Group master added successfully'
        }
    } catch (error) {
        throw error
    }
}

const updatePLBGroupMaster = async (req, res) => {
    try {

        const _id = req.params.plbGroupId;
        const { PLBGroupName, PLBMasterID } = req.body;
        if (!PLBGroupName || !PLBMasterID) {
            return {
                response: 'All fields are required'
            }
        }

        const updatePLB = await PLBGroupMaster.findByIdAndUpdate(_id, {
            PLBGroupName
        }, { new: true })


        // Previous PLBGHasPLBMaster delete
        const result = await PLBGroupHasPLBMaster.deleteMany({ PLBGroupId: _id });

        const PLBGroupId = _id;
        PLBMasterID.forEach(async (element) => {
            const PLBMasterId = element.PLBMasterId;
            const addPLBGHasPLBM = new PLBGroupHasPLBMaster({
                PLBGroupId: PLBGroupId,
                PLBMasterId
            });
            const result = await addPLBGHasPLBM.save();
        });

        // Log add 
        const doerId = req.user._id;
        const loginUser = await User.findById(doerId);
        await commonFunction.eventLogFunction(
            'PLBMasterGroup',
            doerId,
            loginUser.fname,
            req.ip,
            loginUser.companyId,
            'updated PLB Master Group'
        );
        return {
            response: 'PLB Group master updated successfully'
        }
    } catch (error) {
        throw error;
    }
}


const removePLBGroup = async (req, res) => {
    try {
        const result = await PLBGroupMaster.deleteOne({ _id: req.params.id });

        const checkIncentiveGroupHasPermissionExist = await PLBGroupHasPLBMaster.findOne({ PLBMasterId: req.params.id });

        if (checkIncentiveGroupHasPermissionExist) {

            await PLBGroupHasPLBMaster.deleteMany({ PLBMasterId: req.params.id });
        }

        // Log add 
        const doerId = req.user._id;
        const loginUser = await User.findById(doerId);

        await commonFunction.eventLogFunction(
            'PLBMasterGroup',
            doerId,
            loginUser.fname,
            req.ip,
            loginUser.companyId,
            'deleted PLB Master Group'
        );
        return {
            response: 'PLB group master deleted Successfully!'
        }

    } catch (error) {
        throw error;
    }
}


const getPLBGroupMasterList = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const result = await PLBGroupMaster.find({ companyId: companyId });
        if (result.length > 0) {
            const allData = await Promise.all(result.map(async (PlbGroup) => {
                const newObj = {
                    "_id": PlbGroup._id,
                    "PLBGroupName": PlbGroup.PLBGroupName,
                    "companyId": PlbGroup.companyId,
                    "isDefault": PlbGroup.isDefault,
                    "createdAt": PlbGroup.createdAt,
                    "updatedAt": PlbGroup.updatedAt,
                    "PlbGroup": []
                };

                const PLBGroupMaster = await PLBGroupHasPLBMaster.find({ PLBGroupId: PlbGroup._id })
                console.log(PLBGroupMaster);
                if (PLBGroupMaster.length > 0) {
                    newObj.PlbGroup.push(...PLBGroupMaster); // Use push with spread operator
                }

                return newObj;
            }));

            return {
                data: allData
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


const getPLBGroupHasPLBMaster = async (req, res) => {
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

const PLBGroupDefineAsDefault = async (req, res) => {
    try {
        const _id = req.params.id;
        const { companyId } = req.body;
        if (!companyId) {
            return {
                response: 'Company Id is required'
            }
        }
        await PLBGroupMaster.updateMany({ companyId }, { isDefault: false });

        const result = await PLBGroupMaster.findByIdAndUpdate(_id, { isDefault: true }, { new: true });
        return {
            response: 'PLB group master define as default'
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
    getPLBGroupHasPLBMaster,
    PLBGroupDefineAsDefault
}