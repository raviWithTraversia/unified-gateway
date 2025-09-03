const railBookingServices = require("./railbooking.service");
const { apiSucessRes, apiErrorres } = require("../../../utils/commonResponce");
const { ServerStatusCode, errorResponse, CrudMessage, } = require("../../../utils/constants");
// const flightSerchLogServices = require("../../controllers/flightSearchLog/flightSearchLog.services");

const StartBookingRail=async(req,res)=>{
    try{
        const result = await railBookingServices.StartBookingRail(req, res);
        if (!result.response && result.isSometingMissing) {
            apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        } else if (
            result.response === "Select only Wallet Payment Method" ||
            result.response === "Your Booking already exists" ||
            result.response === "Your Balance is not sufficient." ||
            result.response === "Either User or Company must exist" ||
            result.response === "User role must be Agency" ||
            result.response === "companyId must be TMC"||
            result.response=="something Went wrong"
        ) {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
        } else if (result.response === "Amount transferred successfully."||result.response === "Cart Created Succefully.") {
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
        console.log(error)
 apiErrorres(
        res,
        error.message,
        ServerStatusCode.SERVER_ERROR,
        true
    );
}
}
const findRailAllBooking = async (req, res) => {
    try {
      const result = await railBookingServices.findRailAllBooking(req, res);
      if (!result.response && result.isSometingMissing) {
        apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
      } else if (result.response === "User id does not exist" || result.response === "Data Not Found") {
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
      console.error(error);
      apiErrorres(
        res,
        errorResponse.SOMETHING_WRONG,
        ServerStatusCode.SERVER_ERROR,
        true
      );
    }
  }; 

  const getProvideStatusCount = async (req, res) => {
     try {
      const result = await railBookingServices.getProvideStatusCount(req, res);
      if (!result.response && result.isSometingMissing) {
        apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
      } else if (result.response === "User id does not exist" || result.response === "Data Not Found") {
        apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
      } else if (result.response === "Data Found Successfully") {
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
      console.error(error);
      apiErrorres(
        res,
        errorResponse.SOMETHING_WRONG,
        ServerStatusCode.SERVER_ERROR,
        true
      );
    }
  }
module.exports = {StartBookingRail,findRailAllBooking,getProvideStatusCount};
