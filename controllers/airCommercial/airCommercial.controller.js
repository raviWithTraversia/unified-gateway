const airCommericalService = require('./airCommercial.service');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');

const storeAirCommercial = async (req, res) => {
    try {
        const result = await airCommericalService.addAirCommercial(req);
        if (result.response == 'Commercial air plan Id field are required' ||
            result.response == 'Travel Type field are required' ||
            // result.response == 'Carrier field are required' ||
            // result.response == 'Supplier field are required' ||
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

const getColoumnData = async (req, res) => {
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


const getRowData = async (req, res) => {
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

const commercialTypeAdd = async (req, res) => {
    try {
        const result = await airCommericalService.addCommercialType(req);
        if (result.response == 'All fields are required') {
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

const commercialDetailList = async (req, res) => {
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

const addRowColoumn = async (req, res) => {
    try {
        const result = await airCommericalService.commercialRowColoumnAdd(req);
        if (result.response == 'Commercial air plan Id field are required') {
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


const updateMatrix = async (req, res) => {
    try {

        const result = await airCommericalService.UpdateMatrixData(req);
        if (result.response == 'All field are required' || result.response == 'Something went wrong!!') {
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

const getAirCommercialListByCommercialId = async (req, res) => {
    try {
        try {
            const result = await airCommericalService.getAirCommercialListByAirComId(req);

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
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
}


// Commercial Field for include and exclude
const addCommercialFilterInEx = async (req, res) => {
    try {
        const result = await airCommericalService.addCommercialFilterExcInc(req);
        if (result.response == 'All fields are required' || result.response == 'Something went wrong, try again later!') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            apiSucessRes(
                res,
                CrudMessage.COMMERCIAL_FILTER,
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


// get commercial Include exclude
const getCommercialIncExc = async (req, res) => {
    try {
        const result = await airCommericalService.getComExcIncList(req);
        if (result.response == 'Commercial include exclude list not available') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            apiSucessRes(
                res,
                result.data,
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


const getComIncExludeList = async (req, res) => {
    try {
        const result = await airCommericalService.getComIncludeExclude(req);
        apiSucessRes(
            res,
            result.data,
            result.response,
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


const matrixList = async (req, res) => {
    try {
        const result = await airCommericalService.getMatrixList(req);
        apiSucessRes(
            res,
            result.data,
            result.response,
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


// Delete process for air commercial 

const deleteAirCommercial = async (req, res) => {
    try {
        const result = await airCommericalService.deleteAirCommmercialDetail(req);
        if (result.response == 'Air commercial not deleted , Something went wrong') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)

        } else {
            apiSucessRes(
                res,
                CrudMessage.COMMERCIAL_DELETE,
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


const getSingleAirComList = async (req, res) => {
    try {
        const result = await airCommericalService.getSingleAirComList(req);
        apiSucessRes(
            res,
            result.data,
            result.response,
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


const getCommercialLog = async (req, res) => {
    try {
        const result = await airCommericalService.getCommercialHistoryList(req);
        apiSucessRes(
            res,
            result.data,
            result.response,
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

const updateAirCommercialFilter = async (req,res) => {
    try{
    let result = await airCommericalService.updateAirCommercialFilter(req,res);
    if(result.response == 'AirCommercial Data Upadted Sucessfully'){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
            )
    }else if(result.response == 'AirCommercial Data Not Updated'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.PRECONDITION_FAILED,
            true
        )
    }else{
        apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.PRECONDITION_FAILED,
            true
        )  
    }

    }catch(error){
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
    commercialDetailList,
    addRowColoumn,
    updateMatrix,
    getAirCommercialListByCommercialId,
    getCommercialIncExc,
    addCommercialFilterInEx,
    getComIncExludeList,
    matrixList,
    deleteAirCommercial,
    getSingleAirComList,
    getCommercialLog,
    updateAirCommercialFilter
}



