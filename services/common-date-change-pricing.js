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

async function getCommonDCAirPricing(request) {
  try {
    const { requestBody, error: requestError } =
      createAirPricingRequestBodyForCommonAPI(request);
    requestBody.PNR = request.PNR;
    requestBody.IsReissuancePricing = true;

    saveLogInFile("dc-pricing-req.json", requestBody);
    if (requestError) throw new Error(requestError);
    const airPricingURL =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
      "/prebook/v2/AirPricing";
    // "/pricing/airpricing";
    const { data: response } = await axios.post(airPricingURL, requestBody);
    saveLogInFile("dc-pricing-res.json", response);
    let convertedItinerary = convertAirPricingItineraryForCommonAPI({
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
      saveLogInFile("dc-pricing-commercial-err.json", {
        message: error.message,
        stack: error.stack,
      });
      console.log({ airPricingCommercialError });
    }
    return { result };
  } catch (error) {
    saveLogInFile("dc-after-rs-pricing-err.json", {
      data: error?.response?.data,
      message: error.message,
      stack: error.stack,
    });
    console.log({ error });
    console.dir({ errResponse: error?.response?.data }, { depth: null });
    return { error: error.response?.data?.message || error.message };
  }
}

module.exports = { getCommonDCAirPricing };
