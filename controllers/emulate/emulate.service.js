const UserModule = require('../../models/User');
const CompanyModel = require('../../models/Company');
const { Status } = require("../../utils/constants");
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
                data: []
            };
        }
    } catch (error) {
        throw error;
    }
};


const authenticate = async (req, res) => {
    try {
        const { parentId, companyId, userId } = req.body;

        // Check if all required fields are present
        if (!parentId || !companyId || !userId) {
            return {
                response: 'All fields are required'
            };
        }

        // Check if the parent company exists
        const checkParentCompanyExist = await CompanyModel.findOne({ _id: parentId });

        if (checkParentCompanyExist) {
            // Check if the user exists for the given user ID and company ID
            const user = await UserModule.findOne({ _id: userId, company_ID: companyId });
           
            if (user) {
                
                // Create a token for the user
                const token = await commonFunction.createToken(user._id);

                // Update user details such as IP address and last login date
                const updatedUser = {
                    ip_address: req.ip,
                    last_LoginDate: new Date()
                };

                await UserModule.findOneAndUpdate({ _id: user._id }, updatedUser);

                // Prepare user details to be sent in the response
                const userDetails = {
                    _id: user._id,
                    name: `${user.fname} ${user.lastName}`,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    companyId: user.company_ID,
                    roleId: user?.roleId || null,
                    token: token,
                };

                return {
                    response: "Login successful",
                    data: userDetails,
                };
            } else {
                return {
                    response: "User not exist",
                };
            }
        } else {
            return {
                response: "Company not exist",
            };
        }

    } catch (error) {
        return {
            response: "An error occurred during authentication",
        };
    }
};



module.exports = {
    searchForUserEmulate,
    authenticate
}

