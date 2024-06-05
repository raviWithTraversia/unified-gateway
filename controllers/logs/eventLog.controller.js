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

const getEventlogbyid=async(req,res)=>{
    try{
        const result = await EventLogServices.getEventlogbyid(req);
        if (!result.response && result.isSometingMissing) {
            apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        } else if (result.response === "Either doucment_id does not exist" || result.response === "Data Not Found") {
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

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )

    }
}

const getAgencyLog=async(req,res)=>{
    try{
        const result = await EventLogServices.getAgencyLog(req);
        if (!result.response && result.isSometingMissing) {
            apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        } else if (result.response === "Either doucment_id does not exist" || result.response === "Data Not Found") {
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

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )

    }
}


const getAgencyLogConfig=async(req,res)=>{
    try{
        const result = await EventLogServices.getAgencyLogConfig(req);
        if (!result.response && result.isSometingMissing) {
            apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        } else if (result.response === "Either doucment_id does not exist" || result.response === "Data Not Found") {
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

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )

    }
}


const getairCommercialfilterlog=async(req,res)=>{
    try{
        const result = await EventLogServices.getairCommercialfilterlog(req);
        if (!result.response && result.isSometingMissing) {
            apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        } else if (result.response === "Either doucment_id does not exist" || result.response === "Data Not Found") {
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

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )

    }
}




const getDisetuplog=async(req,res)=>{
    try{
        const result = await EventLogServices.getDisetuplog(req);
        if (!result.response && result.isSometingMissing) {
            apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        } else if (result.response === "Either doucment_id does not exist" || result.response === "Data Not Found") {
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

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )

    }
}

const getSsrlog=async(req,res)=>{
    try{
        const result = await EventLogServices.getSsrlog(req);
        if (!result.response && result.isSometingMissing) {
            apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        } else if (result.response === "Either doucment_id does not exist" || result.response === "Data Not Found") {
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

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )

    }
}

const getIncenctivelog=async(req,res)=>{
    try{
        const result = await EventLogServices.getIncenctivelog(req);
        if (!result.response && result.isSometingMissing) {
            apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        } else if (result.response === "Either doucment_id does not exist" || result.response === "Data Not Found") {
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

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )

    }
}


const getFairRuleslog=async(req,res)=>{
    try{
        const result = await EventLogServices.getFairRuleslog(req);
        if (!result.response && result.isSometingMissing) {
            apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        } else if (result.response === "Either doucment_id does not exist" || result.response === "Data Not Found") {
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

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )

    }
}


const getPgChargeslog=async(req,res)=>{
    try{
        const result = await EventLogServices.getPgChargeslog(req);
        if (!result.response && result.isSometingMissing) {
            apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        } else if (result.response === "Either doucment_id does not exist" || result.response === "Data Not Found") {
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

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )

    }
}

module.exports = { storeEventLog, retriveEventLogByCompanyId, getEventLog,getEventlogbyid,getAgencyLog ,getAgencyLogConfig,getairCommercialfilterlog,getDisetuplog,getSsrlog,getIncenctivelog,getFairRuleslog,getPgChargeslog}