const State = require('../../models/State');

const getStateByCountry = async(req , res) => {
    try {
        const countryId = req.params.countryId;
        const result = await State.find({countryId : countryId});
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'State not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

module.exports = {getStateByCountry}