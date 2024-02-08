const FareFamilyMaster = require('../../models/FareFamilyMaster');

const getFareFamilyMaster = async(req , res) => {
    try {
        const companyId = req.params.companyId;
        const result = await FareFamilyMaster.find({companyId : companyId});
        if (result.length > 0) {
            return {
                response: 'Fare Family available',
                data: result
            }
        } else {
            return {
                response: 'Fare Family not available',
                data: []
            }
        }
        
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getFareFamilyMaster
}