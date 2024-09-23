const { default: axios } = require("axios");
const {
  createAirPricingRequestBodyForCommonAPI,
  convertAirPricingItineraryForCommonAPI,
} = require("../helpers/additional-air-pricing.helper");

async function getAdditionalFlightAirPricing(request) {
  try {
    const requestBody = createAirPricingRequestBodyForCommonAPI(request);
    const { data: response } = await axios.post(
      "http://tcilapi.traversia.net:31101/api/pricing/airpricing",
      requestBody
    );
    console.log({ response });
    return {
      result: convertAirPricingItineraryForCommonAPI({
        response: response.data,
        requestBody,
        originalRequest: request,
      }),
    };
    // return {
    //   // IsSucess: true,
    //   // ResponseStatusCode: 200,
    //   // Message: "Fetch Data Successfully",
    //   Result: [

    //   ],
    // };
  } catch (error) {
    console.log({ error });
    return { error: error.message };
  }
}

module.exports = { getAdditionalFlightAirPricing };
