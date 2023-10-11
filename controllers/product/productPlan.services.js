const ProductPlan = require('../../models/ProductPlan');
const Company = require('../../models/Company');

const addProductPlan = async (req, res) => {
    try {
        const { productPlanName, companyId } = req.body;

        // Check company id exist or not
        const checkCompanyIdExist = await Company.find({ _id: companyId });

        if (checkCompanyIdExist.length === 0) {
            return {
                response: 'Compnay id does not exist'
            }
        }

        const addNewProductPlan = new ProductPlan({
            productPlanName,
            companyId
        });

        // save product plan
        const result = addNewProductPlan.save();
        return {
            response: 'Product plan addedd successfully'
        }

    } catch (error) {
        throw error;
    }
}

const getAllProductPlan = async (req, res) => {
    try {

        const result = await ProductPlan.find();
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Product Plan Not Found',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }

}


const productPlanUpdateById = async (req, res) => {
    try {
        const productPlanName = req.body
        if (!productPlanName) {
            return {
                response: 'product plan name fields are required'
            }
        }
        // Check product exist or Not
        const producPlantId = req.params.producPlantId;
        const checkProduct = await ProductPlan.find({ _id: producPlantId });
       
        if (!checkProduct) {
            return {
                response: "Product plan id not found"
            }
        }
   
        const updateProduct = await ProductPlan.findByIdAndUpdate(producPlantId, productPlanName, { new: true })

        return {
            response: "Product plan updated successfully"
        }

    } catch (error) {
        throw error;
    }
}

module.exports = { addProductPlan, getAllProductPlan , productPlanUpdateById}