const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');
const emulateService = require('./emulate.service');

const emulateLogin = async(req ,res) => {
    try {
        const result = await emulateService.searchForUserEmulate(req);
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

const emulateAuthenticate = async(req ,res) => {
    try {
        const result = await emulateService.authenticate(req);
        if(result.response == 'All fields are required' || 
        result.response == 'User is not active' || 
        result.response == 'User not exist' || 
        result.response == 'Company not exist' || result.response == 'An error occurred during authentication') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
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
    emulateLogin,
    emulateAuthenticate
}