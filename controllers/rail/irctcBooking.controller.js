const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const irctcBookingService = require("./irctcBooking.service");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");

const createIrctcBooking = async (req, res) => {
  try {
    const result = await irctcBookingService.createIrctcBooking(req, res);
    if (result.response === "BookingId is required.") {
      apiErrorres(res, result.response, ServerStatusCode.SERVER_ERROR, true);
    } else if (result.response === "Booking Generated Successfully!") {
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

const irctcPaymentSubmit = async (req, res) => {
  try {
    const result = await irctcBookingService.irctcPaymentSubmit(req, res);
    console.log(result.response, "sdkd");
    if (result.response === "Fetch Data Successfully") {
      apiErrorres(res, result.response, ServerStatusCode.SERVER_ERROR, true);
    } else if (result.response === "Provide required fields") {
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

const boardingstationenq = async (req, res) => {
  try {
    const result = await irctcBookingService.boardingstationenq(req, res);

    if (result.response === "Fetch Data Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response === "Provide required fields") {
      apiErrorres(res, result.response, ServerStatusCode.SERVER_ERROR, true);
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

const irctcAmountDeduction = async (req, res) => {
  try {
    const result = await irctcBookingService.irctcAmountDeduction(req, res);

    if (result.response === "Fetch Data Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response === "Provide required fields") {
      apiErrorres(res, result.response, ServerStatusCode.SERVER_ERROR, true);
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
module.exports = {
  createIrctcBooking,
  irctcPaymentSubmit,
  boardingstationenq,
  irctcAmountDeduction,
};
