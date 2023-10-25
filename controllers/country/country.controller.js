const countryServices = require('./country.services');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const countryList = async(req, res) => {
    try {
        const result = await countryServices.getAllCountry(req);
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


module.exports = {countryList}