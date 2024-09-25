const { default: axios } = require("axios");
const {
  createAirPricingRequestBodyForCommonAPI,
  convertAirPricingItineraryForCommonAPI,
} = require("../helpers/additional-air-pricing.helper");

async function getAdditionalFlightAirPricing(request) {
  console.log({ request });
  try {
    const requestBody = createAirPricingRequestBodyForCommonAPI(request);
    const { data: response } = await axios.post(
      "http://tcilapi.traversia.net:31101/api/pricing/airpricing",
      requestBody
    );
    console.dir({ response }, { depth: null });
    return {
      IsSucess: true,
      apiReq: {},
      response: [
        convertAirPricingItineraryForCommonAPI({
          response: response.data,
          requestBody,
          originalRequest: request,
        }),
      ],
    };
  } catch (error) {
    console.log({ error });
    return { error: error.message };
  }
}

module.exports = { getAdditionalFlightAirPricing };
