const EventLogServices = require('./eventLog.services');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const storeEventLog = async (req, res) => {
    try {

        const result = await EventLogServices.addEventLog(req);
        if (result.response == 'CompanyId fields are required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        } else {
            apiSucessRes(
                res,
                CrudMessage.EVENT_LOG_CREATED,
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

const retriveEventLogByCompanyId = async (req, res) => {

    try {

        const result = await EventLogServices.retriveEventLog(req);
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )

    } catch (error) {
        console.log(error);
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true)
    }
}

const getEventLog = async (req, res) => {
    try {
        const result = await EventLogServices.getEventLog(req);
        if (!result.response && result.isSometingMissing) {
            apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        } else if (result.response === "Either eventName or companyId does not exist" || result.response === "Data Not Found") {
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
        )
    }
}

module.exports = { storeEventLog, retriveEventLogByCompanyId, getEventLog }