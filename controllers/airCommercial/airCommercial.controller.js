const airCommericalService = require('./airCommercial.service');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');

const storeAirCommercial = async(req , res) => {
    try {
        const result = await airCommericalService.addAirCommercial(req);
        if(result.response == 'Commercial air plan Id field are required' || 
            result.response == 'Travel Type field are required' ||
            result.response == 'Carrier field are required' || 
            result.response == 'Cabin Class field are required' || 
            result.response == 'Commercial category  field are required' || 
            result.response == 'Supplier field are required' || 
            result.response == 'Source field are required' || 
            result.response == 'Commercial Type field are required' || 
            result.response == 'Fare Family field are required' || 
            result.response == 'issue From Date field are required' || 
            result.response == 'issue To Date field are required' || 
            result.response == 'Travel from date field are required' || 
            result.response == 'Travel to Date field are required' 
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

module.exports = {
    storeAirCommercial,
    getColoumnData,
    getRowData,
    commercialTypeAdd,
    commercialDetailList
}



