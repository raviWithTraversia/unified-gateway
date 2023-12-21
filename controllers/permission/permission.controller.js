const permissionServices = require('./permission.services');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const permissionList = async(req, res) => {
    try {
        const result = await permissionServices.getAllPermission(req);
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
};
const addPermission = async(req ,res) => {
    try {
        const result = await permissionServices.storePermission(req);
        if(result.response == 'Something went wrong try again later' || result.response == 'Permission name already exist') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            apiSucessRes(
                res,
                CrudMessage.PERMISSION_CREATE,
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
};
module.exports = {
    permissionList,
    addPermission
}