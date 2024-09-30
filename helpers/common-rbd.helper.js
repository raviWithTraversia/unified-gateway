const {
  createAirPricingRequestBodyForCommonAPI,
} = require("./common-air-pricing.helper");
const { convertSegmentForKafila } = require("./common-search.helper");

module.exports.createRBDRequestBody = (request) => {
  return createAirPricingRequestBodyForCommonAPI(request);
};
module.exports.createRBDResponse = (journey) => {
  return {
    Sectors: journey.airSegments.map(convertSegmentForKafila),
  };
};
