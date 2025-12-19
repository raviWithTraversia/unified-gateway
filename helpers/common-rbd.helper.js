const {
  createAirPricingRequestBodyForCommonAPI,
  getPnrTicketCommonAPIBody,
} = require("./common-air-pricing.helper");
const { convertSegmentForKafila } = require("./common-search.helper");

module.exports.createRBDRequestBody = (request) => {
  return createAirPricingRequestBodyForCommonAPI(request);
};

module.exports.createPnrTicketRequestBody = async (request) => {
  return getPnrTicketCommonAPIBody(request);
};

module.exports.createRBDResponse = async (journey) => {
  return {
    Sectors: await Promise.all(
      journey.airSegments.map(convertSegmentForKafila)
    ),
  };
};
