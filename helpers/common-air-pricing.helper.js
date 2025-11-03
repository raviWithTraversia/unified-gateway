const moment = require("moment");
const {
  convertTravelTypeForCommonAPI,
  convertItineraryForKafila,
  convertSegmentForKafila,
  getCommonCabinClass,
} = require("./common-search.helper");
const { Config } = require("../configs/config");
const { saveLogInFile } = require("../utils/save-log");
const { getVendorList } = require("./credentials");

function createAirPricingRequestBodyForCommonAPI(request) {
  try {
    const reqItinerary = request.Itinerary?.[0];
    const reqSegment = request.Segments?.[0];

    if (!reqItinerary || !reqSegment)
      throw new Error(
        "Invalid request data 'Itinerary[]' or 'Segment[]' missing"
      );

    const requestBody = {
      typeOfTrip: request.TypeOfTrip,
      credentialType: request.Authentication.CredentialType,
      travelType: convertTravelTypeForCommonAPI(request.TravelType),
      systemEntity: "TCIL",
      systemName: "Astra2.0",
      corpCode: "000000",
      requestorCode: "000000",
      empCode: "000000",
      uniqueKey: reqItinerary.UniqueKey,
      traceId: reqItinerary.TraceId,
      journey: [
        {
          journeyKey: reqItinerary.SearchID,
          origin: reqSegment.Origin,
          destination: reqSegment.Destination,
          itinerary: [
            {
              // uid: reqItinerary.UID,
              uId: reqItinerary.UID,
              indexNumber: reqItinerary.IndexNumber,
              provider: reqItinerary.Provider,
              promoCodeType: reqItinerary.PromoCodeType,
              dealCode: reqItinerary.DealCode || "", // !TBD
              officeId: reqItinerary.OfficeId || "",
              hostTokens: reqItinerary.HostTokens || [],
              errors: reqItinerary.Errors || [],
              airSegments: reqItinerary.Sectors.map((sector) => ({
                travelTime: convertDurationForCommonAPI(sector.TravelTime),
                airlineCode: sector.AirlineCode,
                airlineName: sector.AirlineName,
                flyingTime: convertDurationForCommonAPI(sector.FlyingTime),
                departure: convertFlightDetailsForCommonAPI(sector.Departure),
                arrival: convertFlightDetailsForCommonAPI(sector.Arrival),
                operatingCarrier: sector.OperatingCarrier
                  ? { code: sector.OperatingCarrier }
                  : null,
                fltNum: sector.FltNum,
                flightNumber: sector.FltNum,
                // equipType: sector.EquipType,
                equipmentType: sector.EquipType,
                group: sector.Group,
                baggageInfo: sector.BaggageInfo,
                handBaggage: sector.HandBaggage,
                offerDetails: sector?.HostTokenRef?.length
                  ? (() => {
                      try {
                        return JSON.parse(sector?.HostTokenRef);
                      } catch (error) {
                        return "";
                      }
                    })()
                  : "",
                classofService: sector.Class,
                classOfService: sector.Class,
                cabinClass: getCommonCabinClass(sector.CabinClass),
                productClass: sector.ProductClass,
                noSeats: sector.NoSeats,
                fareBasis: sector.FareBasisCode,
                fareFamily: sector.FareFamily,
                // fareBasisCode: sector.FareBasisCode,
                fareBasisCode: sector.FareBasisCode,
                fareType: sector.FareType,
                rbds: sector.BookingCounts,
                // technicalStops: sector.technicalStops || [],
                // transitTime: sector.TransitTime,
                brand: sector.Brand,
                availabilitySource: sector.AvailabilitySource,
                isConnect: sector.IsConnect,
                key: sector.key,
                segRef: sector.key,
                status: sector.Status,
                noOfSeats: sector.NoOfSeats,
              })),
              priceBreakup: convertPriceBreakupForCommonAPI(
                reqItinerary.PriceBreakup
              ),
              freeSeat: reqItinerary.FreeSeat,
              freeMeal: reqItinerary.FreeMeal,
              carbonEmission: reqItinerary.CarbonEmission,
              baseFare: reqItinerary.BaseFare,
              taxes: reqItinerary.Taxes,
              totalPrice: reqItinerary.TotalPrice,
              currency: reqItinerary.Currency ?? "INR",
              valCarrier: reqItinerary.ValCarrier,
              refundableFare: reqItinerary.RefundableFare,
              sessionKey: reqItinerary.SessionKey,
              fareType: reqItinerary.FareType,
              promotionalCode: reqItinerary.PromotionalCode,
              fareFamily: reqItinerary.FareFamily,
              key: reqItinerary.Key,
              inPolicy: reqItinerary.InPolicy,
              isRecommended: reqItinerary.IsRecommended,
            },
          ],
        },
      ],
      vendorList: getVendorList(),
    };
    return { requestBody };
  } catch (error) {
    return { error: error.message };
  }
}

function convertAirPricingItineraryForCommonAPI({
  response,
  requestBody,
  originalRequest,
}) {
  const reqItinerary = requestBody.journey[0].itinerary[0];
  const journey = response.journey[0];
  const itinerary = journey.itinerary[0] || journey.itinerary;
  const convertedItinerary = convertItineraryForKafila({
    itinerary,
    idx: 1,
    response,
    uniqueKey: response.uniqueKey,
    apiItinerary: false,
  });
  // convertedItinerary.Sectors = convertedItinerary.Sectors.map(
  //   (sector, idx) => ({
  //     ...sector,
  //     Departure: {
  //       ...sector.Departure,
  //       // DateTimeStamp:
  //       // originalRequest.Itinerary[0].Sectors[idx].Departure.DateTimeStamp,
  //     },
  //     Arrival: {
  //       ...sector.Arrival,
  //       // DateTimeStamp:
  //       // originalRequest.Itinerary[0].Sectors[idx].Arrival.DateTimeStamp,
  //     },
  //   })
  // );
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
    IsGst: !!originalRequest.GstDetails,
    GstDetails: originalRequest.GstDetails,
  };
  return convertedItinerary;
}

async function convertSSRItineraryForCommonAPI({
  responseMealOrBaggage,
  responseSeat,
  requestBody,
  originalRequest,
}) {
  const reqItinerary = requestBody.journey[0].itinerary[0];

  const journey = responseMealOrBaggage.journey[0];
  const itinerary = journey.itinerary[0] || journey.itinerary;

  const isDOM_AI =
    (reqItinerary?.valCarrier === "AI" ||
      reqItinerary?.airSegments?.[0]?.airlineCode === "AI") &&
    requestBody.travelType === "DOM";

  if (!itinerary.ssrInfo) {
    itinerary.ssrInfo = {
      baggage: [],
      fastForward: [],
      meal: [],
    };
  }

  // if (isDOM_AI) {
  //   itinerary.ssrInfo.meal = itinerary.airSegments.flatMap((segment) =>
  //     Config.AI_MEALS.map((meal) => {
  //       meal.flightNumber = segment.fltNum;
  //       meal.origin = segment.departure.code;
  //       meal.destination = segment.arrival.code;
  //       return meal;
  //     })
  //   );
  // }

  let allSegmentsOfSeatMap = [];
  let allSeatsList = [];

  if (
    responseSeat?.journey[0]?.itinerary?.length ||
    responseSeat?.journey[0]?.itinerary?.airSegments
  ) {
    allSegmentsOfSeatMap =
      responseSeat?.journey[0]?.itinerary[0]?.airSegments ||
      responseSeat?.journey[0]?.itinerary?.airSegments;
  }
  const convertedSSRResponse = {};

  convertedSSRResponse.FareBreakup = calculateFareDifference({
    itinerary,
    reqItinerary,
  });
  convertedSSRResponse.Error = {
    Status: null,
    Result: null,
    ErrorMessage: "",
    ErrorCode: null,
    Location: "SELL",
    WarningMessage: "",
    IsError: false,
    IsWarning: false,
  };
  convertedSSRResponse.IsFareUpdate =
    journey.priceChange ?? itinerary.totalPrice !== reqItinerary.totalPrice;
  convertedSSRResponse.IsAncl = false;

  const paxDetails = {
    adults: 0,
    children: 0,
    infants: 0,
  };
  itinerary?.priceBreakup?.forEach((breakup) => {
    switch (breakup.passengerType) {
      case "ADT":
        paxDetails.adults = Number(breakup.noOfPassenger);
        break;
      case "CHD":
        paxDetails.children = Number(breakup.noOfPassenger);
        break;
      case "INF":
        paxDetails.infants = Number(breakup.noOfPassenger);
        break;
    }
  });
  convertedSSRResponse.Param = {
    Trip: "D1",
    Adt: paxDetails.adults,
    Chd: paxDetails.children,
    Inf: paxDetails.infants,
    Sector: itinerary.airSegments.map(convertSegmentForKafila),
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
      TraceId: responseMealOrBaggage.traceId,
      IsUnitTesting: false,
      TPnr: false,
      FAlias: null,
      IsLca: false,
    },
  };
  convertedSSRResponse.GstData = {
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
  allSeatsList = await prePareCommonSeatMapResponseForKafila(
    allSegmentsOfSeatMap
  );

  if (!itinerary.ssrInfo?.meal.length) {
    itinerary.ssrInfo.meal =
      itinerary.airSegments.flatMap(
        (segment) => segment?.ssrInfo?.meal || []
      ) || [];
  }

  itinerary.ssrInfo.baggage =
    itinerary.ancillaries.flatMap((ancillary) => ancillary.baggage || []) || [];

  itinerary.ssrInfo.fastForward =
    itinerary.ancillaries.flatMap((ancillary) => ancillary.fastForward || []) ||
    [];

  convertedSSRResponse.Ancl = {
    Baggage:
      itinerary?.ssrInfo?.baggage?.map((baggage) => ({
        Complmnt: false,
        Paid: baggage?.paid || false,
        Currency: baggage?.currency || "INR",
        FCode: baggage?.airlineCode,
        FNo: baggage?.flightNumber || "INR",
        OI: baggage?.code || "INR",
        Price: baggage?.amount || 0,
        SsrCode: baggage?.code || "",
        SsrDesc: baggage?.name || "",
        SsrFor: "Journey",
        Trip: baggage?.wayType,
        Src: baggage.origin,
        Des: baggage.destination,
      })) || [],
    FastForward:
      itinerary?.ssrInfo?.fastForward?.map((fastForward) => ({
        Complmnt: false,
        Paid: fastForward?.paid || false,
        Currency: fastForward?.currency || "INR",
        FCode: fastForward?.airlineCode,
        FNo: fastForward?.flightNumber || "INR",
        OI: fastForward?.code || "INR",
        Price: fastForward?.amount || 0,
        SsrCode: fastForward?.code || "",
        SsrDesc: fastForward?.name || "",
        SsrFor: "Journey",
        Trip: fastForward?.wayType,
        Src: fastForward.origin,
        Des: fastForward.destination,
      })) || [],
    Meals:
      itinerary?.ssrInfo.meal?.map((meal) => ({
        Complmnt: false,
        Paid: meal?.paid || false,
        Currency: meal?.currency || "INR",
        FCode: meal?.airlineCode,
        FNo: meal?.flightNumber || "INR",
        OI: meal?.code || "INR",
        Price: meal?.amount || 0,
        SsrCode: meal?.code || "",
        SsrDesc: meal?.name || "",
        SsrFor: "Journey",
        Trip: meal?.wayType,
        Src: meal.origin,
        Des: meal.destination,
      })) || [],
    Seat: {
      SeatRow: allSeatsList || [],
    },
    Specials: [],
  };
  return convertedSSRResponse;
}

function calculateFareDifference({ itinerary, reqItinerary }) {
  return {
    FareDifference: itinerary.totalPrice - reqItinerary.totalPrice,
    NewFare: itinerary.totalPrice,
    OldFare: reqItinerary.totalPrice,
    Journeys: [
      {
        Security: "",
        IPaxkey: "",
        TotalFare: itinerary.totalPrice,
        BasicTotal: itinerary.baseFare,
        YqTotal: 0,
        TaxTotal: itinerary.taxes,
        Segments: [
          airPricingBreakupForKafila("ADT", itinerary.priceBreakup),
          airPricingBreakupForKafila("CHD", itinerary.priceBreakup),
          airPricingBreakupForKafila("INF", itinerary.priceBreakup),
        ],
      },
    ],
  };
}
function convertDurationForCommonAPI(timeString) {
  if (!timeString) return "";
  let [days, hours, minutes] = timeString
    ?.split?.(":")
    ?.map?.((time) => time.slice(0, time.length - 1).padStart(2, "0"));
  return `${hours}:${minutes}`;
}

function convertFlightDetailsForCommonAPI(flight) {
  return {
    code: flight.Code,
    terminal: flight.Terminal,
    date: formatDateForCommonAPI(flight.Date),
    name: flight.Name,
    cityCode: flight.CityCode,
    cityName: flight.CityName,
    countrycode: flight.CountryCode,
    countryCode: flight.CountryCode,
    countryName: flight.CountryName,
    time: flight.Time,
  };
}

function convertPriceBreakupForCommonAPI(breakups) {
  breakups = breakups.reduce(
    (acc, breakup) => {
      if (!breakup.PassengerType) return acc;
      acc[breakup.PassengerType] = {
        passengerType: breakup.PassengerType,
        noOfPassenger: breakup.NoOfPassenger,
        baseFare: breakup.BaseFare,
        tax: breakup.Tax,
        taxBreakup: breakup.TaxBreakup.map((tax) => ({
          amount: tax.Amount,
          taxType: tax.TaxType,
        })),
        airPenalty: breakup.AirPenalty,
        // key: breakup?.key || "",
        fareCalc: breakup.key,
      };
      return acc;
    },
    {
      ADT: null,
      CHD: null,
      INF: null,
      YTH: null,
    }
  );
  const breakupArray = [];
  ["ADT", "YTH", "CHD", "INF"].forEach((key) => {
    if (breakups[key]) breakupArray.push(breakups[key]);
  });
  return breakupArray;
}
function formatDateForCommonAPI(dateString) {
  return moment(dateString, "YYYY-MM-DD").format("DD/MM/YYYY");
}

function airPricingBreakupForKafila(type, priceBreakup) {
  const breakup = priceBreakup?.find(
    (breakup) => breakup.passengerType === type
  );
  if (!breakup) return {};
  return {
    PaxType: type,
    TaxBreakup: [
      {
        CType: "FarePrice",
        CCode: "",
        Amt: breakup.baseFare,
      },
      ...breakup.taxBreakup.map((tax) => ({
        CType: tax.taxType,
        CCode: tax.taxType,
        Amt: tax.amount,
      })),
    ],
  };
}

async function prePareCommonSeatMapResponseForKafila(allSegmentsList) {
  const seatMapRowColumnList = [];
  let facilitiesArrayList = [];
  if (!allSegmentsList?.length) return;
  await allSegmentsList.forEach((segmentsList) => {
    segmentsList?.seatRows?.forEach?.((seatRows) => {
      facilitiesArrayList = [];
      seatRows?.facilities?.forEach?.((seatFacilities, seatIdx) => {
        const {
          type,
          seatCode,
          availability,
          currency,
          amount,
          compartment,
          key,
          deck,
          characteristics,
          paid,
        } = seatFacilities;
        if (seatCode) {
          let DDate = "",
            ssrProperty = [];
          if (segmentsList?.departure?.date) {
            DDate =
              moment(
                segmentsList.departure.date + "T" + segmentsList.departure.time,
                "DD-MM-YYYYTHH:mm:ss"
              ).format("YYYY-MM-DDTHH:mm") + ":00.000Z";
            // DDate = DDate + "T00:00:00.000Z";
          }
          if (
            seatRows?.facilities?.[seatIdx - 1]?.type === "Aisle" ||
            seatRows?.facilities?.[seatIdx + 1]?.type === "Aisle" ||
            (characteristics?.length && characteristics.includes("Aisle seat"))
          ) {
            ssrProperty.push({
              SKey: "AISLE",
              SValue: "True",
            });
          }
          // if (characteristics?.length && characteristics.includes("Aisle seat"))
          //   ssrProperty.push({
          //     SKey: "AISLE",
          //     SValue: "True",
          //   });
          facilitiesArrayList.push({
            Compartemnt: compartment,
            Type: type || "Seat",
            Seatcode: seatCode,
            Availability: availability == "Open" ? true : false,
            // Availability: availability == "Available" ? true : false,
            Paid: paid,
            Currency: currency,
            Characteristics: characteristics,
            TotalPrice: amount,
            Key: key,
            FCode: segmentsList?.airlineCode || "",
            FNo: segmentsList?.flightNumber || "",
            FType: "",
            Src:
              segmentsList?.origin?.code || segmentsList?.departure?.code || "",
            Des:
              segmentsList?.destination?.code ||
              segmentsList?.arrival?.code ||
              "",
            Group: segmentsList.group || "",
            DDate: DDate,
            Deck: deck,
            SsrProperty: ssrProperty,
          });
        }
      });
      if (facilitiesArrayList?.length) {
        seatMapRowColumnList.push({
          Number: seatRows?.number,
          Facilities: facilitiesArrayList,
        });
      }
    });
  });

  return seatMapRowColumnList;
}

async function getPnrTicketCommonAPIBody(request) {
  // const reqItinerary = request.Itinerary?.[0];
  const reqSegment = request.Segments?.[0];

  if (!reqSegment)
    throw new Error(
      "Invalid request data 'Itinerary[]' or 'Segment[]' missing"
    );
  const data = [];
  for (var reqItinerary of request.Itinerary) {
    data.push({
      typeOfTrip: request.TypeOfTrip,
      credentialType: request.Authentication.CredentialType,
      travelType: convertTravelTypeForCommonAPI(request.TravelType),
      systemEntity: "TCIL",
      systemName: "Astra2.0",
      corpCode: "000000",
      requestorCode: "000000",
      empCode: "000000",
      uniqueKey: reqItinerary.UniqueKey,
      traceId: reqItinerary.TraceId,
      journey: [
        {
          journeyKey: reqItinerary.SearchID,
          origin: reqSegment.Origin,
          destination: reqSegment.Destination,
          provider: reqItinerary.Provider,
          itinerary: [
            {
              recordLocator: reqItinerary.PNR,
            },
          ],
        },
      ],
      version: "1",
    });
  }

  saveLogInFile("pnr-ticket-req.json", data);
  return data;
}
module.exports = {
  createAirPricingRequestBodyForCommonAPI,
  convertDurationForCommonAPI,
  convertFlightDetailsForCommonAPI,
  convertPriceBreakupForCommonAPI,
  formatDateForCommonAPI,
  convertAirPricingItineraryForCommonAPI,
  convertSSRItineraryForCommonAPI,
  getPnrTicketCommonAPIBody,
};
