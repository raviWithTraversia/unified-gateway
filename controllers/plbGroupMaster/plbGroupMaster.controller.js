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

const updatePLBGroup = async(req ,res) => {
    try {
        const result = await PLBGroupMasterService.updatePLBGroupMaster(req);
        if (result.response == 'All fields are required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        } else {
            apiSucessRes(
                res,
                CrudMessage.PLBGROUP_UPDATE,
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


const deletePLBGroupMaster = async (req, res) => {
    try {
        const result = await PLBGroupMasterService.removePLBGroup(req);
        apiSucessRes(
            res,
            CrudMessage.PLBGROUP_DELETE,
            result.response,
            ServerStatusCode.SUCESS_CODE
        ) 
        
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true)
    }
}

const getPLBGroupMasterList = async(req ,res) => {
    try {
        const result = await PLBGroupMasterService.getPLBGroupMasterList(req);
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
            true)
    }
}

const getPLBGroupHasMaster = async(req ,res) => {
    try {
        const result = await PLBGroupMasterService.getPLBGroupHasPLBMaster(req);
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
            true)
    }
}


// PLB Group Master isDefine Default Route
const isDefaultDefinePLBMaster = async(req ,res) => {
    try {
        const result = await PLBGroupMasterService.PLBGroupDefineAsDefault(req);
        if (result.response == 'Company Id is required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        } else {
            apiSucessRes(
                res,
                CrudMessage.PLB_GROUP_MASTER_IS_DEFINE_DEFAULT,
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
    addPLBMasterGroup,
    updatePLBGroup,
    deletePLBGroupMaster,
    getPLBGroupMasterList,
    getPLBGroupHasMaster,
    isDefaultDefinePLBMaster
}