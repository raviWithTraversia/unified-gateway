const getAllledgerServices = require("./ledgerRail.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");

const getAllledger = async (req, res) => {
  try {
    const result = await getAllledgerServices.getAllledger(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "User id does not exist" ||
      result.response === "Data Not Found"
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

const transactionReport = async (req, res) => {
  try {
    const result = await getAllledgerServices.transactionReport(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (result.response === "Data Not Found") {
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
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const getAllledgerbyDate = async (req, res) => {
  try {
    const result = await getAllledgerServices.getAllledgerbyDate(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "please enter date" ||
      result.response === "ledger not found"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "ledger find succefully") {
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

const fetchLedgerReport = async (req, res) => {
  try {
    const { result, error } = await getAllledgerServices.fetchLedgerRailReport(
      req
    );
    if (error) {
      return apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);
    }
    apiSucessRes(
      res,
      "Fetch Data Successfully",
      result,
      ServerStatusCode.SUCESS_CODE
    );
  } catch (error) {
    console.log({ error });
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};
module.exports = {
  getAllledger,
  transactionReport,
  getAllledgerbyDate,
  fetchLedgerReport,
};
