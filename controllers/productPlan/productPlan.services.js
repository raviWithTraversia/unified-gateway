const ProductPlan = require('../../models/ProductPlan');
const Company = require('../../models/Company');
const ProductHasPP = require('../../models/ProductPlanHasProduct');
const User = require('../../models/User');
const commonFunction = require('../commonFunctions/common.function');

const addProductPlan = async (req, res) => {
    try {
        const { productPlanName, companyId , status, product} = req.body;
        
        // Check company id exist or not
        const checkCompanyIdExist = await Company.find({ _id: companyId });

        if (checkCompanyIdExist.length === 0) {
            return {
                response: 'Compnay id does not exist'
            }
        }

        // check ProductPlan Name exist for particular company or not
        const checkProductPlanNameExist = await ProductPlan.find({ productPlanName : productPlanName , companyId : companyId});

        if (checkProductPlanNameExist.length > 0) {
            return {
                response: 'Product plan name already exist'
            }
        }
        const addNewProductPlan = new ProductPlan({
            productPlanName,
            companyId,
            status
        });

        // save product plan
        const result = await addNewProductPlan.save();
        const PlanHasId = result._id;

        // Add productPlanHasProduct
        product.forEach(async(product) => {
            const productId = product.productId;
            const productPlaneId = PlanHasId;
            const ProductHPP = new ProductHasPP({
                productPlaneId,
                productId
            });
           const result = await ProductHPP.save();
        });

        // Log
        const doerId = req.user._id;
        const loginUser = await User.findById(doerId);

        await commonFunction.eventLogFunction(
            'productPlan' ,
            doerId ,
            loginUser.fname ,
            req.ip , 
            companyId , 
            'add product plan'
        );
        return {
            response: 'Product plan addedd successfully'
        }

    } catch (error) {
        throw error;
    }
}

const getAllProductPlan = async (req, res) => {
    try {
        const { companyId } = req.query;

        const result = await ProductPlan.find({companyId : companyId});
       // console.log(result,"result")
        if (result.length > 0) {
            return {
                response : 'Product Plan Fetch Sucessfull',
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
        const {productPlanName , product} = req.body
        if (!productPlanName) {
            return {
                response: 'product plan name fields are required'
            }
        }
        // Check product exist or Not
        const producPlantId = req.params.producPlantId;
        const checkProduct = await ProductPlan.findOne({ _id: producPlantId });
       
        if (!checkProduct) {
            return {
                response: "Product plan id not found"
            }
        }
      
        // check ProductPlan Name exist for particular company or not
        if (productPlanName != checkProduct.productPlanName) {

            const comId = checkProduct.companyId;
            const checkProductPlanNameExist = await ProductPlan.find({ productPlanName : productPlanName , companyId : comId});
            if(checkProductPlanNameExist.length > 0) {
                return {
                    response: 'Product plan name already exist'
                }
            } 
        }
   
        const updateProduct = await ProductPlan.findByIdAndUpdate(producPlantId, productPlanName, { new: true })

        // delete already exists productPlanHasProduct
        const result = await ProductHasPP.deleteMany({ productPlaneId: producPlantId });
         // update productPlanHasProduct
         
            product.forEach(async(product) => {
                const productId = product.productId;
                const productPlaneId = producPlantId;
                const ProductHPP = new ProductHasPP({
                    productPlaneId,
                    productId
                });
               const result = await ProductHPP.save();
            });
         

            // Log
            const doerId = req.user._id;
            const loginUser = await User.findById(doerId);
    
            await commonFunction.eventLogFunction(
                'productPlan' ,
                doerId ,
                loginUser.fname ,
                req.ip , 
                loginUser.company_ID , 
                'update product plan'
            );

        return {
            response: "Product plan updated successfully"
        }

    } catch (error) {
        throw error;
    }
}

module.exports = { addProductPlan, getAllProductPlan , productPlanUpdateById}