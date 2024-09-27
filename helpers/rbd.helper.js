const {
  createAirPricingRequestBodyForCommonAPI,
} = require("./additional-air-pricing.helper");
const { convertSegmentForKafila } = require("./additional-search.helper");

module.exports.createRBDRequestBody = (request) => {
  return createAirPricingRequestBodyForCommonAPI(request);
};
module.exports.createRBDResponse = (journey) => {
  return {
    Sectors: journey.airSegments.map(convertSegmentForKafila),
  };
};
