const Country = require('../../models/Country');

const getAllCountry = async(req , res) => {
    try {
        const result = await Country.find();
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Country not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

module.exports = {getAllCountry}