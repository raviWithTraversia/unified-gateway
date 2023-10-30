const Permission = require('../../models/Permission');

const getAllPermission = async(req , res) => {
    try {
        const result = await Permission.find();
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Permission not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

module.exports = {getAllPermission}