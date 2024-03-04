const Permission = require("../../models/Permission");
const Role = require("../../models/Role");
const addRoleHasPermission = require("../../models/RoleHasPermissions");
const privilageplanhaspermissions = require("../../models/PrivilagePlanHasPermission");
const User = require("../../models/User");
const agentConfig = require("../../models/AgentConfig");
const agencyGroup = require("../../models/AgencyGroup");

const getAllPermission = async (req, res) => {
  try {
  //  console.log(req.user)
    const userId = req.user;
    const checkUser = await User.findById(userId);
    if (checkUser) {
      const getRoleId = await Role.findById(checkUser.roleId);
      
      if (getRoleId.name === "TMC") {
        const result = await Permission.find();
        if (result.length > 0) {
          return {
            data: result,
          };
        } else {
          return {
            response: "Permission not available",
            data: null,
          };
        }
      } else if (getRoleId.name === "Agency" || getRoleId.name === "Distributer") {       
        let getAgentConfig = await agentConfig.findOne({
          companyId: checkUser.company_ID,
        });         
        if (!getAgentConfig || getAgentConfig.privilegePlansIds === null) {
          getAgentConfig = await agencyGroup.findById(
            getAgentConfig.agencyGroupId
          );         
          if (getAgentConfig) { 
            
            let privilageplanhaspermissionsvar = await privilageplanhaspermissions.find({privilagePlanId:getAgentConfig.privilagePlanId}).populate('permissionId'); 
              
            if(privilageplanhaspermissionsvar.length > 0){
                let allPermissionAssign = privilageplanhaspermissionsvar.map(item => ({
                    emulate: item.emulate,
                    _id: item.permissionId._id,
                    productName: item.permissionId.productName,
                    categoryName: item.permissionId.categoryName,
                    permissionName: item.permissionId.permissionName,
                    permissionDescription: item.permissionId.permissionDescription,
                    createdAt: item.permissionId.createdAt,
                    updatedAt: item.permissionId.updatedAt,
                    __v: item.permissionId.__v,
                  }));
                return {
                    data: allPermissionAssign,
                  };
            }else{
                return {
                    data: "Permission not available",
                  };
            }
           
          }
        } else { // check Manuwal from cinfig
            let privilageplanhaspermissionsvar = await privilageplanhaspermissions.find({privilagePlanId:getAgentConfig.privilegePlansIds}).populate('permissionId');
            if(privilageplanhaspermissionsvar.length > 0){
                let allPermissionAssign = privilageplanhaspermissionsvar.map(item => ({
                    emulate: item.emulate,
                    _id: item.permissionId._id,
                    productName: item.permissionId.productName,
                    categoryName: item.permissionId.categoryName,
                    permissionName: item.permissionId.permissionName,
                    permissionDescription: item.permissionId.permissionDescription,
                    createdAt: item.permissionId.createdAt,
                    updatedAt: item.permissionId.updatedAt,
                    __v: item.permissionId.__v,
                  }));
                return {
                    data: allPermissionAssign,
                  };
            }else{
                return {
                    data: "Permission not available",
                  };
            }         
        }
      } else {
        let addRoleHasPermissionVar = await addRoleHasPermission.find({roleId:checkUser.roleId}).populate('permissionId'); 
        
        if(addRoleHasPermissionVar.length > 0){
            let allPermissionAssign = addRoleHasPermissionVar.map(item => ({
                emulate: item.emulate,
                _id: item.permissionId._id,
                productName: item.permissionId.productName,
                categoryName: item.permissionId.categoryName,
                permissionName: item.permissionId.permissionName,
                permissionDescription: item.permissionId.permissionDescription,
                createdAt: item.permissionId.createdAt,
                updatedAt: item.permissionId.updatedAt,
                __v: item.permissionId.__v,
              }));
            return {
                data: allPermissionAssign,
              };
        }else{
            return {
                data: "Permission not available",
              };
        }  
        // user previllage plan 
      }
    } else {
      return {
        response: "Permission not available",
        data: null,
      };
    }
  } catch (error) {
    throw error;
  }
};
const storePermission = async (req, res) => {
  try {
    const {
      productName,
      categoryName,
      permissionName,
      permissionDescription,
      emulate,
      allow
    } = req.body;

    const CheckPermissionName = await Permission.findOne({
      permissionName: permissionName,
    });

    if (!CheckPermissionName) {
      const savePermission = new Permission({
        productName,
        categoryName,
        permissionName,
        permissionDescription,
        emulate,
        allow
      });
      const permissionSave = await savePermission.save();

      const findTmc = await Role.findOne({ name: "TMC" });

      if (findTmc) {
        const addRoleHasPermissionAdd = new addRoleHasPermission({
          roleId: findTmc._id,
          permissionId: permissionSave._id,
        });

        const result = await addRoleHasPermissionAdd.save();
      }

      if (permissionSave) {
        return {
          response: "Permission added successfully",
        };
      } else {
        return {
          response: "Something went wrong try again later",
        };
      }
    } else {
      return {
        response: "Permission name already exist",
      };
    }
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getAllPermission,
  storePermission,
};
