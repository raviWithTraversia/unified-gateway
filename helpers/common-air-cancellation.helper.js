const moment = require("moment");
const {
  convertTravelTypeForCommonAPI,
  convertItineraryForKafila,
} = require("./common-search.helper");
const {
  convertFlightDetailsForCommonAPI,
} = require("./common-air-pricing.helper");
const { getVendorList } = require("./credentials");

function createAirCancellationRequestBodyForCommonAPI(request, pnrResponse) {
  try {
    const reqItinerary = request.Itinerary?.[0];
    const reqSegment = request.Segments?.[0];
    if (!reqItinerary || !reqSegment)
      throw new Error(
        "Invalid request data 'Itinerary[]' or 'Segment[]' missing"
      );

    const requestBody = {
      typeOfTrip: request.TypeOfTrip || "ONEWAY",
      travelType: request.TravelType?.toUpperCase().startsWith("DOM")
        ? "DOM"
        : request.TravelType,
      credentialType: request.Authentication?.CredentialType || null,
      traceId: request.Itinerary[0].TraceId,
      companyId: request.Authentication?.CompanyId || "000000",
      recLoc: {
        type: "GDS",
        pnr: request.PNR,
      },
      cancelType: request.CancelType,
      cancelRemarks: request.Reason?.Reason,
      travellerDetails: request?.passengarList
        ? travellerDetailsForCancellation(
            request.passengarList,
            pnrResponse.travellerDetails
          )
        : [],
      airSegments: [],
      provider: request.Provider,
      gstDetails: {},
      agencyInfo: {},
      cardDetails: {},
      rmFields: [],
      vendorList: getVendorList(request.Authentication?.CredentialType),
      vendorBookingId: request.providerBookingId || "",
    };

    return { requestBody };
  } catch (error) {
    saveLogInFile("cancellation-request-error.json", error.message);
    return { error: error.message };
  }
}

function travellerDetailsForCancellation(travellerData, pnrTravellerData) {
  if (!travellerData || !Array.isArray(travellerData)) return null;

  return travellerData.map(({ PAX_TYPE, FNAME, TTL, LNAME }) => {
    const pax = pnrTravellerData.find((pax) => {
      const fullName = (pax.firstName + " " + pax.lastName).toLowerCase();
      return (
        fullName.includes(FNAME.toLowerCase()) &&
        fullName.includes(LNAME.toLowerCase())
      );
    });
    return {
      travellerId: pax.travellerId,
      type: PAX_TYPE,
      // firstName: `${FNAME} ${TTL}`,
      // lastName: LNAME,
    };
  });
}

async function convertAirCancellationItineraryForCommonAPI({
  response,
  requestBody,
  originalRequest,
}) {
  const reqItinerary = requestBody.journey[0].itinerary[0];
  const journey = response.journey[0];
  const itinerary = journey.itinerary[0];
  const convertedItinerary = await convertItineraryForKafila({
    itinerary,
    idx: 1,
    response,
    uniqueKey: response.uniqueKey,
    apiItinerary: false,
  });
  convertedItinerary.Sectors = convertedItinerary.Sectors.map(
    (sector, idx) => ({
      ...sector,
      Departure: {
        ...sector.Departure,
        DateTimeStamp:
          originalRequest.Itinerary[0].Sectors[idx].Departure.DateTimeStamp,
      },
      Arrival: {
        ...sector.Arrival,
        DateTimeStamp:
          originalRequest.Itinerary[0].Sectors[idx].Arrival.DateTimeStamp,
      },
    })
  );
  const flightDetailKey = convertedItinerary.apiItinerary
    ? "apiItinerary"
    : "SelectedFlight";

  convertedItinerary[flightDetailKey].DDate =
    convertedItinerary.Sectors[0].Departure.DateTimeStamp;
  convertedItinerary[flightDetailKey].ADate =
    convertedItinerary.Sectors[0].Arrival.DateTimeStamp;

  convertedItinerary[flightDetailKey].Itinerary = convertedItinerary[
    flightDetailKey
  ].Itinerary.map((itinerary, idx) => ({
    ...itinerary,
    DDate: convertedItinerary.Sectors[idx].Departure.DateTimeStamp,
    ADate: convertedItinerary.Sectors[idx].Arrival.DateTimeStamp,
  }));
  if (!convertedItinerary.TravelTime) {
    convertedItinerary.TravelTime = originalRequest.Itinerary[0].TravelTime;
  }
  if (!convertedItinerary.FlyingTime) {
    convertedItinerary.FlyingTime = originalRequest.Itinerary[0].FlyingTime;
  }
  convertedItinerary.FareDifference = calculateFareDifference({
    itinerary,
    reqItinerary,
  });
  convertedItinerary.Error = {
    Status: null,
    Result: null,
    ErrorMessage: "",
    ErrorCode: null,
    Location: "SELL",
    WarningMessage: "",
    IsError: false,
    IsWarning: false,
  };
  convertedItinerary.IsFareUpdate =
    journey.priceChange ?? itinerary.totalPrice !== reqItinerary.totalPrice;
  convertedItinerary.IsAncl = false;

  convertedItinerary.Param = {
    Trip: "D1",
    Adt: originalRequest.PaxDetail.Adults,
    Chd: originalRequest.PaxDetail.Child ?? 0,
    Inf: originalRequest.PaxDetail.Infants ?? 0,
    Sector: originalRequest.Segments.map((segment) => ({
      Src: segment.Origin,
      Des: segment.Destination,
      DDate: segment.DepartureDate,
    })),
    PF: "",
    PC: "",
    Routing: "ALL",
    Ver: "1.0.0.0",
    Auth: {
      AgentId: null,
      Token: null,
    },
    Env: "D",
    Module: "B2B",
    OtherInfo: {
      PromoCode: itinerary.promotionalCode,
      FFlight: "",
      FareType: "",
      TraceId: response.traceId,
      IsUnitTesting: false,
      TPnr: false,
      FAlias: null,
      IsLca: false,
    },
  };
  convertedItinerary.GstData = {
    IsGst: false,
    GstDetails: {
      Name: "",
      Address: "",
      Email: "",
      Mobile: "",
      Pin: "",
      State: "",
      Type: "",
      Gstn: "",
      isAgentGst: false,
    },
  };
  return convertedItinerary;
}

function createAirCancellationChargeRequestBodyForCommonAPI(
  input,
  cancellationType
) {
  return {
    typeOfTrip: input.TypeOfTrip || null,
    travelType: input.TravelType?.toUpperCase().startsWith("DOM")
      ? "DOM"
      : input.TravelType,
    credentialType: input.Authentication?.CredentialType || null,
    traceId: input.Itinerary[0].TraceId,
    companyId: input.Authentication?.CompanyId || "000000",
    recLoc: {
      type: "GDS",
      pnr: input.PNR,
    },
    cancelType: cancellationType === "FULL_CANCELLATION" ? "ALL" : "JOURNEY",
    cancelRemarks: "Cancellation Charge Details",
    travellerDetails: [],
    airSegments: [],
    provider: input.Provider,
    gstDetails: {},
    agencyInfo: {},
    cardDetails: {},
    rmFields: [],
    vendorList: getVendorList(),
    VendorBookingId: input.providerBookingId || "",
  };
}
module.exports = {
  createAirCancellationRequestBodyForCommonAPI,
  createAirCancellationChargeRequestBodyForCommonAPI,
};
