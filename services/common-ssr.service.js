const { default: axios } = require("axios");
const {
  createAirPricingRequestBodyForCommonAPI,
  convertSSRItineraryForCommonAPI,
} = require("../helpers/common-air-pricing.helper");
const { Config } = require("../configs/config");
const { saveLogInFile } = require("../utils/save-log");
const { authenticate } = require("../helpers/authentication.helper");

module.exports.getCommonSSR = async (request) => {
  try {
    const { Itinerary } = request.ssrReqData;
    const { requestBody, error } = createAirPricingRequestBodyForCommonAPI({
      ...request,
      Itinerary,
    });
    saveLogInFile("ssrRequestBody.json", requestBody);
    if (error) return { error };
    const ssrBaggageAndMealURL =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
      "/prebook/v2/GetSSRs";

    const token = await authenticate(request.Authentication.CredentialType);
    const { data: responseMealOrBaggage } = await axios.post(
      ssrBaggageAndMealURL,
      requestBody,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    saveLogInFile("responseMealOrBaggage.json", responseMealOrBaggage);

    const ssrOnlySeatURL =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
      "/prebook/v2/GetSeatMap";
    const { data: responseSeat } = await axios.post(
      ssrOnlySeatURL,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    saveLogInFile("responseSeat.json", responseSeat);

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
