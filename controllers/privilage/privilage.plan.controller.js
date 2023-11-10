const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');
const PrivilageServices = require('./privilage.plan.services');


// add Privilage Plan 
const storePrivilagePlan = async (req, res) => {
    try {

        const result = await PrivilageServices.addPrivilagePlan(req);

        if (result.response == 'All field are required' || result.response == 'companyId does not exist' || result.response == 'product plan Id does not exist'
        || result.response == 'privilage plan name already exist') {
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

// Get privilage Plan 
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

// Get privilage Plan by product id
const privilagePlanByProductId = async (req, res) => {
    try {
        const result = await PrivilageServices.getPrivilagePlanByProductPlanId(req);
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


// Get privilage plan has permission by privilagePlanId
const privilagePlanHasPermission = async(req ,res) => {
    try {
        const result = await PrivilageServices.privilagePHPByPrivilageId(req);
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


// update privilage Plan
const updatePrivilagePlan = async(req , res) => {
    try {
        
        const result = await PrivilageServices.privilagePlanPatch(req);

        if (result.response == 'All field are required' || result.response == 'companyId does not exist' || result.response == 'product plan Id does not exist'
        || result.response == 'privilage plan name already exist') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
        }
        else {
            apiSucessRes(
                res,
                CrudMessage.PRIVILAGE_PLAN_UPDATE,
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

const isDefaultPrivilagePlan = async(req, res) => {
    try {
        const result = await PrivilageServices.privilagePlanAssignIsDefault(req); 
        
            apiSucessRes(
                res,
                CrudMessage.PRIVILAGE_PLAN_ISDEFAULT,
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

module.exports = { 
    storePrivilagePlan, 
    getAllPrivilage , 
    privilagePlanByProductId , 
    privilagePlanHasPermission ,
    updatePrivilagePlan,
    isDefaultPrivilagePlan
}