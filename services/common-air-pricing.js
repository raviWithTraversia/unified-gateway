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

async function getCommonAirPricing(request) {
  console.dir({ request }, { depth: null });
  try {
    const { requestBody, error: requestError } =
      createAirPricingRequestBodyForCommonAPI(request);

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
    saveLogInFile("pricing-res.json", response);
    // console.dir({ response }, { depth: null });
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
      console.log({ airPricingCommercialError });
    }
    // console.dir({ result }, { depth: null });
    return { result };
  } catch (error) {
    saveLogInFile("pricing-err.res.json", {
      message: error.message,
      stack: error.stack,
      data: error?.response?.data,
    });
    console.log({ error });
    console.dir({ errResponse: error?.response?.data }, { depth: null });
    return { error: error.response?.data?.message || error.message };
  }
}

module.exports = { getCommonAirPricing };
