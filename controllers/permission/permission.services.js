const Permission = require('../../models/Permission');

const getAllPermission = async(req , res) => {
    try {
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
        const { productName , categoryName , permissionName , permissionDescription } = req.body;
       
        const savePermission = new Permission({
            productName,
            categoryName,
            permissionName,
            permissionDescription
        });
        const productSave = await savePermission.save();
        if(productSave) {
            return {
                response: 'Permission added successfully'
            }
        }else{
            return {
                response: 'Something went wrong try again later'
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