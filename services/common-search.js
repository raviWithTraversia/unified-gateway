const axios = require("axios");
const { Config } = require("../configs/config");
const fs = require("fs");
const path = require("path");
const {
  convertItineraryForKafila,
  createSearchRequestBodyForCommonAPI,
  getCommonCabinClass,
} = require("../helpers/common-search.helper");
const {
  getApplyAllCommercial,
} = require("../controllers/flight/flight.commercial");
const { saveLogInFile } = require("../utils/save-log");
const { authenticate } = require("../helpers/authentication.helper");

async function commonFlightSearch(request) {
  try {
    const baseURL =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL;

    const { requestBody, uniqueKey } =
      createSearchRequestBodyForCommonAPI(request);
    const url = baseURL + "/Search/v2/LowFareSearch";
    // "/flight/search";
    console.log({ url });
    console.log(
      `${
        request?.Authentication?.TraceId || ""
      } search sent to gateway at : ${new Date()}`
    );

    const token = await authenticate(request.Authentication.CredentialType);
    // saveLogInFile("header.json", { header, url, requestBody });
    const { data: response } = await axios.post(url, requestBody, {
      // timeout: Config.apiTimeout || Infinity,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    saveLogInFile("search-RS.json", response);
    console.log(
      `${
        request?.Authentication?.TraceId || ""
      } search results received from gateway at : ${new Date()}`
    );

    //  ? assumption: only one way flights are considered
    let cabinClass = getCommonCabinClass(request.Segments[0].ClassOfService);
    let itineraries = response?.data?.journey?.[0]?.itinerary
      ?.filter(
        (itinerary) =>
          itinerary.airSegments[0].cabinClass.toUpperCase() ===
          cabinClass.toUpperCase()
      )
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
    saveLogInFile("search-rs.error.json", {
      message: error.message,
      data: error?.response?.data,
      stack: error.stack,
    });
    return { error: error.message };
  }
}
module.exports = {
  commonFlightSearch,
};
