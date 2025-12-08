const axios = require("axios");
const { Config } = require("../configs/config");
const fs = require("fs");
const path = require("path");
const {
  convertItineraryForKafila,
  createSearchRequestBodyForCommonAPI,
} = require("../helpers/common-search.helper");
const {
  getApplyAllCommercial,
} = require("../controllers/flight/flight.commercial");
const { saveLogInFile } = require("../utils/save-log");

async function commonFlightSearch(request) {
  try {
    const { requestBody, uniqueKey } =
      createSearchRequestBodyForCommonAPI(request);
    const url =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
      "/Search/v2/LowFareSearch";
    // "/flight/search";
    console.log({ url });
    console.log(
      `${
        request?.Authentication?.TraceId || ""
      } search sent to gateway at : ${new Date()}`
    );

    const { data: response } = await axios.post(url, requestBody, {
      timeout: Config.apiTimeout || Infinity,
    });
    saveLogInFile("search-RS.json", response);
    console.log(
      `${
        request?.Authentication?.TraceId || ""
      } search results received from gateway at : ${new Date()}`
    );

    //  ? assumption: only one way flights are considered
    let itineraries = response?.data?.journey?.[0]?.itinerary
      // ?.filter(
      //   (itinerary) =>
      //     !["h1", "x1"].includes(itinerary.valCarrier.toLowerCase())
      // )
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
      } catch (errorApplyingCommercial) {
        console.log({ errorApplyingCommercial });
      }
    }
    // console.log({ itineraries });
    return { data: itineraries };
  } catch (error) {
    saveLogInFile("search-rs.error.json", error?.response?.data);
    return { error: error.message };
  }
}
module.exports = {
  commonFlightSearch,
};
