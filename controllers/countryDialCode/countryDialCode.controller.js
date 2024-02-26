const countryServices = require('./countryDialCode.services');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');
const getCountryDialCode = async(req, res) => {
    try {
        const result = await countryServices.getCountryDialCode(req, res);
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

module.exports = {
    getCountryDialCode  
}