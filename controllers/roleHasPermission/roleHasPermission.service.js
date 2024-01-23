const RoleHasPermission = require('../../models/RoleHasPermissions');
const Role = require('../../models/Role');

const storeRoleHasPermission = async(req , res) => {
    try {
        const {roleId , permission , emulate} = req.body;
        if(!roleId || !permission) {
            return {
                response : 'All field are required'
            }
        }

        const checkRoleIdExists = await Role.find({_id : roleId});
        if(checkRoleIdExists.length === 0) {
            return {
                response : 'Role ID not exist'
            }
        }
        
        permission.forEach(async(element) => {
            const CheckExist = RoleHasPermission.findOne({roleId : roleId , permissionId : element.permissionId});
            const emulate = element.emulate;
            if(!CheckExist) {
                const addRoleHasPermission = new RoleHasPermission({
                    roleId,
                    permissionId : element.permissionId,
                    emulate
                });
    
                const result = await addRoleHasPermission.save();
            }
        });

        return {
            permission : 'Role has permission created successfully'
        }
        

    } catch (error) {
        throw error;
    }
}


// Role has permission get

const getRoleHasPermission = async(req ,res) => {
    try {
        
        const roleId = req.params.roleId;
        const result = await RoleHasPermission.find({roleId : roleId}).populate('permissionId', 'productName categoryName permissionName permissionDescription');
   
        if (result.length > 0) {
            return {
                response : "Data Fetch Sucessfully",
                data: result
            }
        } else {
            return {
                response: 'Role has permission Not Found',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

// update roleHasPermission
const updateRoleHasPermission = async(req ,res) => {
    try {
        const {roleId , permission , emulate} = req.body;
        if(!roleId || !permission) {
            return {
                response : 'All field are required'
            }
        }
        const checkRoleIdExists = await Role.find({_id : roleId});
        if(checkRoleIdExists.length === 0) {
            return {
                response : 'Role ID not exist'
            }
        }
        const result = await RoleHasPermission.deleteMany({ roleId: roleId });
        
        permission.forEach(async(element) => {
            const emulate = element.emulate;
            const addRoleHasPermission = new RoleHasPermission({
                roleId,
                permissionId : element.permissionId,
                emulate
            });

            const result = await addRoleHasPermission.save();
        });

        return {
            permission : 'Role has permission updated successfully'
        }
        
    } catch (error) {
        throw error;
    }
}

module.exports = {
    storeRoleHasPermission,
    getRoleHasPermission,
    updateRoleHasPermission
}