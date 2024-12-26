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
      "/flight/search";
    console.log({ url });

    const { data: response } = await axios.post(url, requestBody);
    saveLogInFile("response.jsonhduueueeu", response);
    // fs.writeFileSync(
    //   path.resolve(__dirname, "response.json"),
    //   JSON.stringify(response, null, 2)
    // );
    //  ? assumption: only one way flights are considered
    let itineraries = response.data.journey[0].itinerary.map((itinerary, idx) =>
      convertItineraryForKafila({
        itinerary,
        idx,
        response: response.data,
        uniqueKey,
      })
    );
    try {
      itineraries = await getApplyAllCommercial(
        request.Authentication,
        request.TravelType,
        itineraries
      );
    } catch (errorApplyingCommercial) {
      console.log({ errorApplyingCommercial });
    }
    return { data: itineraries || [] };
  } catch (error) {
    saveLogInFile("search-error.json", {
      errorStack: error.stack,
      message: error.message,
    });
    console.log({ error });
    return { error: error.message };
  }
}
module.exports = {
  commonFlightSearch,
};
