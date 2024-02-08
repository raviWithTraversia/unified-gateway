const City = require('../../models/City');

const getCityByState = async(req , res) => {
    try {
        const stateId = req.params.stateId;
        const result = await City.find({ stateId: stateId });
        result.sort((a, b) => {
            const cityA = a.name.toUpperCase(); 
            const cityB = b.name.toUpperCase();
        
            if (cityA < cityB) {
                return -1; 
            } else if (cityA > cityB) {
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
                response: 'State not available',
                data: null
            }
        }

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