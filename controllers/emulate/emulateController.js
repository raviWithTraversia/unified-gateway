const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');
const emulateService = require('./emulate.service');

const emulateLogin = async(req ,res) => {
    try {
        const result = await emulateService.searchForUserEmulate(req);
        if(result.response == "User not available") {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }else{
            apiSucessRes(
                res,
                result.response,
                result.data,
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
    emulateLogin
}