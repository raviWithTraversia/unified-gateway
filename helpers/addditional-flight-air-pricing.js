const moment = require("moment");
const { default: axios } = require("axios");
const { convertTravelType } = require("./additional-search");

async function getAdditionalFlightAirPricing(request) {
  const itinerary = request.Itinerary[0];
  const segment = request.Segments[0];

  const requestBody = {
    typeOfTrip: request.TypeOfTrip,
    credentialType: request.Authentication.CredentialType,
    travelType: convertTravelType(request.TravelType),
    systemEntity: "TCIL",
    systemName: "Astra2.0",
    corpCode: "",
    requestorCode: "",
    empCode: "",
    uniqueKey: itinerary.UniqueKey,
    traceId: itinerary.TraceId,
    journey: [
      {
        journeyKey: itinerary.SearchID,
        origin: segment.Origin,
        destination: segment.Destination,
        itinerary: [
          {
            uid: itinerary.UID,
            indexNumber: itinerary.IndexNumber,
            provider: itinerary.Provider,
            promoCodeType: itinerary.PromoCodeType,
            airSegments: itinerary.Sectors.map((sector) => ({
              travelTime: convertDuration(sector.TravelTime),
              airlineCode: sector.AirlineCode,
              airlineName: sector.AirlineName,
              flyingTime: convertDuration(sector.FlyingTime),
              departure: convertFlightDetails(sector.Departure),
              arrival: convertFlightDetails(sector.Arrival),
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
            priceBreakup: convertPriceBreakup(itinerary.PriceBreakup),
            freeSeat: itinerary.FreeSeat,
            freeMeal: itinerary.FreeMeal,
            carbonEmission: itinerary.CarbonEmission,
            baseFare: itinerary.BaseFare,
            taxes: itinerary.Taxes,
            totalPrice: itinerary.TotalPrice,
            valCarrier: itinerary.ValCarrier,
            refundableFare: itinerary.RefundableFare,
            sessionKey: itinerary.SessionKey,
            fareType: itinerary.FareType,
            promotionalCode: itinerary.PromotionalCode,
            fareFamily: itinerary.FareFamily,
            key: itinerary.Key,
            inPolicy: itinerary.InPolicy,
            isRecommended: itinerary.IsRecommended,
          },
        ],
      },
    ],
  };
  const { data: response } = await axios.post(
    "http://tcilapi.traversia.net:31101/api/pricing/airpricing",
    requestBody
  );
  console.log({ response });
  return response;
}

function convertDuration(timeString) {
  let [days, hours, minutes] = timeString
    .split(":")
    .map((time) => time.slice(0, time.length - 1).padStart(2, "0"));
  return `${hours}:${minutes}`;
}

function convertFlightDetails(flight) {
  return {
    code: flight.Code,
    terminal: flight.Terminal,
    date: formatDate(flight.Date),
    name: flight.Name,
    cityCode: flight.CityCode,
    cityName: flight.CityName,
    countrycode: flight.CountryCode,
    countryName: flight.CountryName,
    time: flight.Time,
  };
}

function convertPriceBreakup(breakups) {
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
function formatDate(dateString) {
  return moment(dateString, "YYYY-MM-DD").format("DD/MM/YYYY");
}

module.exports = { getAdditionalFlightAirPricing };
