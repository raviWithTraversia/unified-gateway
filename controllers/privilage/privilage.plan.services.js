const PrivilagePlan = require('../../models/PrivilagePlan');
const Company = require('../../models/Company');
const ProductPlan = require('../../models/ProductPlan');
const privilagePlanHasPermission = require('../../models/PrivilagePlanHasPermission')
const User = require('../../models/User');
const commonFunction = require('../commonFunctions/common.function');
const Eventlogs=require('../logs/EventApiLogsCommon')
const agencyGroup = require("../../models/AgencyGroup");
const addPrivilagePlan = async(req , res) =>{
    try {
        
        const {companyId , privilagePlanName , productPlanId , permission , status , emulate} = req.body;
        if(!companyId || !privilagePlanName || !productPlanId || !permission) {
            return {
                response : 'All field are required'
            }
        }
        // check company id exits or not
        const checkCompanyExist = await Company.findById(companyId);
        if (!checkCompanyExist) {
            return {
                response: "companyId does not exist"
            }
        }
       
        // check product plan id exist or not
        const checkProductPlanExist = await ProductPlan.findById(productPlanId);
        if (!checkProductPlanExist) {
            return {
                response: "product plan Id does not exist"
            }
        }

        // check privilage name already exist behalf of company id
        const checkPrivilagePlanNameExist = await PrivilagePlan.find({ privilagePlanName : privilagePlanName , companyId : companyId});
       
        if (checkPrivilagePlanNameExist.length > 0) {
            return {
                response: 'privilage plan name already exist'
            }
        }

        const addPrivilage = new PrivilagePlan({
            companyId,
            privilagePlanName,
            productPlanId,
            status
        });

        const result = await addPrivilage.save();

        const privilagePlanId = result._id;

        // Add privilagePlanHasPermission
        permission.forEach(async(permission) => {
            const permissionId = permission.permissionId;
            const emulate = permission.emulate;
            const privilagePlanAdd = new privilagePlanHasPermission({
                privilagePlanId,
                permissionId,
                emulate
            });
           const result = await privilagePlanAdd.save();
        });


        // Log add 
        const doerId = req.user._id;
        const loginUser = await User.findById(doerId);
        const LogsData = {
            eventName: "Privilage Plan",
            doerId: doerId,
            doerName: loginUser.fname,
            companyId: companyId,
            documentId: privilagePlanId,
            description: "Privilage plan add"
        };
        
        Eventlogs(LogsData);
        
console.log(privilagePlanId,"shd")
        return {    
            response : 'Privilage plan created successfully'
        }

    } catch (error) {
        throw error
    }
}

const getPrivilageList =async(req ,res) => {
    try {
        const companyId = req.params.comapnyId;
        const result = await PrivilagePlan.find({companyId : companyId}).populate("productPlanId");
        if (result.length > 0) {
            const allData = await Promise.all(result.map(async (privilagePlan) => {
                const newObj = {
                    "_id": privilagePlan._id,
                    "companyId": privilagePlan.companyId,
                    "privilagePlanName" : privilagePlan.privilagePlanName,
                    "productPlanId": privilagePlan.productPlanId,
                    "status" : privilagePlan.status,
                    "IsDefault" : privilagePlan.IsDefault,
                    "createdAt": privilagePlan.createdAt,
                    "updatedAt": privilagePlan.updatedAt,
                    "permission": []
                };

                const PrivilegePHP = await privilagePlanHasPermission.find({ privilagePlanId: privilagePlan._id });
                if (PrivilegePHP.length > 0) {
                    newObj.permission.push(...PrivilegePHP); // Use push with spread operator
                }

                return newObj;
            }));

            return {
                data: allData
            }
        } else {
            return {
                response: 'Privilage Plan Not Found',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

// Get privilage plab by product id
const getPrivilagePlanByProductPlanId =async(req ,res) => {
    try {
        const productPlanId = req.params.productPlanId;
        const result = await PrivilagePlan.find({productPlanId : productPlanId});
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Privilage Plan Not Found',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

// Get privilage plan has product by privilage id
const privilagePHPByPrivilageId =async(req ,res) => {
    try {
        const privilagePlanId = req.params.privilagePlanId;
        const result = await privilagePlanHasPermission.find({privilagePlanId : privilagePlanId});
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Privilage Plan Not Found',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

// privilage Plan update method 

const privilagePlanPatch = async(req , res) => {
    try {
       
        const {companyId ,privilagePlanName , productPlanId , permission , status , emulate} = req.body;
        if(!companyId || !privilagePlanName || !productPlanId || !permission) {
            return {
                response : 'All field are required'
            }
        }

         // check company id exits or not
         const checkCompanyExist = await Company.findById(companyId);
         if (!checkCompanyExist) {
             return {
                 response: "companyId does not exist"
             }
         }
       
        // check product plan id exist or not
        const checkProductPlanExist = await ProductPlan.findById(productPlanId);
        if (!checkProductPlanExist) {
            return {
                response: "product plan Id does not exist"
            }
        }

        const _id = req.params.privilagePlanId;
        const privilagePlanId = req.params.privilagePlanId;
        // check privilage name already exist behalf of company id
        console.log(_id)
        const checkPrivilagePlanNameExist = await PrivilagePlan.findOne({ _id : _id});
        let data = await PrivilagePlan.findById(_id)
        console.log(data)
        const updatePrivilage =  await PrivilagePlan.findByIdAndUpdate(_id, {
            privilagePlanName : privilagePlanName,
            productPlanId : productPlanId,
            status,
        }, { new: true })
        // privious plan has permission deleted.
        const result = await privilagePlanHasPermission.deleteMany({ privilagePlanId: _id });

        // Add privilagePlanHasPermission
        permission.forEach(async(permission) => {
            const permissionId = permission.permissionId;
            const emulate = permission.emulate;
            const privilagePlanAdd = new privilagePlanHasPermission({
                privilagePlanId,
                permissionId,
                emulate
            });
           const result = await privilagePlanAdd.save();
        });

        const doerId = req.user._id;
        const loginUser = await User.findById(doerId);

        const LogsData = {
            eventName: "Privilage Plan",
            doerId: doerId,
            doerName: loginUser.fname,
            companyId: companyId,
            documentId: updatePrivilage._id,
            description: "Privilage plan Edit"
        };
        
        Eventlogs(LogsData);
        return {    
            response : 'Privilage plan updated successfully'
        }

    } catch (error) {
        console.log(error)
        throw error
    }
}


const privilagePlanAssignIsDefault = async(req ,res) => {
    try {
        const {companyId} = req.body;
        const _id = req.params.privilagePlanId;

         await PrivilagePlan.updateMany({ companyId }, { IsDefault: false });
         await agencyGroup.findOneAndUpdate(
            { companyId: companyId, isDefault: true },
            { privilagePlanId: _id },
            { new: true }
          );
        const result = await PrivilagePlan.findByIdAndUpdate( _id , {IsDefault : true }, { new: true });

        return {
            response : 'Privilage plan define as IsDefault updated successfully'
        }
    } catch (error) {
        throw error
    }
}


module.exports = {
    addPrivilagePlan , 
    getPrivilageList , 
    getPrivilagePlanByProductPlanId ,
    privilagePHPByPrivilageId,
    privilagePlanPatch,
    privilagePlanAssignIsDefault
}