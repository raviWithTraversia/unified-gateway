const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const invoiceGeneratorService = require("./invoiceGenerator.service");
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const invoiceGenerator = async (req, res) => {
    try {
        const result = await invoiceGeneratorService.invoiceGenerator(req, res);
        if (result.response ==="BookingId is required.") {
            apiErrorres(res, result.response, ServerStatusCode.SERVER_ERROR, true);
        } else if (result.response === "Invoice Generated Successfully!") {
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

module.exports = { invoiceGenerator };
