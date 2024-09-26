const axios = require("axios");
const { Config } = require("../configs/config");
const fs = require("fs");
const path = require("path");
const {
  convertItineraryForKafila,
  createSearchRequestBodyForCommonAPI,
} = require("../helpers/additional-search.helper");

async function getAdditionalFlights(request) {
  try {
    const { requestBody, uniqueKey } =
      createSearchRequestBodyForCommonAPI(request);
    const { data: response } = await axios.post(
      Config[Config.MODE].additionalFlightsBaseURL + "/flight/search",
      requestBody
    );
    console.log({ response });
    // fs.writeFileSync(
    //   path.resolve(__dirname, "response.json"),
    //   JSON.stringify(response, null, 2)
    // );
    //  ? assumption: only one way flights are considered
    const itineraries = response.data.journey[0].itinerary.map(
      (itinerary, idx) =>
        convertItineraryForKafila({
          itinerary,
          idx,
          response: response.data,
          uniqueKey,
        })
    );
    console.dir({ itineraries }, { depth: null });

    // fs.writeFileSync(
    //   path.resolve(__dirname, "converted-response.json"),
    //   JSON.stringify(itineraries, null, 2)
    // );
    return { data: itineraries };
  } catch (error) {
    return { error: error.message };
  }
}
module.exports = {
  getAdditionalFlights,
};
