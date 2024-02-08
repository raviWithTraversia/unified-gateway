const Country = require('../../models/Country');

const getAllCountry = async(req , res) => {
    try {
        const result = await Country.find();
        result.sort((a, b) => {
            const countryA = a.country.toUpperCase(); 
            const countryB = b.country.toUpperCase();
        
            if (countryA < countryB) {
                return -1; 
            } else if (countryA > countryB) {
                return 1; 
            } else {
                return 0;
            }
        });
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