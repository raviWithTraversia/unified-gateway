const PLBMasterService = require('./plbMaster.service');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const storePLBMaster = async(req ,res) => {
    try {
        const result = await PLBMasterService.addPLBMaster(req);
        if (result.response == 'Company Id is required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        } else {
            apiSucessRes(
                res,
                CrudMessage.CREATE_PLBMASTER,
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


const getPLBMasterList = async(req ,res) => {
    try {
        const result = await PLBMasterService.getPLBMaterByPLBType(req);
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


const updatePLBMaster = async (req, res) => {
    try {
        const result = await PLBMasterService.PLBMasterUpdate(req);
        if(result.response == 'Company Id is required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            apiSucessRes(
                res,
                CrudMessage.UPDATE_PLBMASTER,
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

const deletePLBMaster = async (req, res) => {
    try {

        const result = await PLBMasterService.removePLBMaster(req);
        apiSucessRes(
            res,
            CrudMessage.DELETE_PLBMASTER,
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

const copyPLBMaster = async(req ,res) => {
    try {
        const result = await PLBMasterService.CopyPLBMaster(req);
        if (result.response == 'PLB Master id not exist') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        } else {
            apiSucessRes(
                res,
                CrudMessage.COPY_PLB,
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


const PLBDefineIsDefault = async(req ,res) => {
    try {
        const result = await PLBMasterService.PLBMasterIsDefault(req);
        if (result.response == 'Company Id is required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        } else {
            apiSucessRes(
                res,
                CrudMessage.PLB_MASTER_IS_DEFAULT,
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

module.exports = {
    storePLBMaster,
    getPLBMasterList,
    updatePLBMaster,
    deletePLBMaster,
    copyPLBMaster,
    PLBDefineIsDefault
}