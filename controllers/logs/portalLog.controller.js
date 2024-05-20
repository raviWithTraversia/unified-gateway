const PortalLogService = require('../logs/protalLog.services');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');


const storePortalLog = async (req, res) => {
    try {

        const result = await PortalLogService.addPortalLog(req);
        if (result.response == 'CompanyId fields are required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        } else {
            apiSucessRes(
                res,
                CrudMessage.PORTAL_LOG_CREATED,
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

const retrivePortalLog = async (req, res) => {

    try {

        const result = await PortalLogService.getPortalLog(req);
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )

    } catch (error) {
        return res.status(500).json({
            success: false, msg: error.message,
            data: null
        });
    }
}

const getBookingLogs = async (req, res) => {
    try {
        const result = await PortalLogService.getBookingLogs(req, res);
        if (!result.response && result.isSometingMissing) {
            apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        } else if (result.response === "CompanyId does not exist" || result.response === "Data Not Found") {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
        } else if (result.response === "Fetch Data Successfully") {
            apiSucessRes(
                res,
                result.response,
                result.data,
                ServerStatusCode.SUCESS_CODE
            );
        } else {
            apiErrorres(
                res,
                errorResponse.SOME_UNOWN,
                ServerStatusCode.UNPROCESSABLE,
                true
            );
        }
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        );
    }
}

module.exports = { storePortalLog, retrivePortalLog, getBookingLogs }