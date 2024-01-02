const Permission = require('../../models/Permission');
const Role = require('../../models/Role');
const addRoleHasPermission = require('../../models/RoleHasPermissions');
const User = require('../../models/User');

const getAllPermission = async(req , res) => {
    try {
        const userId = req.user;
        const checkUser = await User.findById(userId);
        
        
        const result = await Permission.find();
        
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Permission not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}


const storePermission = async(req ,res) => {
    try {
        const { productName , categoryName , permissionName , permissionDescription , emulate} = req.body;
       
        const CheckPermissionName = await Permission.findOne({permissionName : permissionName});
        
        if(!CheckPermissionName){
            const savePermission = new Permission({
                productName,
                categoryName,
                permissionName,
                permissionDescription,
                emulate
            });
            const permissionSave = await savePermission.save();

            const findTmc = await Role.findOne({name : 'TMC'});
            
            if(findTmc) {
                const addRoleHasPermissionAdd = new addRoleHasPermission({
                    roleId : findTmc._id,
                    permissionId : permissionSave._id
                });
    
                const result = await addRoleHasPermissionAdd.save();
            }

            if(permissionSave) {
                return {
                    response: 'Permission added successfully'
                }
            }else{
                return {
                    response: 'Something went wrong try again later'
                }
            }
        }else{
            return {
                response: 'Permission name already exist'
            }
        }

        
       

    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllPermission,
    storePermission
}