const {
  createAirPricingRequestBodyForCommonAPI,
} = require("../helpers/common-air-pricing.helper");

module.exports.getCommonSSR = async (request) => {
  try {
    const { Itinerary } = request.ssrReqData;
    const { requestBody, error } = createAirPricingRequestBodyForCommonAPI({
      ...request,
      Itinerary,
    });
    if (error) return { error };
    return { result: requestBody, error: error };
  } catch (error) {
    console.log({ error });
    return { error: error.message };
  }
};
