const commercialAirPlanService = require('./commercialAirPlan.services');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const storeCommercialAirPlan = async(req ,res) => {
    try {
       
        const result = await commercialAirPlanService.addCommercialAirPlan(req); 
        if(result.response == 'All field are required' || result.response == 'Commercial air plan name already exist') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }else {
            apiSucessRes(
                res,
                CrudMessage.COMMERCIAL_AIR_PLAN,
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

// Commercial air plan list get By comapnyId
const getCommercialAirPlanByCompanyId = async(req , res) => {
        try {
            const result = await commercialAirPlanService.getCommercialAirPlanListByCompanyId(req)
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

// update commerical air plan by commercialAirPlanId
const updateCommercialAirPlan = async(req , res) => {
    try {
        const result = await commercialAirPlanService.commercialPlanUpdate(req); 
        if(result.response == 'Commercial plan name is required' || result.response == 'Commercial air plan name already exist') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }else {
            apiSucessRes(
                res,
                CrudMessage.COMMERCIAL_AIR_PLAN_UPDATE,
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


// Commercial air plan define IsDfault process
const isDefaultCommercialAirPlan = async(req, res) => {
    try {
        const result = await commercialAirPlanService.isDefaultCommercialAirPlan(req); 
        
            apiSucessRes(
                res,
                CrudMessage.COMMERCIAL_AIR_PLAN_ISDEFAULT,
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
    storeCommercialAirPlan,
    getCommercialAirPlanByCompanyId,
    updateCommercialAirPlan,
    isDefaultCommercialAirPlan
}