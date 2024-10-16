const { default: axios } = require("axios");
const {
  createAirPricingRequestBodyForCommonAPI,
  convertAirPricingItineraryForCommonAPI,
} = require("../helpers/common-air-pricing.helper");
const { Config } = require("../configs/config");
async function getCommonAirPricing(request) {
  console.dir({ request }, { depth: null });
  try {
    const { requestBody, error: requestError } =
      createAirPricingRequestBodyForCommonAPI(request);
    if (requestError) throw new Error(requestError);
    const airPricingURL =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
      "/pricing/airpricing";
    const { data: response } = await axios.post(airPricingURL, requestBody);
    console.dir({ response }, { depth: null });
    const convertedItinerary = convertAirPricingItineraryForCommonAPI({
      response: response.data,
      requestBody,
      originalRequest: request,
    });
    return {
      result: [convertedItinerary],
    };
  } catch (error) {
    console.log({ error });
    return { error: "something went wrong while searching flights" };
  }
}

module.exports = { getCommonAirPricing };
