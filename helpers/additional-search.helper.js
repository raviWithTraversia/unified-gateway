const moment = require("moment");
const uuid = require("uuid");
function createSearchRequestBodyForCommonAPI(request) {
  const uniqueKey = uuid.v4();
  const requestBody = {
    typeOfTrip: request.TypeOfTrip,
    credentialType: request.Authentication.CredentialType,
    travelType: convertTravelTypeForKafila(request.TravelType),
    systemEntity: "TCIL", // !TBD
    systemName: "Astra2.0", // !TBD
    corpCode: "", // !TBD
    requestorCode: "", // !TBD
    empCode: "", // !TBD
    uniqueKey: uniqueKey,
    sectors: request.Segments.map((segment) => ({
      origin: segment.Origin,
      destination: segment.Destination,
      departureDate: moment(segment.DepartureDate).format("DD-MM-YYYY"),
      departureTimeFrom: segment.DepartureTime,
      departureTimeTo: segment.DepartureTimeTo,
      cabinClass: segment.ClassOfService,
    })),
    paxDetail: {
      adults: request.PaxDetail.Adults,
      children: request.PaxDetail.Child ?? 0,
      infants: request.PaxDetail.Infants ?? 0,
      youths: request.PaxDetail.Youths ?? 0,
    },
    maxStops: request.Direct == 0 ? 0 : 3,
    maxResult: 250,
    returnSpecialFare: false,
    refundableOnly: request.RefundableOnly,
    airlines: request.Airlines,
  };
  return { uniqueKey, requestBody };
}
function convertTravelTypeForKafila(travelType) {
  return travelType.toLowerCase().includes("dom") ? "DOM" : "INT";
}

function convertItineraryForKafila({
  itinerary,
  idx,
  response,
  uniqueKey,
  apiItinerary = true,
}) {
  const convertedItinerary = {
    UniqueKey: uniqueKey,
    FreeSeat: itinerary.freeSeat,
    FreeMeal: itinerary.freeMeal,
    SessionKey: itinerary.sessionKey,
    CarbonEmission: itinerary.carbonEmission,
    InPolicy: itinerary.inPolicy,
    IsRecommended: itinerary.isRecommended,
    UID: itinerary.uid,
    BaseFare: itinerary.baseFare,
    Taxes: Number(itinerary.taxes) || 0,
    TotalPrice: itinerary.totalPrice,
    GrandTotal: itinerary.totalPrice,
    Currency: "INR",
    FareType: itinerary.fareType,
    Stop: itinerary.airSegments.length - 1,
    IsVia: itinerary.airSegments.length > 1,
    TourCode: "",
    PricingMethod: "",
    FareFamily: itinerary.fareFamily,
    PromotionalFare: !!itinerary.promotionalCode,
    FareFamilyDN: null,
    PromotionalCode: itinerary.promotionalCode,
    PromoCodeType: itinerary.promoCodeType,
    RefundableFare: itinerary.refundableFare,
    IndexNumber: itinerary.indexNumber,
    Provider: itinerary.provider,
    ValCarrier: itinerary.valCarrier,
    LastTicketingDate: "",
    TravelTime: sumDurationForKafila(itinerary.airSegments),
    PriceBreakup: [
      passengerPriceBreakupForKafila("ADT", itinerary.priceBreakup),
      //   passengerPriceBreakupForKafila("YTH", itinerary.priceBreakup),
      passengerPriceBreakupForKafila("CHD", itinerary.priceBreakup),
      passengerPriceBreakupForKafila("INF", itinerary.priceBreakup),
    ],
    Sectors: itinerary.airSegments.map(convertSegmentForKafila),
    FareRule: defaultFareRuleForKafila,
    HostTokens: null,
    Key: itinerary.key,
    SearchID: response?.journey?.[0]?.journeyKey,
    TRCNumber: null,
    TraceId: response.traceId,
    OI: null,
  };
  convertedItinerary[apiItinerary ? "apiItinerary" : "SelectedFlight"] = {
    PId: idx,
    Id: idx,
    TId: idx,
    Src: response.origin,
    Des: response.destination,
    FCode: itinerary.airSegments[0].airlineCode,
    FName: itinerary.airSegments[0].airlineName,
    FNo: itinerary.airSegments[0].fltNum,
    DDate: `${formatDateForKafila(itinerary.airSegments[0].departure.date)}T${
      itinerary.airSegments[0].departure.time
    }:00`,
    ADate: `${formatDateForKafila(itinerary.airSegments.at(-1).arrival.date)}T${
      itinerary.airSegments.at(-1).arrival.time
    }:00`,
    Dur: sumDurationForKafila(itinerary.airSegments),
    Stop: itinerary.airSegments.length - 1,
    Seats: itinerary.airSegments[0].noSeats,
    Sector: `${response?.journey?.[0]?.origin},${response?.journey?.[0]?.destination}`,
    Itinerary: itinerary.airSegments.map((segment, idx) => ({
      Id: idx,
      Src: segment.departure.code,
      SrcName: segment.departure.cityName,
      Des: segment.arrival.code,
      DesName: segment.arrival.cityName,
      FLogo: "",
      FCode: segment.airlineCode,
      FName: segment.airlineName,
      FNo: segment.fltNum,
      DDate: `${formatDateForKafila(segment.departure.date)}T${
        segment.departure.time
      }:00`,
      ADate: `${formatDateForKafila(segment.arrival.date)}T${
        segment.arrival.time
      }:00`,
      DTrmnl: segment.departure.terminal,
      ATrmnl: segment.arrival.terminal,
      DArpt: segment.departure.name,
      AArpt: segment.arrival.name,
      Dur: sumDurationForKafila([segment]),
      layover: "",
      Seat: segment.noSeats,
      FClass: segment.classofService,
      PClass: segment.productClass,
      FBasis: segment.fareBasisCode,
      FlightType: "",
      OI: null,
    })),
    Fare: {
      GrandTotal: itinerary.totalPrice,
      BasicTotal: itinerary.baseFare,
      YqTotal: 0,
      TaxesTotal: Number(itinerary.taxes) || 0,
      Adt: priceBreakupForKafilaAPI("ADT", itinerary.priceBreakup),
      Chd: priceBreakupForKafilaAPI("CHD", itinerary.priceBreakup),
      Inf: priceBreakupForKafilaAPI("INF", itinerary.priceBreakup),
      OI: null,
    },
    FareRule: defaultFareRuleForKafila,
    Alias: itinerary.fareFamily,
    FareType: null,
    PFClass: null,
    OI: null,
    Offer: null,
    Deal: {
      NETFARE: itinerary.totalPrice,
      TDISC: 0,
      TDS: 0,
      GST: 0,
      DISCOUNT: {
        DIS: 0,
        SF: 0,
        PDIS: 0,
        CB: 0,
      },
    },
  };
  return convertedItinerary;
}

const defaultFareRuleForKafila = {
  CBNBG: null,
  CHKNBG: null,
  CBH: null,
  CWBH: null,
  RBH: null,
  RWBH: null,
  CBHA: null,
  CWBHA: null,
  RBHA: null,
  RWBHA: null,
  SF: null,
};

function sumDurationForKafila(airSegments = [], type = "travelTime") {
  console.dir({ airSegments, type }, { depth: null });
  const duration = airSegments.reduce(
    (acc, segment) => {
      if (!segment[type]) return acc;
      const [hours, minutes] = segment[type].split(":").map((n) => Number(n));
      acc.hours += hours;
      acc.minutes += minutes;

      while (acc.m >= 60) {
        acc.hours += 1;
        acc.minutes -= 60;
      }
      while (acc.hours >= 24) {
        acc.days += 1;
        acc.hours -= 24;
      }
      return acc;
    },
    { days: 0, hours: 0, minutes: 0 }
  );
  if (duration.days === 0 && duration.hours === 0 && duration.minutes === 0)
    return "";

  return `${duration.days}d:${duration.hours}h:${duration.minutes}m`;
}
function formatDateForKafila(dateString) {
  return moment(dateString, "DD/MM/YYYY").format("YYYY-MM-DD");
}

function convertFlightDetailsForKafila(flight) {
  if (!flight) return {};
  const date = formatDateForKafila(flight.date);

  return {
    Terminal: flight.terminal,
    Date: date,
    Time: flight.time,
    Day: moment(date).format("dddd"),
    DateTimeStamp: `${date}T${flight.time}:00`,
    Code: flight.code,
    Name: flight.name,
    CityCode: flight.cityCode,
    CityName: flight.cityName,
    CountryCode: flight.countryCode,
    CountryName: flight.countryName,
  };
}

function convertSegmentForKafila(segment) {
  return {
    IsConnect: segment.isConnect ?? false,
    AirlineCode: segment.airlineCode ?? "",
    AirlineName: segment.airlineName ?? "",
    Class: segment.classofService ?? "",
    CabinClass: segment.cabinClass ?? "",
    BookingCounts: segment.bookingCounts ?? "", // missing
    NoSeats: segment.noSeats ?? "",
    FltNum: segment.fltNum ?? "",
    EquipType: segment.equipType ?? "",
    FlyingTime: sumDurationForKafila([segment], "flyingTime"),
    TravelTime: sumDurationForKafila([segment]),
    TechStopOver: null, // missing
    layover: "", // missing
    Status: "", // missing
    OperatingCarrier: segment.operatingCarrier?.code ?? null,
    MarketingCarrier: null,
    BaggageInfo: segment.baggageInfo ?? "",
    HandBaggage: segment.handBaggage ?? "",
    TransitTime: null,
    MealCode: null,
    key: "",
    Distance: "",
    ETicket: "No",
    ChangeOfPlane: "",
    ParticipantLevel: "",
    OptionalServicesIndicator: false,
    AvailabilitySource: segment.availabilitySource ?? "",
    Group: segment.group ?? "",
    LinkAvailability: false,
    PolledAvailabilityOption: "",
    FareBasisCode: segment.fareBasisCode ?? "",
    HostTokenRef: "",
    APISRequirementsRef: "",
    Departure: convertFlightDetailsForKafila(segment.departure),
    Arrival: convertFlightDetailsForKafila(segment.arrival),
    OI: [],
    ProductClass: segment.productClass ?? "",
  };
}

function passengerPriceBreakupForKafila(type, priceBreakup) {
  const breakup = priceBreakup.find(
    (breakup) => breakup.passengerType === type
  );
  if (!breakup) return {};
  return {
    PassengerType: type,
    NoOfPassenger: breakup.noOfPassenger,
    Tax: Number(breakup.tax) || 0,
    BaseFare: breakup.baseFare,
    TaxBreakup: breakup.taxBreakup.map((tax) => ({
      TaxType: tax.taxType,
      Amount: tax.amount,
    })),
    AirPenalty: breakup.airPenalty,
    CommercialBreakup: [
      {
        CommercialType: "Discount",
        Amount: 0,
        SupplierType: "TMC",
      },
      {
        CommercialType: "TDS",
        onCommercialApply: "Discount",
        Amount: 0,
        SupplierType: "TMC",
      },
    ],
    AgentMarkupBreakup: {
      BookingFee: 0,
      Basic: 0,
      Tax: 0,
    },
    key: null,
    OI: [],
  };
}
function priceBreakupForKafilaAPI(type, priceBreakup) {
  const breakup = priceBreakup.find(
    (breakup) => breakup.passengerType === type
  );
  if (!breakup) return null;
  return {
    Basic: breakup.baseFare,
    Yq: 0,
    Taxes: breakup.tax,
    Total: breakup.baseFare + breakup.Tax,
  };
}

module.exports = {
  createSearchRequestBodyForCommonAPI,
  defaultFareRuleForKafila,
  passengerPriceBreakupForKafila,
  convertSegmentForKafila,
  formatDateForKafila,
  sumDurationForKafila,
  convertItineraryForKafila,
  convertFlightDetailsForKafila,
  convertTravelTypeForKafila,
};
