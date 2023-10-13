const CreditRequest = require('../../models/CreditRequest');
const Company = require('../../models/Company');
const User = require('../../models/User');


const addCreditRequest = async(req , res) => {
    try {
        const {companyId,
            date,
            duration,
            purpose,
            amount,
            utilizeAmount,
            remarks,
            expireDate,
            createdDate,
            createdBy,
            requestedAmount 
        } = req.body;

        if(!companyId || !date || !duration || !purpose || !amount || !utilizeAmount || !remarks || !expireDate || !createdDate || !createdBy || !requestedAmount) {
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

        // Check created BY id exist or not
        const checkUserIdExist = await User.findById(createdBy);
        if(!checkUserIdExist) {
            return {
                response : 'createdBy id does not exist'
            }
        }
        const saveResult = new CreditRequest({
            companyId,
            date,
            duration,
            purpose,
            amount,
            utilizeAmount,
            remarks,
            expireDate,
            createdDate,
            createdBy,
            requestedAmount 
        })
        
        const result = await saveResult.save();

        return {
            response : 'Credit request created successfully'
        }


    } catch (error) {
        throw error;
    }
}

const getAllCreditList = async(req , res) => {
    try {
       
        const result = await CreditRequest.find();
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Credit request not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

const getCredirRequestByCompanyId = async(req , res) => {
    try {
        const CompanyId = req.params.companyId;
        const result = await CreditRequest.find({companyId : CompanyId});
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Credit request not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

module.exports = {addCreditRequest , getAllCreditList , getCredirRequestByCompanyId}