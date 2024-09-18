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
            result.response === "userID and companyId cartId paymentmethod amount" ||
            result.response === "Your Booking allready exist" ||
            result.response === "Your Balance is not sufficient" ||
            result.response === "Either User or Company must exist" ||
            result.response === "User role must be Agency" ||
            result.response === "companyId must be TMC"
        ) {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
        } else if (result.response === "your amount transfer Succefully") {
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
        error.message,
        ServerStatusCode.SERVER_ERROR,
        true
    );
}
}
module.exports = {StartBookingRail};
