const ProductPlan = require('../../models/ProductPlan');
const Company = require('../../models/Company');
const ProductHasPP = require('../../models/ProductPlanHasProduct');
const User = require('../../models/User');
const commonFunction = require('../commonFunctions/common.function');
const ProductPlanHasProduct = require('../../models/ProductPlanHasProduct');
const { object } = require('joi');
const { default: mongoose } = require('mongoose');
const EventLogs=require('../logs/EventApiLogsCommon')
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
            const productPlanId = PlanHasId;
            const ProductHPP = new ProductHasPP({
                productPlanId,
                productId
            });
           const result = await ProductHPP.save();
        });

        // Log
        const doerId = req.user._id;
        const loginUser = await User.findById(doerId);

        const LogsData = {
            eventName: "ProductPlan",
            doerId: doerId,
            doerName: loginUser.fname,
            companyId: companyId,
            documentId: result._id,
            description: "ProductPlan add"
        };
        
        EventLogs(LogsData);
        return {
            response: 'Product plan addedd successfully'
        }

    } catch (error) {
        throw error;
    }
}

const getAllProductPlan = async (req, res) => {
    try {
        const { companyId } = req.params;

        const result = await ProductPlan.find({companyId : companyId});
        
        if (result.length > 0) {
            const allData = await Promise.all(result.map(async (productPlan) => {
                const newObj = {
                    "_id": productPlan._id,
                    "productPlanName": productPlan.productPlanName,
                    "companyId": productPlan.companyId,
                    "status": productPlan.status,
                    "createdAt": productPlan.createdAt,
                    "updatedAt": productPlan.updatedAt,
                    "product": []
                };

                const ProductPlanHasP = await ProductPlanHasProduct.find({ productPlanId: productPlan._id }).populate('productId');
                if (ProductPlanHasP.length > 0) {
                    newObj.product.push(...ProductPlanHasP); // Use push with spread operator
                }

                return newObj;
            }));


            return {
                response : 'Product Plan Fetch Sucessfull',
                data: allData
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
        const producPlanId = req.params.producPlanId;

        const {productPlanName , product, status} = req.body;
        if (!productPlanName) {
            return {
                response: 'product plan name fields are required'
            }
        }
        // Check product exist or Not
      
        const checkProduct = await ProductPlan.findOne({ _id: producPlanId });
       
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
        let _id = producPlanId;

        const updateProduct = await ProductPlan.findByIdAndUpdate(_id, {productPlanName , status}, { new: true })

        // delete already exists productPlanHasProduct
        const result = await ProductHasPP.deleteMany({ productPlanId: producPlanId });
         // update productPlanHasProduct
         
            product.forEach(async(product) => {
                const productId = product.productId;
                const productPlanId = producPlanId;
                const ProductHPP = new ProductHasPP({
                    productPlanId,
                    productId
                });
               const result = await ProductHPP.save();
            });
         

            // Log
            const doerId = req.user._id;
            const loginUser = await User.findById(doerId);
    
            const LogsData = {
                eventName: "ProductPlan",
                doerId: doerId,
                doerName: loginUser.fname,
                companyId: companyId,
                documentId: producPlanId,
                description: "ProductPlan Edit"
            };
            
            EventLogs(LogsData);
        return {
            response: "Product plan updated successfully"
        }

    } catch (error) {
        throw error;
    }
}


const getAllProductPlanDetail = async (req, res) => {
    try {
        const { companyId } = req.params;

        const result = await ProductPlan.find({ companyId: companyId });

        if (result.length > 0) {
            const allData = await Promise.all(result.map(async (productPlan) => {
                const newObj = {
                    "_id": productPlan._id,
                    "productPlanName": productPlan.productPlanName,
                    "companyId": productPlan.companyId,
                    "status": productPlan.status,
                    "createdAt": productPlan.createdAt,
                    "updatedAt": productPlan.updatedAt,
                    "product": []
                };

                const ProductPlanHasP = await ProductPlanHasProduct.find({ productPlanId: productPlan._id }).populate('productId');
                if (ProductPlanHasP.length > 0) {
                    newObj.product.push(...ProductPlanHasP); // Use push with spread operator
                }

                return newObj;
            }));

            return {
                response: 'Product Plan Fetch Successfully',
                data: allData
            };
        } else {
            return {
                response: 'Product Plan Not Found',
                data: null
            };
        }
    } catch (error) {
        throw error;
    }
};

module.exports = { 
    addProductPlan, 
    getAllProductPlan, 
    productPlanUpdateById,
    getAllProductPlanDetail
}