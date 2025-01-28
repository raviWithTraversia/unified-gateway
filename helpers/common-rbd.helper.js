const {
  createAirPricingRequestBodyForCommonAPI,getPnrTicketCommonAPIBody
} = require("./common-air-pricing.helper");
const { convertSegmentForKafila } = require("./common-search.helper");

module.exports.createRBDRequestBody = (request) => {
  return createAirPricingRequestBodyForCommonAPI(request);
};

module.exports.createPnrTicketRequestBody=async(request)=>{
return getPnrTicketCommonAPIBody(request)
}

module.exports.createRBDResponse = (journey) => {
  return {
    Sectors: journey.airSegments.map(convertSegmentForKafila),
  };
};
