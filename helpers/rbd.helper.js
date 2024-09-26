const {
  createAirPricingRequestBodyForCommonAPI,
} = require("./additional-air-pricing.helper");
const { convertSegmentForKafila } = require("./additional-search.helper");

module.exports.createRBDRequestBody = (request) => {
  return createAirPricingRequestBodyForCommonAPI(request);
};
module.exports.createRBDResponse = (response) => {
  return {
    Sectors: response.journey[0].airSegments.map(convertSegmentForKafila),
  };
};
