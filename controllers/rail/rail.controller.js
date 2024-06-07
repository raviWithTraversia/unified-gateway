const railSearchServices = require("./railSearch.services");

const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const { ServerStatusCode, errorResponse, CrudMessage, } = require("../../utils/constants");
// const flightSerchLogServices = require("../../controllers/flightSearchLog/flightSearchLog.services");

const railSearch = async (req, res) => {
    try {
        const result = await railSearchServices.getRailSearch(req, res);
        if (!result.response && result.isSometingMissing) {
            apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        } else if (
            result.response === "Provide required fields" ||
            result.response === "Error in fetching data" //||
            // result.response === "Supplier credentials does not exist" ||
            // result.response === "Company or User id field are required" ||
            // result.response === "TMC Compnay id does not exist" ||
            // result.response === "Travel Type Not Valid"
        ) {
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

module.exports = { railSearch };
