const { default: axios } = require("axios");
const { Config } = require("../configs/config");

const {
  createAirBookingRequestBodyForCommonAPI,
  convertBookingResponse,
} = require("../helpers/common-air-booking.helper");
const { saveLogInFile } = require("../utils/save-log");
const Logs = require("../controllers/logs/PortalApiLogsCommon");
const http = require("http");
const https = require("https");

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
    saveLogInFile("common-book-request.json", requestBody);

    logData.request = error || requestBody;
    const isINTRoundtrip =
      requestBody?.typeOfTrip === "ROUNDTRIP" &&
      requestBody?.travelType === "INT";

    if (error) return { error };
    const url =
      Config[request?.SearchRequest?.Authentication?.CredentialType]
        .additionalFlightsBaseURL + "/book/v2/CreatePnr";
    // .additionalFlightsBaseURL + "/booking/airbooking";

    const { data: response } = await axios.post(url, requestBody, {
      timeout: 120_000,
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
    });
    logData.responce = response;

    saveLogInFile("common-book-response.json", response);
    const bookingResponse = convertBookingResponse(
      request,
      response,
      reqSegment,
      isINTRoundtrip
    );
    saveLogInFile("booking-response.json", bookingResponse);
    logData.responce = {
      response: logData.responce,
      bookingResponse,
    };
    return bookingResponse;
  } catch (error) {
    logData.responce = {
      response: logData.responce,
      message: error.message,
      stack: error.stack,
      errorResponse: error?.response?.data,
    };
    saveLogInFile("common-flight-book-error.json", {
      stack: error.stack,
      error: error.message,
      data: error?.response?.data,
    });
    throw new Error(error.message);
  } finally {
    Logs(logData);
  }
};
