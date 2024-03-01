const fareFamilyMasterService = require('./fareFamilyMaster.service');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const getFareFamilyListData = async(req, res) => {
    try {
        const result = await fareFamilyMasterService.getFareFamilyMaster(req);
        if(result.response == 'Fare Family available' ){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
        }else if(result.response == 'Fare Family not available'){
            apiErrorres(
                res,
                result.data,
                ServerStatusCode.NOT_EXIST_CODE,
                true
            )
        }else{
            apiErrorres(
                res,
                errorResponse.SOMETHING_WRONG,
                ServerStatusCode.CONTENT_NOT_FOUND,
                true
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


module.exports = {getFareFamilyListData}