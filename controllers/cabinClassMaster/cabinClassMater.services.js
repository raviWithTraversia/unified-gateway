const CabinClassMater = require('../../models/CabinClassMaster');

const getAllCabinClass = async(req , res) => {
    try {
        const result = await CabinClassMater.find();
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Cabin Class not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

module.exports = {getAllCabinClass}