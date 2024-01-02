const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');
const roleHasPermissionService = require('./roleHasPermission.service');

const addRoleHasPermission = async(req , res) => {
    try {
        const result = await roleHasPermissionService.storeRoleHasPermission(req);
        if(result.response == 'All field are required' || result.response == 'Role ID not exist') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            apiSucessRes(
                res,
                CrudMessage.ROLE_HAS_PERMISSION_CREATE,
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

const getRoleHasPermission = async (req, res) => {
    try { 
        const result = await roleHasPermissionService.getRoleHasPermission(req);
        if(result.response == "Data Fetch Sucessfully"){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
    }else if(result.response == "Role has permission Not Found" ){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.RESOURCE_NOT_FOUND,
            true
            )
    }else{
        apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.UNPROCESSABLE,
            true
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


const updateRoleHasPermission = async(req , res) => {
    try {
        const result = await roleHasPermissionService.updateRoleHasPermission
        (req);
        if(result.response == 'All field are required' || result.response == 'Role ID not exist') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        
        else {
            apiSucessRes(
                res,
                CrudMessage.ROLE_HAS_PERMISSION_UPDATE,
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
    addRoleHasPermission,
    getRoleHasPermission,
    updateRoleHasPermission
}