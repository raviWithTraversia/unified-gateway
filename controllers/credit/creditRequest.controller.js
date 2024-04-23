const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');
const creditRequestService = require('./creditRequest.services');

const storeCreditRequest = async(req , res) => {
    try {
        const result = await creditRequestService.addCreditRequest(req);
        if(result.response == 'All field are required' || result.response == 'companyId does not exist' || result.response == 'createdBy id does not exist') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            apiSucessRes(
                res,
                CrudMessage.CREDIT_REQUESTED_CREATED,
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

const getAllCreditRequest = async(req , res) => {
    try {
        const result = await creditRequestService.getAllCreditList(req);
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

const getCreditByCompanyId = async(req , res) => {
    try {
        const result = await creditRequestService.getCredirRequestByCompanyId(req);
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
const getCreditByAgentId = async(req , res) => {
    try {
        const result = await creditRequestService.getCredirRequestByAgentId(req);
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

const approveRejectCredit = async(req ,res) => {
    try {
        const result = await creditRequestService.approveAndRejectCredit(req);
        if(result.response == 'Remark and status are required' || result.response == 'All field are required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            if(result.response == 'Credit request approved successfully') {
                apiSucessRes(
                    res,
                    CrudMessage.CREDIT_APPROVE,
                    result.response,
                    ServerStatusCode.SUCESS_CODE
                )  
            }else{
                apiSucessRes(
                    res,
                    CrudMessage.CREDIT_REJECTED,
                    result.response,
                    ServerStatusCode.SUCESS_CODE
                )  
            }
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
const wallettopup = async(req , res) => {
    try {        
        const result = await creditRequestService.addwallettopup(req);
        if(result.response == 'All field are required' || result.response == 'companyId does not exist' || result.response == 'createdBy id does not exist') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            apiSucessRes(
                res,
                CrudMessage.CREDIT_REQUESTED_CREATED,
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

module.exports = {
    storeCreditRequest , 
    getAllCreditRequest , 
    getCreditByCompanyId,
    approveRejectCredit,
    getCreditByAgentId,
    wallettopup
}