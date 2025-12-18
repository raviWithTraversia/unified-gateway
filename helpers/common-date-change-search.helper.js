const uuid = require("uuid");
const { getVendorList } = require("./credentials");
const { convertTravelTypeForCommonAPI } = require("./common-search.helper");

function createDCSearchRequestBodyForCommonAPI(request) {
  const traceID = request?.Authentication?.TraceId || uuid.v4();
  const requestBody = {
    typeOfTrip: request.TypeOfTrip,
    credentialType: request.Authentication.CredentialType,
    travelType: convertTravelTypeForCommonAPI(request.TravelType),
    traceId: traceID,
    companyId: request.Authentication.CompanyId,
    maxStops: request.Direct == 0 ? 0 : 3,
    maxResult: 250,
    returnSpecialFare: false,
    refundableOnly: request.RefundableOnly || false,
    airlines: request.Airlines || [],
    vendorList: getVendorList(request.Authentication.CredentialType),
    PNR: request.PNR,
    searchType: 1,
    ReissueDates: request.ReissueDates,
    Provider: request.Provider,
  };
  return { uniqueKey: traceID, requestBody };
}
module.exports = {
  createDCSearchRequestBodyForCommonAPI,
};
