const { default: axios } = require("axios");
const {
  createAirPricingRequestBodyForCommonAPI,
  convertAirPricingItineraryForCommonAPI,
} = require("../helpers/additional-air-pricing.helper");
const { Config } = require("../configs/config");

async function getAdditionalFlightAirPricing(request) {
  console.log({ request });
  try {
    const requestBody = createAirPricingRequestBodyForCommonAPI(request);
    console.dir({ requestBody }, { depth: null });
    const { data: response } = await axios.post(
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
        "/pricing/airpricing",
      requestBody
    );
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
