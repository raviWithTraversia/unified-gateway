module.exports.createRBDRequestBody = (request) => {
  const requestBody = {
    typeOfTrip: request.TypeOfTrip,
    credentialType: request.Authentication?.CredentialType,
    travelType: request.TravelType,
    systemEntity: "TCIL",
    systemName: "Astra2.0",
    corpCode: "",
    requestorCode: "",
    empCode: "",
    uniqueKey: request.Itinerary?.[0]?.UniqueKey,
    traceId: request.Itinerary?.[0]?.TraceId,
  };
  return requestBody;
};
