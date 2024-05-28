const airLineCodeService = require('./airLineCode.service');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const getAirLineCode = async(req, res) => {
    try {
        const result = await airLineCodeService.getAllAirLineCode(req);
        if(result.response == 'AirLine code fetch successfully') {
            apiSucessRes(
                res,
                result.response,
                result.data,
                ServerStatusCode.SUCESS_CODE
            )
        }else{
            res,
            result.response,
            ServerStatusCode.SERVER_ERROR,
            true
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

const getAirLineCustumereCare = async(req, res) => {
    try {
        const result = await airLineCodeService.getAirLineCustumereCare(req);
        if(result.response == 'AirLine code fetch successfully') {
            apiSucessRes(
                res,
                result.response,
                result.data,
                ServerStatusCode.SUCESS_CODE
            )
        }else{
            res,
            result.response,
            ServerStatusCode.SERVER_ERROR,
            true
        }
       
    } catch (error) {
        console.log(error)
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
}


module.exports = {getAirLineCode,getAirLineCustumereCare}