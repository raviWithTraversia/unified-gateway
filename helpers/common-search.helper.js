const moment = require("moment");
const uuid = require("uuid");
const { saveLogInFile } = require("../utils/save-log");
const { getVendorList } = require("./credentials");
const { getAirportByCode } = require("../redis/airport.service");
const { getAirlineByCode } = require("../redis/airline.service");

const commonCabinClassMap = {
  ECONOMY: "Economy",
  "BUSINESS CLASS": "Business",
  "FIRST CLASS": "First",
  "PREMIUM ECONOMY": "PremiumEconomy",
};

const kafilaCabinClassMap = {
  ECONOMY: "Economy",
  BUSINESS: "Business Class",
  FIRST: "First Class",
  PREMIUMECONOMY: "Premium Economy",
};

function getCommonCabinClass(kafilaCabinClass) {
  return (
    commonCabinClassMap[kafilaCabinClass.toUpperCase()] ?? kafilaCabinClass
  );
}

function getKafilaCabinClass(commonCabinClass) {
  if (kafilaCabinClassMap[commonCabinClass.toUpperCase()]) {
    return titleCase(kafilaCabinClassMap[commonCabinClass.toUpperCase()]);
  }

  return titleCase(commonCabinClass);
}

function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function createSearchRequestBodyForCommonAPI(request) {
  const uniqueKey = request?.Authentication?.TraceId || uuid.v4();
  const requestBody = {
    typeOfTrip: request.TypeOfTrip,
    credentialType: request.Authentication.CredentialType,
    travelType: convertTravelTypeForCommonAPI(request.TravelType),
    systemEntity: "TCIL", // !TBD
    systemName: "Astra2.0", // !TBD
    corpCode: "000000", // !TBD
    requestorCode: "000000", // !TBD
    empCode: "000000", // !TBD
    uniqueKey: uniqueKey,
    traceId: uniqueKey,
    companyId: request.Authentication.CompanyId,
    sectors: request.Segments.map((segment) => ({
      origin: segment.Origin,
      destination: segment.Destination,
      departureDate: moment(segment.DepartureDate).format("DD-MM-YYYY"),
      departureTimeFrom: segment.DepartureTime,
      departureTimeTo: segment.DepartureTimeTo,
      cabinClass: getCommonCabinClass(segment.ClassOfService),
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
    vendorList: getVendorList(request.Authentication.CredentialType),
  };
  saveLogInFile("search-RQ.json", requestBody);
  return { uniqueKey, requestBody };
}
function convertTravelTypeForCommonAPI(travelType) {
  return travelType.toLowerCase().includes("dom") ? "DOM" : "INT";
}

async function convertItineraryForKafila({
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
    UID: itinerary.uid || itinerary.uId || "",
    BaseFare: itinerary.baseFare,
    Taxes: Number(itinerary.taxes) || 0,
    TotalPrice: itinerary.totalPrice,
    OfferedPrice: itinerary.totalPrice,
    GrandTotal: itinerary.totalPrice,
    Currency: itinerary.currency || "",
    FareType:
      itinerary?.fareType || itinerary?.airSegments?.[0]?.fareType || "",
    Stop: itinerary.airSegments.length - 1,
    IsVia: itinerary.airSegments.length > 1,
    TourCode: "",
    PricingMethod: "",
    FareFamily:
      itinerary?.fareFamily || itinerary?.airSegments?.[0]?.fareFamily || "",
    PromotionalFare: !!itinerary.promotionalCode,
    FareFamilyDN: null,
    PromotionalCode: itinerary.promotionalCode || itinerary.dealCode || "",
    PromoCodeType: itinerary.promoCodeType,
    RefundableFare: itinerary.refundableFare || itinerary.refundable || false,
    IndexNumber: itinerary.indexNumber,
    Provider: itinerary.provider,
    ValCarrier: itinerary.valCarrier,
    LastTicketingDate:
      itinerary.lastTicketingTime || itinerary.lastTicketingDate || "",
    TravelTime: sumDurationForKafila([itinerary.airSegments[0]]),
    PriceBreakup: [
      passengerPriceBreakupForKafila("ADT", itinerary.priceBreakup),
      //   passengerPriceBreakupForKafila("YTH", itinerary.priceBreakup),
      passengerPriceBreakupForKafila("CHD", itinerary.priceBreakup),
      passengerPriceBreakupForKafila("INF", itinerary.priceBreakup),
    ],
    Sectors: await Promise.all(
      itinerary.airSegments.map(convertSegmentForKafila)
    ),
    FareRule: null,
    HostTokens: itinerary.hostTokens || [],
    Key: itinerary.key,
    SearchID: response?.journey?.[0]?.journeyKey,
    TRCNumber: null,
    TraceId: response.traceId,
    OI: null,
    OfficeId: itinerary.officeId || "",
    Errors: itinerary.errors || [],
  };

  convertedItinerary[apiItinerary ? "apiItinerary" : "SelectedFlight"] = {
    PId: idx,
    Id: idx,
    TId: idx,
    Src: response.origin,
    Des: response.destination,
    FCode: itinerary?.airSegments[0]?.airlineCode,
    FName: itinerary?.airSegments[0]?.airlineName,
    FNo: itinerary?.airSegments[0]?.fltNum,
    DDate: `${formatDateForKafila(
      itinerary?.airSegments[0]?.departure?.date
    )}T${itinerary?.airSegments[0]?.departure?.time}:00`,
    ADate: `${formatDateForKafila(
      itinerary?.airSegments.at(-1)?.arrival?.date
    )}T${itinerary?.airSegments?.at(-1)?.arrival?.time}:00`,
    Dur: sumDurationForKafila(itinerary.airSegments),
    Stop: convertedItinerary.Stop,
    Seats:
      itinerary?.airSegments[0]?.noSeats ||
      itinerary?.airSegments?.[0]?.noOfSeats ||
      "0",
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
      layover: convertedItinerary?.Sectors?.[idx]?.layover ?? "",
      Seat: segment.noSeats || segment.noOfSeats || "0",
      FClass: segment.classOfService || segment.classofService || "",
      PClass: segment.productClass,
      FBasis: segment.fareBasisCode || segment.fareBasis || "",
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
    FareRule: null,
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
  const technicalStops = itinerary?.airSegments?.reduce?.(
    (acc, segment) => acc + (segment?.technicalStops?.length || 0),
    0
  );
  convertedItinerary.Stop += technicalStops || 0;
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
  if (type === "travelTime") {
    const travelTime = airSegments?.[0]?.travelTime?.split?.(":") ?? [];
    if (travelTime?.length === 3)
      return `${travelTime[0]}d:${travelTime[1]}h:${travelTime[2]}m`;
    else return `0d:${travelTime[0]}h:${travelTime[1]}m`;
  }

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

function getTechStopTimeDifference(stop) {
  const startDate = moment(stop.arrival.date, "DD/MM/YYYY");
  const endDate = moment(stop.departure.date, "DD/MM/YYYY");

  const [startHours, startMinutes] = stop.arrival.time.split(":").map(Number);
  const [endHours, endMinutes] = stop.departure.time.split(":").map(Number);

  const startDateTime = startDate
    .set("hour", startHours)
    .set("minute", startMinutes);
  const endDateTime = endDate.set("hour", endHours).set("minute", endMinutes);

  let minutes = endDateTime.diff(startDateTime, "minutes");
  // let hours = 0;
  // let days = 0;

  // if (minutes > minutesInADay) {
  //   days = parseInt(minutes / minutesInADay);
  //   minutes -= days * minutesInADay;
  // }
  // if (minutes > 60) {
  //   hours = parseInt(minutes / 60);
  //   minutes -= hours * 60;
  // }

  // return `${days}d:${hours}h:${minutes}m`;
  return minutes;
}

function convertMinutesInDuration(minutes = 0) {
  const minutesInADay = 60 * 24;

  let hours = 0;
  let days = 0;

  if (minutes > minutesInADay) {
    days = parseInt(minutes / minutesInADay);
    minutes -= days * minutesInADay;
  }
  if (minutes > 60) {
    hours = parseInt(minutes / 60);
    minutes -= hours * 60;
  }

  return `${days}d:${hours}h:${minutes}m`;
}

function formatDateForKafila(dateString) {
  return moment(dateString, "DD/MM/YYYY").format("YYYY-MM-DD");
}

async function convertFlightDetailsForKafila(flight) {
  if (!flight) return {};
  const date = formatDateForKafila(flight.date);

  const flightDetails = {
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

  if (
    !flightDetails.Name ||
    !flightDetails.CityCode ||
    !flightDetails.CityName ||
    !flightDetails.CountryCode ||
    !flightDetails.CountryName
  ) {
    const airport = await getAirportByCode(flightDetails.Code);
    flightDetails.Name = airport?.Airport_Name || flight.name || "";
    flightDetails.CityCode = airport?.City_Code || flight.cityCode || "";
    flightDetails.CityName = airport?.City_Name || flight.cityName || "";
    flightDetails.CountryCode =
      airport?.Country_Code || flight.countryCode || "";
    flightDetails.CountryName =
      airport?.Country_Name || flight.countryName || "";
  }
  return flightDetails;
}

async function convertSegmentForKafila(segment, idx, airSegments) {
  let group = parseInt(segment.group);
  const sector = {
    IsConnect: airSegments.length - 1 === idx ? false : true,
    // IsConnect: segment.isConnect ?? false,
    AirlineCode: segment.airlineCode ?? "",
    AirlineName: segment.airlineName ?? "",
    Class: segment.classOfService || segment.classofService || "",
    CabinClass: getKafilaCabinClass(segment.cabinClass) ?? "",
    BookingCounts: segment.bookingCounts || segment.rbds || "", // missing
    NoSeats: segment.noSeats || segment?.noOfSeats || "",
    FltNum: segment.flightNumber || segment.fltNum || "",
    EquipType: segment.equipType || segment.equipmentType || "",
    FlyingTime: sumDurationForKafila([segment], "flyingTime"),
    TravelTime: sumDurationForKafila([segment], "flyingTime"),
    TechStopOver: segment.technicalStops?.length ?? 0, // missing
    layover: getTechnicalStopRemark(segment.technicalStops), // missing
    Status: segment.status || "", // missing
    OperatingCarrier: segment.operatingCarrier?.code ?? null,
    MarketingCarrier: null,
    BaggageInfo: segment.baggageInfo || "",
    NoOfSeats: segment.noOfSeats || "",
    HandBaggage: segment.handBaggage || segment.cabinBaggage || "",
    TransitTime: segment.transitTime || "",
    MealCode: null,
    key: segment.key || segment.segRef || "",
    Distance: "",
    ETicket: "No",
    ChangeOfPlane: "",
    ParticipantLevel: "",
    OptionalServicesIndicator: false,
    AvailabilitySource: segment.availabilitySource ?? "",
    Group: (group - 1).toString(),
    LinkAvailability: false,
    PolledAvailabilityOption: "",
    FareBasisCode: segment.fareBasisCode || segment.fareBasis || "",
    HostTokenRef: segment.offerDetails
      ? JSON.stringify(segment.offerDetails)
      : "",
    APISRequirementsRef: "",
    Departure: await convertFlightDetailsForKafila(segment.departure),
    Arrival: await convertFlightDetailsForKafila(segment.arrival),
    OI: [],
    ProductClass: segment.productClass ?? "",
    FareFamily: segment.fareFamily || "",
    FareType: segment.fareType || "",
    Brand: segment.brand || null,
  };

  if (!sector.AirlineName) {
    const airline = await getAirlineByCode(sector.AirlineCode);
    sector.AirlineName = airline?.airlineName || segment?.airlineName || "";
  }

  return sector;
}

function getTransitTime(segment) {}

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
    TaxBreakup:
      breakup.taxBreakup?.map((tax) => ({
        TaxType: tax.taxType,
        Amount: tax.amount,
      })) ?? [],
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
    key: breakup.key || breakup.fareCalc || "",
    OI: [],
  };
}
function getTechnicalStopRemark(technicalStops = []) {
  saveLogInFile({ technicalStops });
  if (!technicalStops?.length) return "";
  let remark = "";

  try {
    for (let stop of technicalStops) {
      const code = stop?.arrival?.code;
      const diffInMinutes = getTechStopTimeDifference(stop);
      const duration = convertMinutesInDuration(diffInMinutes);
      remark += `${remark ? ", " : ""}${code} (Layover for ${duration})`;
    }
  } catch (error) {
    console.log({ errorConstructingTechnicalStopRemark: error });
  }
  return remark;
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
  formatDateForKafila,
  sumDurationForKafila,
  convertItineraryForKafila,
  convertFlightDetailsForKafila,
  convertTravelTypeForCommonAPI,
  convertSegmentForKafila,
  getCommonCabinClass,
  getKafilaCabinClass,
};
