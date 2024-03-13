const flightSearchReportService = require("./flightSearchLog.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage
} = require("../../utils/constants");

let getFlightSerchReport =  async (req,res) => {
    try{
    const result = await flightSearchReportService.getFlightSerchReport(req,res);
    if(result.response == 'Data Found Successfully'){
     apiSucessRes(
      res,
      result.response,
      result.data,
      ServerStatusCode.SUCESS_CODE
     )
    }else if(result.response == 'Flight Search Data Not Available'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.RESOURCE_NOT_FOUND,
            true
          );
    }else if(result.response == 'Invalid date format. Please use YYYY-MM-DD.'){
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.NOT_EXIST_CODE,
        true
      );
    }else if(result.response == 'fromDate must be less than or equal to toDate'){
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.NOT_EXIST_CODE,
        true
      );
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
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
          );
    }
};
let addFlightSerchReport = async (req,res) => {
  try{
    const result = flightSearchReportService.addFlightSerchReport(req,res);

  }catch(error){

  }
};
module.exports = {
    getFlightSerchReport,
    addFlightSerchReport
}
