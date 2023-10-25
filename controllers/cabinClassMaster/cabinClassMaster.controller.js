const cabinService = require('./cabinClassMater.services');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const cabinList = async(req, res) => {
    try {
        const result = await cabinService.getAllCabinClass(req);
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


module.exports = {cabinList}