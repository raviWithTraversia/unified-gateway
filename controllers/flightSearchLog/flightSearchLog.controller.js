const flightSearchReport = require("./flightSearchLog.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");

let getFlightSerchReport =  async (req,res) => {
    try{
    const result = await flightSearchReport.getFlightSerchReport(req,res);
    if(result.response == 'Data Found Sucessfully'){
     apiSucessRes()
    }else if(result.response == 'Flight Search Data Not Available'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.RESOURCE_NOT_FOUND,
            true
          );
    }else{
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
    const result = flightSearchReport.addFlightSerchReport(req,res);

  }catch(error){

  }
}
module.exports = {
    getFlightSerchReport ,
    addFlightSerchReport
}
