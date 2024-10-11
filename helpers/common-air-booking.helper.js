const {
  convertDurationForCommonAPI,
  convertFlightDetailsForCommonAPI,
  convertPriceBreakupForCommonAPI,
} = require("./common-air-pricing.helper");
const { convertTravelTypeForCommonAPI } = require("./common-search.helper");

function createAirBookingRequestBodyForCommonAPI(request) {
  try {
    const { SearchRequest, PassengerPreferences } = request;
    const reqSegment = SearchRequest.Segments?.[0];
    const reqItinerary = request.ItineraryPriceCheckResponses?.[0];
    if (!reqItinerary || !reqSegment)
      throw new Error(
        "Invalid request data 'Itinerary[]' or 'Segment[]' missing"
      );
    const requestBody = {
      typeOfTrip: SearchRequest.TypeOfTrip,
      credentialType: SearchRequest?.Authentication?.CredentialType ?? "TEST",
      travelType: convertTravelTypeForCommonAPI(SearchRequest.TravelType),
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
          rbdChanged: false, // ! TODO:
          travellerDetails: PassengerPreferences?.Passengers?.map(
            (passenger, idx) =>
              convertTravelerDetailsForCommonAPI(passenger, idx)
          ),
          itinerary: [
            {
              sessionKey: reqItinerary.SessionKey,
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
      gstDetails: {
        fullName: PassengerPreferences?.GstData?.gstName || "TEST",
        emailAddress:
          PassengerPreferences?.GstData?.gstEmail || "TEST@test.com",
        homePhone: PassengerPreferences?.GstData?.gstmobile || "0114238888",
        workPhone: PassengerPreferences?.GstData?.gstmobile || "0114238888",
        gstNumber: PassengerPreferences?.GstData?.gstNumber || "TEST",
        companyName: "TEST",
        addressLine1: PassengerPreferences?.GstData?.gstAddress || "TEST",
        addressLine2: PassengerPreferences?.GstData?.gstAddressLine2 || "TEST",
        city: PassengerPreferences?.GstData?.gstCity || "DEL",
        provinceState: PassengerPreferences?.GstData?.gstCity || "DL",
        postalCode: PassengerPreferences?.GstData?.gstPostalCode || "110055",
        countryCode: PassengerPreferences?.GstData?.gstCountryCode || "IN",
      },
      agencyInfo: {
        companyName: "SKH GLOBAL TRAVELS PVT LTD",
        addressLine1: "2ND FLOOR  PLOT N 10  COMMUNITY CENTRE  EAST ",
        addressLine2: "OF KAILASH",
        city: "DEL",
        provinceState: "DL",
        postalCode: "110065",
        countryCode: "IN",
        emailAddress: "invoice@skhglobal.com",
        homePhone: "",
        workPhone: "0114238888",
        agencyCardId: null,
        agentEmailAddress: "tkt4@skhglobal.com",
        isBtaTACard: false,
      },
      rmFields: [],
      tourCode: null,
      isHoldBooking: false,
      fareMasking: false,
    };
    return { requestBody };
  } catch (error) {
    return { error: error.message };
  }
}

function convertTravelerDetailsForCommonAPI(traveler, idx) {
  return {
    travellerId: "",
    type: traveler.PaxType,
    title: traveler.Title,
    firstName: traveler.FName,
    middleName: "",
    lastName: traveler.LName,
    dob: traveler.Dob ?? "1900-01-01",
    gender: traveler.Gender?.at?.(0)?.toUpperCase?.() || "M",
    passportDetails: null,
    contactDetails: {
      address1:
        traveler.AddressLine1 ??
        "2ND FLOOR  PLOT N 10  COMMUNITY CENTRE  EAST ",
      address2: traveler.AddressLine2 ?? "F KAILASH",
      city: traveler.City ?? "DEL",
      state: traveler.State ?? "DL",
      country: traveler.Country ?? null,
      countryCode: traveler.CountryCode ?? "IN",
      email: traveler.Email ?? "invoice@skhglobal.com",
      phone: traveler.Phone ?? "1244768200",
      mobile: traveler.Mobile ?? "9811096122",
      postalCode: traveler.PostalCode ?? "110065",
      isdCode: traveler.IsdCode ?? null,
    },
    frequentFlyer: traveler.FrequentFlyer ?? null,
    nationality: traveler.Nationality ?? "IN",
    department: traveler.Department ?? "",
    designation: traveler.Designation ?? "",
  };
}

module.exports = {
  createAirBookingRequestBodyForCommonAPI,
  convertTravelerDetailsForCommonAPI,
};
