const ProductService = require('./product.services');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');


// Save product name 
const storeProduct = async (req, res) => {

    try {
        const result = await ProductService.addProduct(req);
        apiSucessRes(
            res,
            CrudMessage.PRODUCT_CREATED,
            result.response,
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

// Get All product
const getProduct = async (req, res) => {
    try {
        const result = await ProductService.allProductList(req);
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

// update Product
const updateProduct = async (req, res) => {
    try {
        const result = await ProductService.productUpdateById(req);
        if(result.response == 'product Name fields are required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            apiSucessRes(
                res,
                CrudMessage.PRODUCT_UPDATE,
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


// Product Delete By Id
const deleteProduct = async (req, res) => {
    try {
        const result = await ProductService.removeProduct(req);
        if(result.response == 'ProductId not exist!') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true) 
        }else {
            apiSucessRes(
                res,
                CrudMessage.PRODUCT_DELETE,
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

module.exports = { storeProduct, getProduct, updateProduct, deleteProduct }
