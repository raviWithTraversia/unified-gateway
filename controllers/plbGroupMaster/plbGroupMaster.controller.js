const PLBGroupMasterService = require('./plbGroupMaster.service');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const addPLBMasterGroup = async(req ,res) => {
    try {
        const result = await PLBGroupMasterService.addPLBGrpMaster(req);
        if (result.response == 'All fields are required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        } else {
            apiSucessRes(
                res,
                CrudMessage.PLBGROUP_CREATE,
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
}


module.exports = {
    addPLBMasterGroup
}