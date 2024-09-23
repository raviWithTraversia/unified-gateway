const moment = require("moment");
const {
  convertTravelTypeForKafila,
  convertItineraryForKafila,
} = require("./additional-search.helper");

function createAirPricingRequestBodyForCommonAPI(request) {
  const reqItinerary = request.Itinerary[0];
  const reqSegment = request.Segments[0];

  const requestBody = {
    typeOfTrip: request.TypeOfTrip,
    credentialType: request.Authentication.CredentialType,
    travelType: convertTravelTypeForKafila(request.TravelType),
    systemEntity: "TCIL",
    systemName: "Astra2.0",
    corpCode: "",
    requestorCode: "",
    empCode: "",
    uniqueKey: reqItinerary.UniqueKey,
    traceId: reqItinerary.TraceId,
    journey: [
      {
        journeyKey: reqItinerary.SearchID,
        origin: reqSegment.Origin,
        destination: reqSegment.Destination,
        itinerary: [
          {
            uid: reqItinerary.UID,
            indexNumber: reqItinerary.IndexNumber,
            provider: reqItinerary.Provider,
            promoCodeType: reqItinerary.PromoCodeType,
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
              equipType: sector.EquipType,
              group: sector.Group,
              baggageInfo: sector.BaggageInfo,
              handBaggage: sector.HandBaggage,
              offerDetails: null,
              classofService: sector.Class,
              cabinClass: sector.CabinClass,
              productClass: sector.ProductClass,
              noSeats: sector.Seats,
              fareBasisCode: sector.FareBasisCode,
              availabilitySource: sector.AvailabilitySource,
              isConnect: sector.IsConnect,
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
  };
  return requestBody;
}

function convertAirPricingItineraryForCommonAPI({
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
  if (!convertedItinerary.TravelTime) {
    convertedItinerary.TravelTime = originalRequest.Itinerary[0].TravelTime;
  }
  if (!convertedItinerary.FlyingTime) {
    convertedItinerary.FlyingTime = originalRequest.Itinerary[0].FlyingTime;
  }
  convertedItinerary.FareDifference +
    calculateFareDifference({
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
    itinerary.totalPrice !== reqItinerary.totalPrice;
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
    countryName: flight.CountryName,
    time: flight.Time,
  };
}

function convertPriceBreakupForCommonAPI(breakups) {
  console.log({ breakups });
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
  const breakup = priceBreakup.find(
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

module.exports = {
  createAirPricingRequestBodyForCommonAPI,
  convertDurationForCommonAPI,
  convertFlightDetailsForCommonAPI,
  convertPriceBreakupForCommonAPI,
  formatDateForCommonAPI,
  convertAirPricingItineraryForCommonAPI,
};
