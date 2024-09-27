const { default: axios } = require("axios");
const {
  createAirPricingRequestBodyForCommonAPI,
  convertAirPricingItineraryForCommonAPI,
} = require("../helpers/additional-air-pricing.helper");
const { Config } = require("../configs/config");

async function getAdditionalFlightAirPricing(request) {
  console.log({ request });
  try {
    const { requestBody, error: requestError } =
      createAirPricingRequestBodyForCommonAPI(request);
    if (requestError) throw new Error(requestError);
    const airPricingURL =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
      "/pricing/airpricing";
    const { data: response } = await axios.post(airPricingURL, requestBody);
    console.dir({ response }, { depth: null });
    return {
      result: [
        convertAirPricingItineraryForCommonAPI({
          response: response.data,
          requestBody,
          originalRequest: request,
        }),
      ],
    };
  } catch (error) {
    console.log({ error });
    return { error: "something went wrong while searching flights" };
  }
}

module.exports = { getAdditionalFlightAirPricing };
