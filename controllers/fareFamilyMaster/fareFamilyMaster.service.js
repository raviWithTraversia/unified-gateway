const FareFamilyMaster = require('../../models/FareFamilyMaster');

// Get fare family master list

const getFareFamilyMaster = async(req , res) => {
    try {
        const result = await FareFamilyMaster.find({});
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Fare Family not available',
                data: null
            }
        }
        
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getFareFamilyMaster
}