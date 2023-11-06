const AirLineCode = require('../../models/AirlineCode');

const getAirLineCodeList = async(req , res) => {

    try {
        const result = await AirLineCode.find({});
        if(result.length > 0) {
            return {
                data: result
            }
        }else{
            return {
                response: 'Carrier not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAirLineCodeList
}