const { default: axios } = require("axios");
const { Config } = require("../configs/config");
const {
  createPnrTicketRequestBody,
  createRBDResponse,
} = require("../helpers/common-rbd.helper");
const {convertItineraryForKafila} = require("../helpers/common-search.helper");
const {convertPaxDetailsForKafila}=require("../helpers/common-import-pnr.helper");

module.exports.getCommonPnrTicket = async (request) => {
  try {
    console.dir({ request }, { depth: null });
    const requestBody = await createPnrTicketRequestBody(request);
    // console.log(requestBody);
    // if (requestError) throw new Error("Failed to create RBD request body");
    const rbdURL =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
      "/pnr/ticket";
    const { data: response } = await axios.post(rbdURL, requestBody);
    console.log(response.data);
    if (!response.data) throw new Error("No Data Available");
    const result = response.data;
    const journey = result.journey[0];
    const itinerary = journey.itinerary[0];
    console.log({ itinerary });
    const convertedItinerary = convertItineraryForKafila({
      itinerary,
      idx: 1,
      response: result,
      uniqueKey: result.uniqueKey,
    });
    const segmentGroup = groupSegments(itinerary.airSegments);
    const Passengers = convertPaxDetailsForKafila(
      journey.travellerDetails,
      segmentGroup
    );
    return {
      result: {
        Status: journey?.status?.pnrStatus || "failed",
        PNR:
          journey?.recLocInfo?.find?.((details) => details?.type === "GDS")
            ?.pnr ?? null,
        Itinerary: convertedItinerary,
        Passengers,
        // data: result.data,
      },
    };
  } 
  
  catch (err) {
    console.dir({ err }, { depth: null });
    return { error: err.message };
  }};

  function groupSegments(segments) {
    const group = {};
    segments.forEach((segment) => {
      if (!group[segment.group]) group[segment.group] = [];
      group[segment.group].push(segment);
    });
    return group;
  }
