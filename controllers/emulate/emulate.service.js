const UserModule = require('../../models/User');
const CompanyModel = require('../../models/Company');
const RoleModel = require('../../models/Role');
const { Status } = require("../../utils/constants");
const commonFunction = require('../commonFunctions/common.function');

const searchForUserEmulate = async (req, res) => {
    try {
        const { companyId, search , userId } = req.query;

        const getUserId = await UserModule.findOne({_id : userId , roleId: { $exists: true, $ne: null }});
        
        const getRole = await RoleModel.findOne({_id : getUserId.roleId});
       
        //if(getRole.name == 'TMC' || getRole.name == 'Distributer' || getRole.name == 'Supplier') {
            const getCompaniesDetails = await CompanyModel.find({
                parent: getUserId.company_ID,
                $or: [
                    { companyName: new RegExp(search, 'i') }
                ]
            });
            
            let companiesList = [];
            for (let i = 0; i < getCompaniesDetails.length; i++) {
                const companyDetails = getCompaniesDetails[i];
                const populatedCompanyDetails = await UserModule.findOne({ company_ID: companyDetails?._id, userStatus:"Active" });
                
                // Check if populatedCompanyDetails exists before trying to access _id
                if (populatedCompanyDetails) {
                    companiesList.push({_id:populatedCompanyDetails?._id,name:companyDetails?.companyName, userId:populatedCompanyDetails?.userId});                   
                }
                                
            }
            
            const getUserDetails = await UserModule.find({
                company_ID: getUserId.company_ID,
                userStatus:"Active",
                $or: [
                    { fname: new RegExp(search, 'i') },
                    { lastName: new RegExp(search, 'i') }                    
                ]
            });
             
            for (let i = 0; i < getUserDetails.length; i++) {
                const userDetails = getUserDetails[i];
                    companiesList.push({_id:userDetails?._id,name:userDetails?.fname+' '+userDetails?.lastName, userId:userDetails?.userId});                   
            }  
            //console.log(companiesList)   
            
            //const getUserDetails = await UserModule.findOne({ company_ID : getUserId.company_ID });
            
            //  return false
            if (companiesList.length > 0) {
                return {
                    data: companiesList
                };
            } else {
                return {
                    data: []
                };
            }
        //}else{
            // const result = await UserModule.find({
            //     companyId: companyId,
            //     $or: [
            //         { fname: new RegExp(search, 'i') },
            //         { lname: new RegExp(search, 'i') },
            //     ]
            // });
    
            // if (result.length > 0) {
            //     return {
            //         data: result
            //     };
            // } else {
            //     return {
            //         data: []
            //     };
            // }
        //}

    } catch (error) {
        throw error;
    }
};


const authenticate = async (req, res) => {
    try {
        const {userId } = req.body;

            // Check if the user exists for the given user ID and company ID
            const user = await UserModule.findOne({ _id: userId}).populate("roleId");
           
            if (user) {
                
                // Create a token for the user
                const token = await commonFunction.createToken(user._id);

                // Update user details such as IP address and last login date
                const updatedUser = {
                    ip_address: req.ip,
                    last_LoginDate: new Date()
                };

                await UserModule.findOneAndUpdate({ _id: user._id }, updatedUser);
                //console.log("=====>>",user)
                // Prepare user details to be sent in the response
                const userDetails = {
                    _id: user._id,
                    name: `${user.fname} ${user.lastName}`,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    companyId: user.company_ID,
                    roleId: user?.roleId?._id || null,
                    userType: user?.roleId?.name || null,
                    token: token,
                    lastLogInDate : user?.last_LoginDate || null,
                    userId : user?.userId || ""
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

