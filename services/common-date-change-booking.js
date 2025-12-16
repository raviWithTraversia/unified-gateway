const { default: axios } = require("axios");
const {
  createAirPricingRequestBodyForCommonAPI,
  convertAirPricingItineraryForCommonAPI,
} = require("../helpers/common-air-pricing.helper");
const { Config } = require("../configs/config");
const {
  getApplyAllCommercial,
} = require("../controllers/flight/flight.commercial");
const { saveLogInFile } = require("../utils/save-log");
const {
  convertBookingResponse,
} = require("../helpers/common-air-booking.helper");
const { authenticate } = require("../helpers/authentication.helper");

async function makeCommonDCBooking(request) {
  const logData = {
    traceId: request.ItineraryPriceCheckResponses?.[0]?.TraceId ?? "blank",
    companyId: request?.SearchRequest?.Authentication?.CompanyId ?? "blank",
    userId: request?.SearchRequest?.Authentication?.UserId ?? "blank",
    source: "APIGateway",
    type: "Portal log",
    BookingId: request.ItineraryPriceCheckResponses?.[0]?.BookingId ?? "blank",
    product: "Flight",
    logName: "Common Response",
    request: {},
    responce: {},
  };
  try {
    const { requestBody, error: requestError } =
      createAirPricingRequestBodyForCommonAPI(request);
    requestBody.PNR = request.PNR;
    requestBody.isReissuanceBooking = true;
    logData.request = error || requestBody;

    saveLogInFile("dc-booking-req.json", requestBody);
    if (requestError) throw new Error(requestError);
    const bookingURL =
      Config[
        request?.Authentication?.CredentialType ||
          request?.SearchRQ?.Authentication?.CredentialType
      ].additionalFlightsBaseURL + "/book/v2/CreatePnr";

    const token = await authenticate(request.Authentication.CredentialType);

    const { data: response } = await axios.post(bookingURL, requestBody, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logData.responce = response;

    saveLogInFile("dc-booking-res.json", response);

    logData.responce = {
      response: logData.responce,
      bookingResponse,
    };
    const isINTRoundtrip = request?.SearchRQ?.Segments?.length > 1;
    const bookingResponse = convertBookingResponse(
      request,
      response,
      request?.SearchRQ?.Segments?.[0],
      isINTRoundtrip
    );
    saveLogInFile("dc-converted-booking-response.json", bookingResponse);
    // logData.responce = {
    //   response: logData.responce,
    //   bookingResponse,
    // };
    return bookingResponse;

    // let convertedItinerary = convertAirPricingItineraryForCommonAPI({
    //   response: response.data,
    //   requestBody,
    //   originalRequest: request,
    // });
    // let result = [convertedItinerary];
    // try {
    //   const resultWithCommercial = await getApplyAllCommercial(
    //     request.Authentication,
    //     request.TravelType,
    //     result
    //   );
    //   // console.dir({ resultWithCommercial }, { depth: null });
    //   if (resultWithCommercial?.length) {
    //     result = resultWithCommercial;
    //   }
    // } catch (airPricingCommercialError) {
    //   saveLogInFile("dc-pricing-commercial-err.json", {
    //     message: error.message,
    //     stack: error.stack,
    //   });
    //   console.log({ airPricingCommercialError });
    // }
    // return { result };
  } catch (error) {
    saveLogInFile("dc-booking-err.json", {
      data: error?.response?.data,
      message: error.message,
      stack: error.stack,
    });
    console.log({ error });
    console.dir({ errResponse: error?.response?.data }, { depth: null });
    return { error: error.response?.data?.message || error.message };
  }
}

module.exports = { makeCommonDCBooking };
