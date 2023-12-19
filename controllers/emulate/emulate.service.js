const UserModule = require('../../models/User');
const commonFunction = require('../commonFunctions/common.function');

const searchForUserEmulate = async (req, res) => {
    try {
        const { companyId, search } = req.query;
        
        const result = await UserModule.find({
            company_ID: companyId,
            $or: [
                { fname: new RegExp(search, 'i') },
                { lastName: new RegExp(search, 'i') }
            ]
        });

        if (result.length > 0) {
            return {
                data: result
            };
        } else {
            return {
                response: 'User not available',
                data: null
            };
        }
    } catch (error) {
        throw error;
    }
};


module.exports = {
    searchForUserEmulate
}

