const { default: axios } = require("axios");
const {
  createAirPricingRequestBodyForCommonAPI,
  convertSSRItineraryForCommonAPI,
} = require("../helpers/common-air-pricing.helper");
const { Config } = require("../configs/config");

module.exports.getCommonSSRV1_1 = async (request) => {
  try {
    // const { result: Itinerary } = request;
    // const { Itinerary } = request.ssrReqData;
    const { requestBody, error } = createAirPricingRequestBodyForCommonAPI({
      ...request,
      Itinerary: request.Result,
    });
    if (error) return { error };
    const ssrBaggageAndMealURL =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
      "/ssr/getSSR";
    const { data: responseMealOrBaggage } = await axios.post(
      ssrBaggageAndMealURL,
      requestBody
    );

    const ssrOnlySeatURL =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
      "/seat/airSeatMap";
    const { data: responseSeat } = await axios.post(
      ssrOnlySeatURL,
      requestBody
    );
    const convertedSSRItinerary = await convertSSRItineraryForCommonAPI({
      responseMealOrBaggage: responseMealOrBaggage.data,
      responseSeat: responseSeat.data,
      requestBody,
      originalRequest: request,
    });
    return { result: convertedSSRItinerary, error: error };
  } catch (error) {
    console.log({ error });
    return { error: error.message };
  }
};
