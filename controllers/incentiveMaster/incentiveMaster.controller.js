const IncentiveMasterService = require('./incentiveMaster.service');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const storeIncentiveMaster = async(req ,res) => {
    try {
        const result = await IncentiveMasterService.addIncentiveMaster(req);
        if (result.response == 'Company Id is required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        } else {
            apiSucessRes(
                res,
                CrudMessage.CREATE_INCENTIVE_MASTER,
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


const getIncentiveMasterList = async(req ,res) => {
    try {
        const result = await IncentiveMasterService.getIncentiveMaster(req);
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


const updateIncentiveMaster = async (req, res) => {
    try {
        const result = await IncentiveMasterService.incentiveMasterUpdate(req);
        if(result.response == 'Company Id is required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            apiSucessRes(
                res,
                CrudMessage.UPDATE_INCENTIVE_MASTER,
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

const deleteIncentiveMaster = async (req, res) => {
    try {

        const result = await IncentiveMasterService.removeIncentiveMaster(req);
        apiSucessRes(
            res,
            CrudMessage.DELETE_INCENTIVE_MASTER,
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

const copyIncentiveMaster = async(req ,res) => {
    try {
        const result = await IncentiveMasterService.CopyIncentiveMaster(req);
        if (result.response == 'PLB Master id not exist') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        } else {
            apiSucessRes(
                res,
                CrudMessage.COPY_INCENTIVE_MASTER,
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


const incentiveDefineIsDefault = async(req ,res) => {
    try {
        const result = await IncentiveMasterService.defineIncetiveMasterDefault(req);
        if (result.response == 'Company Id is required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        } else {
            apiSucessRes(
                res,
                CrudMessage.INCENTIVE_MASTER_IS_DEFAULT,
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
    storeIncentiveMaster,
    getIncentiveMasterList,
    updateIncentiveMaster,
    deleteIncentiveMaster,
    copyIncentiveMaster,
    incentiveDefineIsDefault
}