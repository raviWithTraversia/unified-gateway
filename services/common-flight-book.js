const { default: axios } = require("axios");
const { Config } = require("../configs/config");
const {
  createAirBookingRequestBodyForCommonAPI,
  convertBookingResponse,
} = require("../helpers/common-air-booking.helper");
const { saveLogInFile } = require("../utils/save-log");
const Logs = require("../controllers/logs/PortalApiLogsCommon");

module.exports.commonFlightBook = async function (
  request,
  reqSegment,
  reqItinerary,
  paxList
) {
  request = JSON.parse(JSON.stringify(request));
  request.PassengerPreferences = paxList;
  saveLogInFile("request-itinerary.json", reqItinerary);
  saveLogInFile("request.json", request);
  const logData = {
    traceId: reqItinerary?.TraceId ?? "blank",
    // traceId: request?.SearchRequest?.Authentication?.TraceId ?? "blank",
    companyId: request?.SearchRequest?.Authentication?.CompanyId ?? "blank",
    userId: request?.SearchRequest?.Authentication?.UserId ?? "blank",
    source: "APIGateway",
    type: "Portal log",
    BookingId: reqItinerary.BookingId ?? "blank",
    product: "Flight",
    logName: "Common Response",
    request: {},
    responce: {},
  };
  try {
    const { requestBody, error } =
      await createAirBookingRequestBodyForCommonAPI(
        request,
        reqSegment,
        reqItinerary
      );
    logData.request = error || requestBody;

    if (error) return { error };
    const url =
      Config[request?.SearchRequest?.Authentication?.CredentialType]
        .additionalFlightsBaseURL + "/booking/airbooking";

    const { data: response } = await axios.post(url, requestBody, {
      timeout: 120_000,
    });
    logData.responce = response;

    saveLogInFile("common-book-response.json", response);
    const bookingResponse = convertBookingResponse(
      request,
      response,
      reqSegment
    );
    saveLogInFile("booking-response.json", bookingResponse);
    logData.responce = {
      response: logData.responce,
      bookingResponse,
    };
    Logs(logData);
    return bookingResponse;
  } catch (error) {
    logData.responce = {
      response: logData.responce,
      message: error.message,
      stack: error.stack,
      errorResponse: error?.response?.data,
    };
    Logs(logData);
    saveLogInFile("common-flight-book-error.json", {
      stack: error.stack,
      error: error.message,
    });
    // console.log({ error });
    throw new Error(error.message);
    // console.dir({ response: error?.response?.data }, { depth: null });
    // return { error: error.message };
  }
};
