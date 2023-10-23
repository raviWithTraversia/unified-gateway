const ProductPlanServices = require('./productPlan.services');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

// hjghjjjgj
// product plan store 
const addProductPlan = async (req, res) => {

    try {
        const result = await ProductPlanServices.addProductPlan(req);
        if (result.response == 'Compnay id does not exist') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        } else {
            apiSucessRes(
                res,
                CrudMessage.PRODUCT_PLAN_CREATED,
                result.response,
                ServerStatusCode.SUCESS_CODE
            )
        }

    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message, data: null });
    }
}

const retriveProductPlan = async(req ,res) => {
    try {
        const result = await ProductPlanServices.getAllProductPlan(req);
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true)
    }
}

const updateProductPlan = async (req, res) => {
    try {
        const result = await ProductPlanServices.productPlanUpdateById(req);
        if(result.response == 'product plan name fields are required' || result.response == 'Product plan id not found') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            apiSucessRes(
                res,
                CrudMessage.PRODUCT_PLAN_UPDATED,
                result.response,
                ServerStatusCode.SUCESS_CODE
            )
        }
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true)
    }
}

module.exports = { addProductPlan , retriveProductPlan , updateProductPlan}