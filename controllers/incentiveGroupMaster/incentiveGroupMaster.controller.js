const IncentiveGroupService = require('./incentiveGroupMaster.service');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const addIncMasterGroup = async(req ,res) => {
    try {
        const result = await IncentiveGroupService.addIncGroupMaster(req);
        if (result.response == 'All fields are required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        } else {
            apiSucessRes(
                res,
                CrudMessage.INCGROUP_CREATE,
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

const updateIncGroupMaster = async(req ,res) => {
    try {
        const result = await IncentiveGroupService.updateIncGroupMaster(req);
        if (result.response == 'All fields are required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        } else {
            apiSucessRes(
                res,
                CrudMessage.INCGROUP_UPDATE,
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


const deleteIncGroupMaster = async (req, res) => {
    try {
        const result = await IncentiveGroupService.removeIncGroup(req);
        apiSucessRes(
            res,
            CrudMessage.INCGROUP_DELETE,
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

const getIncGroupMasterList = async(req ,res) => {
    try {
        const result = await IncentiveGroupService.getIncGrpMasterList(req);
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

const getIncGroupHasIncMaster = async(req ,res) => {
    try {
        const result = await IncentiveGroupService.getIncGroupHasIncMaster(req);
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

const incentiveGroupDefault = async(req ,res) => {
    try {
        const result = await IncentiveGroupService.defineIncetiveGroupDefault(req);
        if (result.response == 'Company Id is required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        } else {
            apiSucessRes(
                res,
                CrudMessage.INCENTIVE_GROUP_MASTER_IS_DEFINE_DEFAULT,
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
    addIncMasterGroup,
    updateIncGroupMaster,
    deleteIncGroupMaster,
    getIncGroupMasterList,
    getIncGroupHasIncMaster,
    incentiveGroupDefault
}