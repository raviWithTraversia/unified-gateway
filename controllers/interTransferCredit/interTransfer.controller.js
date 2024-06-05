const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const interTransferService = require("./interTransfer.services");
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const interTransferCredit = async (req, res) => {
    try {
        const result = await interTransferService.interTransferCredit(req, res);
        if (!result.response && result.isSometingMissing) {
            apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        } else if (result.response === "You don't have permission to transfer Credit" ||
            result.response === "Not enough Credit to Transfer" ||
            result.response === "User not found" ||
            result.response === "Something went wrong") {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
        } else if (result.response === "Amount Transferred Successfully!") {
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

module.exports = { interTransferCredit };
