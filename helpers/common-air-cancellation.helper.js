const moment = require("moment");
const {
  convertTravelTypeForCommonAPI,
  convertItineraryForKafila,
} = require("./common-search.helper");
const {
  convertFlightDetailsForCommonAPI,
} = require("./common-air-pricing.helper");

function createAirCancellationRequestBodyForCommonAPI(request) {
  try {
    const reqItinerary = request.Itinerary?.[0];
    const reqSegment = request.Segments?.[0];
    if (!reqItinerary || !reqSegment)
      throw new Error(
        "Invalid request data 'Itinerary[]' or 'Segment[]' missing"
      );

    const requestBody = {
      typeOfTrip: request?.TypeOfTrip,
      credentialType: request?.Authentication?.CredentialType,
      travelType: convertTravelTypeForCommonAPI(request?.TravelType),
      systemEntity: "TCIL",
      systemName: "Astra2.0",
      corpCode: "000000",
      requestorCode: "000000",
      empCode: "000000",
      uniqueKey: reqItinerary?.UniqueKey,
      traceId: reqItinerary?.TraceId,
      journey: [
        {
          origin: reqSegment?.Departure?.Code,
          provider: reqItinerary?.Provider,
          destination: reqSegment?.Arrival?.Code,
          itinerary: [
            {
              recordLocator: request?.PNR,
              cancelRemarks: request?.Reason?.Reason
                ? `${request?.Reason?.Reason} ${request.Reason.Scenarios ?? ""}`
                    .replace(/[^a-zA-Z0-9 ]/g, "")
                    .slice(0, 65) // ? 1A supports only 65 characters cancellation remark with no special characters
                : "",
              cancelType: request?.CancelType || "",
              airSegments: null,
              travellerDetails: request?.passengarList
                ? travellerDetailsForCancellation(request.passengarList)
                : null,
            },
          ],
        },
      ],
    };
    // if (request.CancelType !== "ALL") {
    //   request.journey[0].itinerary[0].airSegments = request.Segments.map(
    //     (sector) => ({
    //       airlineCode: sector?.AirlineCode,
    //       departure: convertFlightDetailsForCommonAPI(sector?.Departure),
    //       arrival: convertFlightDetailsForCommonAPI(sector?.Arrival),
    //       operatingCarrier: reqItinerary?.ValCarrier
    //         ? { code: reqItinerary?.ValCarrier }
    //         : null,
    //       fltNum: sector?.FltNum,
    //     })
    //   );
    //   request.journey[0].itinerary[0].travellerDetails =
    //     request?.passengarList?.map((traveller, idx) => ({
    //       travellerId: idx + 1,
    //       title: traveller.TTL,
    //       firstName: traveller.FNAME,
    //       lastName: traveller.LNAME,
    //       type: travller.PAX_TYPE,
    //     }));
    // }
    return { requestBody };
  } catch (error) {
    return { error: error.message };
  }
}

function travellerDetailsForCancellation(travellerData) {
  if (!travellerData || !Array.isArray(travellerData)) return null;

  return travellerData.map(({ PAX_TYPE, FNAME, TTL, LNAME }) => ({
    type: PAX_TYPE,
    firstName: `${FNAME} ${TTL}`,
    lastName: LNAME,
  }));
}

function convertAirCancellationItineraryForCommonAPI({
  response,
  requestBody,
  originalRequest,
}) {
  const reqItinerary = requestBody.journey[0].itinerary[0];
  const journey = response.journey[0];
  const itinerary = journey.itinerary[0];
  const convertedItinerary = convertItineraryForKafila({
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


function createAirCancellationChargeRequestBodyForCommonAPI(input) {
  return {
    typeOfTrip: input.TypeOfTrip || null,
    credentialType: input.Authentication?.CredentialType || null,
    travelType: input.TravelType?.toUpperCase().startsWith('DOM') ? 'DOM' : input.TravelType,
    systemEntity: "xxxxxx",
    systemName: "xxxxxx",  
    corpCode: "xxxxxx",         
    requestorCode: "xxxxxx",      
    empCode: "xxxxxx",           
    traceId: input.Itinerary.map((e) => e.TraceId)[0],
    "journey": [

        {

            "provider": input.Provider,

            "origin": "NA",

            "destination": "NA",

            "uid": input.Itinerary.map((e) => e.UID)[0],

            "journeyKey": "ce3540df-c882-4b4a-8e5d-0b1d5109d036",

            "itinerary": [

                {

                    "recordLocator": input.PNR

                }

            ]

        }

    ],

    "version": "2"

    
 || null
  };
}
module.exports = {
  createAirCancellationRequestBodyForCommonAPI,createAirCancellationChargeRequestBodyForCommonAPI
};
