const axios = require("axios");
const uuid = require("uuid");
const moment = require("moment");
const { Config } = require("../configs/config");
// const fs = require("fs");
// const path = require("path");

const getAdditionalFlights = async (request) => {
  try {
    const requestBody = {
      typeOfTrip: request.TypeOfTrip,
      credentialType: request.Authentication.CredentialType,
      travelType: request.TravelType.toLowerCase().includes("dom")
        ? "DOM"
        : "INT",
      systemEntity: "TCIL", // !TBD
      systemName: "Astra2.0", // !TBD
      corpCode: "", // !TBD
      requestorCode: "", // !TBD
      empCode: "", // !TBD
      uniqueKey: uuid.v4(),
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
      maxStops: request.Direct ? 0 : 3,
      maxResult: 250,
      returnSpecialFare: false,
      refundableOnly: request.RefundableOnly,
      airlines: request.Airlines,
    };
    const { data: response } = await axios.post(
      Config[Config.MODE].additionalFlightsBaseURL + "/flight/search",
      requestBody
    );
    console.log({ response });
    // fs.writeFileSync(
    //   path.resolve(__dirname, "response.json"),
    //   JSON.stringify(response, null, 2)
    // );
    //  ? assumption: only one way flights are considered
    const itineraries = response.data.journey[0].itinerary.map(
      (itinerary, idx) =>
        convertItinerary(itinerary, idx, response.data.traceId, response.data)
    );
    // fs.writeFileSync(
    //   path.resolve(__dirname, "converted-response.json"),
    //   JSON.stringify(itineraries, null, 2)
    // );
    return { itineraries };
  } catch (error) {
    return { error: error.message };
  }
};

// getAdditionalFlights({
//   Authentication: {
//     CompanyId: "6555f84c991eaa63cb171a9f",
//     UserId: "65cdfd5203e867cfc4153aa9",
//     CredentialType: "TEST",
//     SalesChannel: null,
//     TraceId: "12343253",
//   },
//   TypeOfTrip: "ONEWAY",
//   Segments: [
//     {
//       Origin: "DEL",
//       Destination: "BOM",
//       OriginName: "Guwahati",
//       DestinationName: "Dehli",
//       DepartureDate: "2025-01-23",
//       DepartureTime: "00:01",
//       DepartureTimeTo: "23:59",
//       ClassOfService: "Economy",
//     },
//   ],
//   PaxDetail: {
//     Adults: 1,
//     Child: 0,
//     Infants: 1,
//     Youths: 0,
//   },
//   Flexi: 0,
//   Direct: 0,
//   ClassOfService: "",
//   Airlines: [],
//   TravelType: "Domestic",
//   FareFamily: [],
//   RefundableOnly: false,
// });

const defaultFareRule = {
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

function convertItinerary(itinerary, idx, traceId, response) {
  return {
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
    PromoCodeType: "",
    RefundableFare: itinerary.refundableFare,
    IndexNumber: itinerary.indexNumber,
    Provider: itinerary.provider,
    ValCarrier: itinerary.valCarrier,
    LastTicketingDate: "",
    TravelTime: sumTravelTime(itinerary.airSegments),
    PriceBreakup: [
      passengerPriceBreakup("ADT", itinerary.priceBreakup),
      //   passengerPriceBreakup("YTH", itinerary.priceBreakup),
      passengerPriceBreakup("CHD", itinerary.priceBreakup),
      passengerPriceBreakup("INF", itinerary.priceBreakup),
    ],
    Sectors: itinerary.airSegments.map(convertSegment),
    FareRule: defaultFareRule,
    apiItinerary: {
      PId: idx,
      Id: idx,
      TId: idx,
      Src: response.origin,
      Des: response.destination,
      FCode: itinerary.airSegments[0].airlineCode,
      FName: itinerary.airSegments[0].airlineName,
      FNo: itinerary.airSegments[0].fltNum,
      DDate: `${formatDate(itinerary.airSegments[0].departure.date)}T${
        itinerary.airSegments[0].departure.time
      }:00`,
      ADate: `${formatDate(itinerary.airSegments.at(-1).arrival.date)}T${
        itinerary.airSegments.at(-1).arrival.time
      }:00`,
      Dur: sumTravelTime(itinerary.airSegments),
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
        DDate: `${formatDate(segment.departure.date)}T${
          segment.departure.time
        }:00`,
        ADate: `${formatDate(segment.arrival.date)}T${segment.arrival.time}:00`,
        DTrmnl: segment.departure.terminal,
        ATrmnl: segment.arrival.terminal,
        DArpt: segment.departure.name,
        AArpt: segment.arrival.name,
        Dur: sumTravelTime([segment]),
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
        Adt: {
          Basic: itinerary.baseFare,
          Yq: 0,
          Taxes: Number(itinerary.taxes) || 0,
          Total: itinerary.totalPrice,
        },
        Chd: null,
        Inf: null,
        OI: null,
      },
      FareRule: defaultFareRule,
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
    },
    HostTokens: null,
    Key: itinerary.key,
    SearchID: "",
    TRCNumber: null,
    TraceId: traceId,
    OI: null,
  };
}

function sumTravelTime(airSegments = []) {
  const totalTravelTime = airSegments.reduce(
    (acc, segment) => {
      const [hours, minutes] = segment.travelTime
        .split(":")
        .map((n) => Number(n));
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
  return `${totalTravelTime.days}d:${totalTravelTime.hours}h:${totalTravelTime.minutes}m`;
}

function passengerPriceBreakup(type, priceBreakup) {
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
function convertSegment(segment) {
  return {
    IsConnect: segment.isConnect,
    AirlineCode: segment.airlineCode,
    AirlineName: segment.airlineName,
    Class: segment.classofService,
    CabinClass: segment.cabinClass,
    BookingCounts: "", // missing
    NoSeats: segment.noSeats,
    FltNum: segment.fltNum,
    EquipType: segment.equipType,
    FlyingTime: sumTravelTime([segment]),
    TravelTime: sumTravelTime([segment]),
    TechStopOver: null, // missing
    layover: "", // missing
    Status: "", // missing
    OperatingCarrier: segment.operatingCarrier?.code ?? null,
    MarketingCarrier: null,
    BaggageInfo: segment.baggageInfo,
    HandBaggage: segment.handBaggage,
    TransitTime: null,
    MealCode: null,
    key: "",
    Distance: "",
    ETicket: "No",
    ChangeOfPlane: "",
    ParticipantLevel: "",
    OptionalServicesIndicator: false,
    AvailabilitySource: segment.availabilitySource,
    Group: segment.group,
    LinkAvailability: false,
    PolledAvailabilityOption: "",
    FareBasisCode: segment.fareBasisCode,
    HostTokenRef: "",
    APISRequirementsRef: "",
    Departure: getFlightDetails(segment, "departure"),
    Arrival: getFlightDetails(segment, "arrival"),
    OI: [],
  };
}

function getFlightDetails(segment, type) {
  if (!segment[type]) return {};
  const date = formatDate(segment[type].date);
  return {
    Terminal: segment[type].terminal,
    Date: date,
    Time: segment[type].time,
    Day: moment(date).format("dddd"),
    DateTimeStamp: `${date}T${segment[type].time}:00`,
    Code: segment[type].code,
    Name: segment[type].name,
    CityCode: segment[type].cityCode,
    CityName: segment[type].cityName,
    CountryCode: segment[type].countryCode,
    CountryName: segment[type].countryName,
  };
}

function formatDate(dateString) {
  return moment(dateString, "DD/MM/YYYY").format("YYYY-MM-DD");
}

module.exports = {
  getAdditionalFlights,
};
