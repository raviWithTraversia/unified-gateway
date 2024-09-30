const {
  createAirPricingRequestBodyForCommonAPI,
} = require("./additional-air-pricing.helper");
const { convertSegmentForKafila } = require("./additional-search.helper");

module.exports.createFairRulesRequest = (request) => {
  return createAirPricingRequestBodyForCommonAPI(request);
};
module.exports.createFairRuleResponse = (journey) => {
  return {
    Sectors: journey.airSegments.map(convertSegmentForKafila),
  };
};
