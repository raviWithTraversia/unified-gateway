const pgCharges = require("../../models/pgCharges");
const Role = require ('../../models/Role');
const User = require('../../models/User')

const payu = async (req, res) => {
    try {
        const {
            companyId,
            agencyId
        } = req.body;

        if(!companyId || !agencyId) {
            return {
                response : 'All field are required'
            }
        }
        
        // check companyId exist or not
        const checkExistCompany = await Company.findById(companyId);
        if(!checkExistCompany) {
            return {
                response : 'companyId does not exist'
            }
        } 
       
        return {
            response : 'companyId does not exist'
        }
        
        
        
       
    } catch (error) {
        throw error;
    }
};

module.exports = {
    payu
};
