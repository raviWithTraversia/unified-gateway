const { default: axios } = require("axios");
const {
  createAirPricingRequestBodyForCommonAPI,
  convertAirPricingItineraryForCommonAPI,
} = require("../helpers/common-air-pricing.helper");
const { Config } = require("../configs/config");
const {
  getApplyAllCommercial,
} = require("../controllers/flight/flight.commercial");
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
    console.log({ error });
    return { error: "something went wrong while searching flights" };
  }
}

module.exports = { getCommonAirPricing };
