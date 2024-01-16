const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  ADMIN_USER_TYPE,
  CrudMessage,
} = require("../../utils/constants");
const airportDetailsController = require("./airportDetails.sevices");

const addAirportDetail = async (req,res) => {
    try{
    const result = await airportDetailsController.addAirportDetail(req,res);
    if(result.isSometingMissing == true){
        apiErrorres(
           res,
           result.response,
           ServerStatusCode.PRECONDITION_FAILED,
           true 
        )
    }
    else if(result.response == 'New Airport Added Sucessfully'){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
    }
    else{
        apiErrorres(
            res,
            ServerStatusCode.RESOURCE_NOT_FOUND,
            errorResponse.SOME_UNOWN,
            true
          );
    }

    }catch(error){
        apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);

    }
};
 
const getAirportDetails = async (req,res) => {
    try{
    const result = await airportDetailsController.getAirportDetails(req,res);
    if(result.response == 'Input Data is Required'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.PRECONDITION_FAILED,
            true 
         )
    }else if(result.response == 'Airport Details Found Successfully'){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
    }else if(result.response == 'Airport data Not Found'){
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
            ServerStatusCode.RESOURCE_NOT_FOUND,
            errorResponse.SOME_UNOWN,
            true
          );
    }

    }catch(error){
        apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);
    }
}
module.exports = {
    addAirportDetail,
    getAirportDetails 
}