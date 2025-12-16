const axios = require("axios");
const { Config } = require("../configs/config");
const {
  convertItineraryForKafila,
} = require("../helpers/common-search.helper");
const {
  getApplyAllCommercial,
} = require("../controllers/flight/flight.commercial");
const { saveLogInFile } = require("../utils/save-log");
const {
  createDCSearchRequestBodyForCommonAPI,
} = require("../helpers/common-date-change-search.helper");
const { authenticate } = require("../helpers/authentication.helper");

async function commonDateChangeSearch(request) {
  try {
    const { requestBody, uniqueKey } =
      createDCSearchRequestBodyForCommonAPI(request);
    saveLogInFile("DC-Search.RQ.json", requestBody);
    const url =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
      "/Search/v2/LowFareSearch";

    const token = await authenticate(request.Authentication.CredentialType);
    const { data: response } = await axios.post(url, requestBody, {
      timeout: Config.apiTimeout || Infinity,
      headers: { Authorization: `Bearer ${token}` },
    });
    saveLogInFile("DC-Search.RS.json", response);

    //  ? assumption: only one way flights are considered
    let itineraries = response?.data?.journey?.[0]?.itinerary
      ?.filter(
        (itinerary) =>
          !["h1", "x1", "sg"].includes(itinerary.valCarrier.toLowerCase())
      )
      ?.map((itinerary, idx) =>
        convertItineraryForKafila({
          itinerary,
          idx,
          response: response.data,
          uniqueKey,
        })
      );
    if (itineraries?.length) {
      try {
        // itineraries = itineraries.filter(
        //   (itinerary) =>
        //     !["h1", "sg"].includes(itinerary.ValCarrier.toLowerCase())
        // );
        itineraries = await getApplyAllCommercial(
          request.Authentication,
          request.TravelType,
          itineraries
        );
      } catch (error) {
        saveLogInFile("DC-commercial.ERR.json", {
          data: error?.response?.data,
          message: error.message,
          stack: error.stack,
        });
        console.log({ error });
      }
    }
    return { data: itineraries };
  } catch (error) {
    saveLogInFile("DC-Search.ERR.json", {
      data: error?.response?.data,
      message: error.message,
      stack: error.stack,
    });
    return { error: error.message };
  }
}
module.exports = {
  commonDateChangeSearch,
};
