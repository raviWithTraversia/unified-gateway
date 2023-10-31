const City = require('../../models/City');

const getCityByState = async(req , res) => {
    try {
        const stateId = req.params.stateId;
        const result = await City.find({ stateId: stateId });

        // console.log(result);
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'City not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

module.exports = {getCityByState}