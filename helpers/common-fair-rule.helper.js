const {
  createAirPricingRequestBodyForCommonAPI,
} = require("./common-air-pricing.helper");
const { convertSegmentForKafila } = require("./common-search.helper");

module.exports.createFairRulesRequest = (request) => {
  return createAirPricingRequestBodyForCommonAPI(request);
};
module.exports.createFairRuleResponse = (journey) => {
  return {
    Sectors: journey.airSegments.map(convertSegmentForKafila),
  };
};
