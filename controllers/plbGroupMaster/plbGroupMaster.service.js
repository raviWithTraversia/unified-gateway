const PLBGroupMaster = require('../../models/PLBGroupMaster');
const PLBMaster = require('../../models/PLBMaster');
const PLBGroupHasPLBMaster = require('../../models/PLBGroupHasPLBMaster');

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
        const result = savePLBGrp.save();
        // PLBGroupHasPLBMaster add

        PLBMasterID.forEach(async(element) => {
            const PLBMasterId = element.PLBMasterId;
            const addPLBGHasPLBM = new PLBGroupHasPLBMaster({
                PLBGroupId : result._id,
                PLBMasterId
            });
           const result = await addPLBGHasPLBM.save();
        });

        return {
            response : 'PLB Group master added successfully'
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    addPLBGrpMaster
}