const seriesDepartureServices = require('./seriesDeparture.services');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const {ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage}  = require('../../utils/constants');

const addFixedDepartureTicket = async (req,res) => {
    try {
    const result = await seriesDepartureServices.addFixedDepartureTicket(req,res);
    if(result.response == 'Ticket Data Insert Successfully'){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
            )
    }else if(result.response == 'Ticket Data Not Insert'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.PRECONDITION_FAILED,
            true
        )
    }else if(result.response == 'Duplicate key error. Ensure unique values for the "pnr" field.'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.PRECONDITION_FAILED,
            true
        )
    }
    else if(result.response == 'An error occurred during insertion.'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.PRECONDITION_FAILED,
            true
        )
    }
    else{
        apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.PRECONDITION_FAILED,
            true
        )
    }

    }catch(error){
        apiErrorres(
            res,
            error,
            ServerStatusCode.SERVER_ERROR,
            true 
            )
    }
};
module.exports = {
    addFixedDepartureTicket 
}
