const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');
const creditNoteService=require('./creditNotes.service')
const flightCreditNotes = async (req, res) => {
    try {
      const result = await creditNoteService.flightCreditNotes(
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
  const cancelationBooking = async (req, res) => {
    try {
      const result = await creditNoteService.cancelationBooking(
        req,
        res
      ); 
      if (!result.response && result.isSometingMissing) {
        apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
      } else if (result.response === "Invalid Dates filled" || result.response === "Data Not found") {
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

  const ManualRefund = async (req, res) => {
    try {
      const result = await creditNoteService.ManualRefund(
        req,
        res
      ); 
      if (!result.response && result.isSometingMissing) {
        apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
      } else if (result.response === "please fill all requied filed" || result.response === "Data Not found") {
        apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);   
       } else if (result.response === "Refunded Successfully") {
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

  const findCancelationRefund = async (req, res) => {
    try {
      const result = await creditNoteService.findCancelationRefund(
        req,
        res
      ); 
      console.log(result,"shai")
      if (!result.response) {
        apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
      } else if (result.response === "All Cancellations Already Refunded" || result.response === "Cancellation Data Not Found"||result.response ==="Data not Found"||result.response==="Kafila API Data Not Found"||result.response=="Not Match BookingID"||result.response=="Cancelation Data Not Found") {
        apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);   
       } else if (result.response === "Cancelation Proceed refund") {
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
  module.exports={
    flightCreditNotes,
    cancelationBooking,
    findCancelationRefund,
    ManualRefund
  }
  