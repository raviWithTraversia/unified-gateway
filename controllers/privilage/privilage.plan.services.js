const PrivilagePlan = require('../../models/PrivilagePlan');
const Company = require('../../models/Company');
const ProductPlan = require('../../models/ProductPlan');
const privilagePlanHasPermission = require('../../models/PrivilagePlanHasPermission')

const addPrivilagePlan = async(req , res) =>{
    try {
        
        const {companyId , privilagePlanName , productPlanId , permission} = req.body;
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
            productPlanId
        });

        const result = await addPrivilage.save();

        const privilagePlanId = result._id;

        // Add privilagePlanHasPermission
        permission.forEach(async(permission) => {
            const permissionId = permission.permissionId;
            const privilagePlanAdd = new privilagePlanHasPermission({
                privilagePlanId,
                permissionId
            });
           const result = await privilagePlanAdd.save();
        });

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
        const result = await PrivilagePlan.find({companyId : companyId});
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

// 
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

module.exports = {addPrivilagePlan , getPrivilageList , getPrivilagePlanByProductPlanId}