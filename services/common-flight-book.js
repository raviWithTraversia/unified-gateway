const { default: axios } = require("axios");
const { Config } = require("../configs/config");
const {
  createAirBookingRequestBodyForCommonAPI,
  convertBookingResponse,
} = require("../helpers/common-air-booking.helper");
const { saveLogInFile } = require("../utils/save-log");

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
  try {
    const { requestBody, error } = createAirBookingRequestBodyForCommonAPI(
      request,
      reqSegment,
      reqItinerary
    );
    if (error) return { error };
    const url =
      Config[request?.SearchRequest?.Authentication?.CredentialType ?? "TEST"]
        .additionalFlightsBaseURL + "/booking/airbooking";

    const { data: response } = await axios.post(url, requestBody);
    saveLogInFile("common-book-response.json", response);
    const bookingResponse = convertBookingResponse(
      request,
      response,
      reqSegment
    );
    saveLogInFile("booking-response.json", bookingResponse);
    return bookingResponse;
  } catch (error) {
    saveLogInFile("common-flight-book-error.json", {
      stack: error.stack,
      error: error.message,
    });
    console.log({ error });
    throw new Error(error.message);
    // console.dir({ response: error?.response?.data }, { depth: null });
    // return { error: error.message };
  }
};
