const AirLineCode = require('../../models/AirlineCode');

const getAllAirLineCode = async(req , res) => {
    try {
        const result = await AirLineCode.find({});
        if (result.length > 0) {
            return {
                response: 'AirLine code fetch successfully',
                data: result
            }
        } else {
            return {
                response: 'AirLine code not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

module.exports = {getAllAirLineCode}