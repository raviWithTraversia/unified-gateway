const balanceService = require("./manualDebitCreditRails.services");
const { apiSucessRes, apiErrorres } = require("../../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../../utils/constants");



const manualDebitCredit = async (req, res) => {
  try {
    const result = await balanceService.manualDebitCredit(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (result.response === "User id does not exist" || result.response === "User not found" || result.response === "Insufficient Balance"||result.response==='DIdata not found') {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "Amount Transfer Successfully") {
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
    throw error
  }
};

const agentPerformanceReport = async (req, res) => {
  try {
    const result = await balanceService.agentPerformanceReport(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (result.response === "User id does not exist" || result.response === "User not found" || result.response === "Insufficient Balance"||result.response==='DIdata not found') {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "agent Data Found Successfully") {
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
      error.message,
      ServerStatusCode.UNPROCESSABLE,
      true
    );
  }
};


module.exports = {  manualDebitCredit,agentPerformanceReport };
