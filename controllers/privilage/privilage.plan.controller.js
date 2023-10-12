const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');
const PrivilageServices = require('./privilage.plan.services');

const storePrivilagePlan = async (req, res) => {
    try {
       
        const result = await PrivilageServices.addPrivilagePlan(req);
        
        if(result.response == 'All field are required' || result.response == 'companyId does not exist' || result.response == 'product plan Id does not exist') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
        }
        else {
            apiSucessRes(
                res,
                CrudMessage.PRIVILAGE_PLAN_CREATED,
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

const getAllPrivilage = async (req, res) => {
    try {
        const result = await PrivilageServices.getPrivilageList(req);
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

module.exports = { storePrivilagePlan , getAllPrivilage}