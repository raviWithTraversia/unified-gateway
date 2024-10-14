const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const irctcBookingService = require("./irctcBooking.service");
const invoiceGeneratorService=require('./invoiceGenereter')
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");
const creditNotesService=require('./creditNote')

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

const RailinvoiceGenerator = async (req, res) => {
  try {
      const result = await invoiceGeneratorService.RailInoviceGerneter(req, res);
      if (result.response ==="BookingId is required." || result.response ==="Pnr BookingId is required."||result.response==="Invoice not found") {
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
    console.log(error)
      apiErrorres(
          res,
          errorResponse.SOMETHING_WRONG,
          ServerStatusCode.SERVER_ERROR,
          true
      );
  }
};

const RailCreditNotes = async (req, res) => {
  try {
    const result = await creditNotesService.RailCreditNotes(
      req,
      res
    ); 
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (result.response === "User id does not exist" || result.response === "Error in updating assignedUser") {
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
module.exports = {
  createIrctcBooking,
  irctcPaymentSubmit,
  boardingstationenq,
  irctcAmountDeduction,
  RailinvoiceGenerator,
  RailCreditNotes
};
