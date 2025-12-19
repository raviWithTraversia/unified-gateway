const {
  createAirPricingRequestBodyForCommonAPI,
} = require("./common-air-pricing.helper");
const { convertSegmentForKafila } = require("./common-search.helper");

module.exports.createFairRulesRequest = (request) => {
  return createAirPricingRequestBodyForCommonAPI(request);
};
module.exports.createFairRuleResponse = async (journey) => {
  return {
    Sectors: await Promise.all(
      journey.airSegments.map(convertSegmentForKafila)
    ),
  };
};
