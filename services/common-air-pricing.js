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
const { authenticate } = require("../helpers/authentication.helper");
const Logs = require("../controllers/logs/PortalApiLogsCommon");

async function getCommonAirPricing(request) {
  console.dir({ request }, { depth: null });
  const reqItinerary =
    request.Itinerary?.[0] || request.ItineraryPriceCheckResponses?.[0];

  const logData = {
    traceId:
      reqItinerary?.TraceId ?? request?.Authentication?.TraceId ?? "blank",
    companyId:
      (request?.Authentication?.CompanyId ||
        request?.SearchRQ?.Authentication?.CompanyId) ??
      "blank",
    userId:
      (request?.Authentication?.CompanyId ||
        request?.SearchRQ?.Authentication?.CompanyId) ??
      "blank",
    source: "CoreAPI",
    type: "Portal log",
    BookingId: reqItinerary.BookingId ?? "blank",
    product: "Flight",
    logName: "Pricing",
    request: {},
    responce: {},
  };
  try {
    const { requestBody, error: requestError } =
      createAirPricingRequestBodyForCommonAPI(request);
    logData.request = requestBody;

    saveLogInFile("pricing-req.json", requestBody);
    if (requestError) throw new Error(requestError);
    const airPricingURL =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
      "/prebook/v2/AirPricing";
    // "/pricing/airpricing";

    const token = await authenticate(request.Authentication.CredentialType);
    const { data: response } = await axios.post(airPricingURL, requestBody, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logData.responce = response;

    saveLogInFile("pricing-res.json", response);
    // console.dir({ response }, { depth: null });
    let convertedItinerary = await convertAirPricingItineraryForCommonAPI({
      response: response.data,
      requestBody,
      originalRequest: request,
    });
    let result = [convertedItinerary];
    try {
      const resultWithCommercial = await getApplyAllCommercial(
        request.Authentication,
        request.TravelType,
        result
      );
      // console.dir({ resultWithCommercial }, { depth: null });
      if (resultWithCommercial?.length) {
        result = resultWithCommercial;
      }
    } catch (airPricingCommercialError) {
      console.log({ airPricingCommercialError });
    }
    // console.dir({ result }, { depth: null });
    return { result };
  } catch (error) {
    logData.responce = {
      data: logData.responce.data || null,
      error: {
        message: error.message,
        stack: error.stack,
        data: error?.response?.data || null,
      },
    };
    saveLogInFile("pricing-err.res.json", {
      message: error.message,
      stack: error.stack,
      data: error?.response?.data,
    });
    console.log({ error });
    console.dir({ errResponse: error?.response?.data }, { depth: null });
    return { error: error.response?.data?.message || error.message };
  } finally {
    Logs(logData);
  }
}

module.exports = { getCommonAirPricing };
