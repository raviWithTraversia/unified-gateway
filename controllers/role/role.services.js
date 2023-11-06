const role = require("../../models/Role");
const FUNC = require("../../controllers/commonFunctions/common.function");
const company = require("../../models/Company");

const createRoles = async (req, res) => {
  try {
    const { name, companyId, type } = req.body;
    let isValidcCmpanyId = FUNC.checkIsValidId(companyId);
    if (!isValidcCmpanyId) {
      return {
        response: "companyId is not valid",
      };
    }
    const roleExist = await role.findOne({ name: name
        , companyId:companyId, type:type });
    if (!roleExist) {
      const addRole = new role({
        name,
        companyId,
        type,
      });
      await addRole.save();
      return {
        response: "New Role Created Sucessfully",
        data: addRole,
      };
    } else {
      return {
        response: "This role name is already exixt",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findRoles = async (req, res) => {
  try {
    const companyId  = req.params.companyId;
    let isValidcCmpanyId = FUNC.checkIsValidId(companyId);
    if (!isValidcCmpanyId) {
      return {
        response: "companyId is not valid",
      };
    }
    let findAllRole = await role.find({companyId:companyId});
    if (findAllRole.length) {
      return {
        response: "Role Fetch sucessfully",
        data: findAllRole,
      };
    } else {
      return {
        response: "No role exist for this company",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  createRoles,
  findRoles,
};
