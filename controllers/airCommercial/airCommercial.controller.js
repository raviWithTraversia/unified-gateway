const airCommericalService = require('./airCommercial.service');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');

const storeAirCommercial = async(req , res) => {
    try {
        const result = await airCommericalService.addAirCommercial(req);
        if(result.response == 'Commercial air plan Id field are required' || 
            result.response == 'Travel Type field are required' ||
            result.response == 'Carrier field are required' || 
            result.response == 'Supplier field are required' || 
            result.response == 'Priority field are required'
            ) {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            apiSucessRes(
                res,
                CrudMessage.AIR_COMMERCIAL_ADD,
                result.response,
                ServerStatusCode.SUCESS_CODE
            )  
        }
        
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
}

const getColoumnData = async(req , res) => {
    try {
        const result = await airCommericalService.getColoumnDetail(req);
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
            true
        )
    }
}


const getRowData = async(req , res) => {
    try {
        const result = await airCommericalService.getRowDetail(req);
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
            true
        )
    }
}

const commercialTypeAdd = async(req ,res) => {
    try {
        const result = await airCommericalService.addCommercialType(req);
        if(result.response == 'All fields are required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            apiSucessRes(
                res,
                CrudMessage.AIR_COMMERCIAL_ADD,
                result.response,
                ServerStatusCode.SUCESS_CODE
            )  
        }
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
}

const commercialDetailList = async(req , res) => {
    try {
        const result = await airCommericalService.getCommercialDetailList(req);
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
            true
        )
    }
}

const addRowColoumn = async(req ,res) => {
    try {
        const result = await airCommericalService.commercialRowColoumnAdd(req);
        if(result.response == 'Commercial air plan Id field are required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            apiSucessRes(
                res,
                CrudMessage.AIR_COMMERCIAL_ADD,
                result.response,
                ServerStatusCode.SUCESS_CODE
            )  
        }
        
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
}


const updateMatrix = async(req ,res) => {
    try {
        
        const result = await airCommericalService.UpdateMatrixData(req);
        if(result.response == 'All field are required' || result.response == 'Something went wrong!!') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            apiSucessRes(
                res,
                CrudMessage.MATRIX_UPDATE,
                result.response,
                ServerStatusCode.SUCESS_CODE
            )  
        }
        
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
}

// 

const getAirCommercialListByCommercialId = async(req , res) => {
    try {
        try {
            const result = await airCommericalService.getAirCommercialListByAirComId(req);
            if(result.response == 'Commercial not available') {
                apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
            }
            else {
                apiSucessRes(
                    res,
                    result.response,
                    result.data,
                    ServerStatusCode.SUCESS_CODE
                )  
            }
           
        } catch (error) {
            apiErrorres(
                res,
                errorResponse.SOMETHING_WRONG,
                ServerStatusCode.SERVER_ERROR,
                true
            )
        }
    } catch (error) {
        throw error
    }
}


module.exports = {
    storeAirCommercial,
    getColoumnData,
    getRowData,
    commercialTypeAdd,
    commercialDetailList,
    addRowColoumn,
    updateMatrix,
    getAirCommercialListByCommercialId
}



