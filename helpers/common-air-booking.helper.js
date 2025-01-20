const moment = require("moment");
const { saveLogInFile } = require("../utils/save-log");
const {
  convertDurationForCommonAPI,
  convertFlightDetailsForCommonAPI,
  convertPriceBreakupForCommonAPI,
} = require("./common-air-pricing.helper");
const { convertTravelTypeForCommonAPI } = require("./common-search.helper");

function createAirBookingRequestBodyForCommonAPI(
  request,
  reqSegment,
  reqItinerary
) {
  try {
    saveLogInFile("booking-request.json", request);
    const { SearchRequest, PassengerPreferences } = request;
    // const reqSegment = SearchRequest.Segments?.[0];
    // const reqItinerary = request.ItineraryPriceCheckResponses?.[0];
    if (!reqItinerary || !reqSegment)
      throw new Error(
        "Invalid request data 'Itinerary[]' or 'Segment[]' missing"
      );
    const segmentMap = {};
    reqItinerary?.Sectors?.forEach((sector) => {
      segmentMap[`${sector.Departure.Code}-${sector.Arrival.Code}`] = sector;
    });
    saveLogInFile("segment-map.json", segmentMap);
    const travelType = convertTravelTypeForCommonAPI(SearchRequest.TravelType);
    const origin =
      travelType === "dom"
        ? reqItinerary?.Sectors?.[0]?.Departure?.CityCode
        : reqSegment.Origin;
    const destination =
      travelType === "dom"
        ? reqItinerary?.Sectors?.at(-1)?.Arrival?.CityCode
        : reqSegment.Destination;

    const requestBody = {
      typeOfTrip: SearchRequest.TypeOfTrip,
      credentialType: SearchRequest?.Authentication?.CredentialType ?? "TEST",
      travelType,
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
          origin,
          destination,
          rbdChanged: false, // ! TODO:
          travellerDetails: PassengerPreferences?.Passengers?.map(
            (passenger, idx) =>
              convertTravelerDetailsForCommonAPI(passenger, idx, segmentMap)
          ),
          itinerary: [
            {
              sessionKey: reqItinerary.SessionKey,
              uid: reqItinerary.UID,
              indexNumber: reqItinerary.IndexNumber,
              provider: reqItinerary.Provider,
              promoCodeType: reqItinerary.PromoCodeType,
              airSegments: reqItinerary.Sectors.map((sector) => ({
                key: sector.key ?? "",
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
        fullName: PassengerPreferences?.GstData?.gstName || "",
        emailAddress: PassengerPreferences?.GstData?.gstEmail || "",
        homePhone: PassengerPreferences?.GstData?.gstmobile || "",
        workPhone: PassengerPreferences?.GstData?.gstmobile || "",
        gstNumber: PassengerPreferences?.GstData?.gstNumber || "",
        companyName: "TEST",
        addressLine1: PassengerPreferences?.GstData?.gstAddress || "",
        addressLine2: PassengerPreferences?.GstData?.gstAddressLine2 || "",
        city: PassengerPreferences?.GstData?.gstCity || "",
        provinceState: PassengerPreferences?.GstData?.gstCity || "",
        postalCode: PassengerPreferences?.GstData?.gstPostalCode || "",
        countryCode: PassengerPreferences?.GstData?.gstCountryCode || "",
      },
      agencyInfo: {
        companyName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        provinceState: "",
        postalCode: "",
        countryCode: "",
        emailAddress: "",
        homePhone: "",
        workPhone: "",
        agencyCardId: null,
        agentEmailAddress: "",
        isBtaTACard: false,
      },
      rmFields: [],
      tourCode: null,
      isHoldBooking: false,
      fareMasking: false,
    };
    // card info for live bookings
    if (
      request.credentialType === "LIVE" &&
      request.journey[0]?.itinerary?.[0]?.provider == "1A"
    ) {
      request.journey[0].cardInfo = {
        // FP CCVI4780080140169608/D0827
        cardInfo: {
          cardNumber: "4780080140169608",
          code: "VI",
          expiryYear: "08",
          expiryMonth: "27",
        },
      };
    }
    saveLogInFile("request-body.json", requestBody);
    return { requestBody };
  } catch (error) {
    saveLogInFile("error-creating-common-booking-request.json", {
      stack: error.stack,
      message: error.message,
    });
    console.log({ error });
    return { error: error.message };
  }
}

function convertTravelerDetailsForCommonAPI(traveler, idx, segmentMap) {
  saveLogInFile("traveler.json", traveler);
  return {
    travellerId: "",
    type: traveler.PaxType,
    title: traveler.Title,
    firstName: traveler.FName,
    middleName: "",
    lastName: traveler.LName,
    seatPreferences: traveler.Seat.filter(
      (pref) => segmentMap[`${pref.Src}-${pref.Des}`]
    ).map((seat) => ({
      code: seat?.SeatCode,
      amount: seat?.TotalPrice,
      currency: seat?.Currency || "INR",
      paid: seat?.Paid,
      desc: seat?.SsrDesc,
      key: seat?.OI,
      origin: seat?.Src,
      destination: seat?.Des,
      airlineCode: seat?.FCode,
      flightNumber: seat?.FNo,
      wayType: seat?.Trip,
    })),
    baggagePreferences: traveler.Baggage.filter((pref) => {
      const segments = Object.values(segmentMap);
      let isSrc = false;
      let isDes = false;
      for (let segment of segments) {
        if (segment.Departure?.Code === pref.Src) isSrc = true;
        if (segment.Arrival?.Code === pref.Des) isDes = true;
      }
      return isSrc && isDes;
      // segmentMap[`${pref.Src}-${pref.Des}`]
    }).map((baggage) => ({
      name: baggage?.SsrDesc,
      code: baggage?.SsrCode,
      amount: baggage?.Price,
      currency: baggage?.Currency || "INR",
      paid: baggage?.Paid,
      desc: baggage?.SsrDesc,
      key: baggage?.key || "",
      origin: baggage?.Src,
      destination: baggage?.Des,
      airlineCode: baggage?.FCode,
      flightNumber: baggage?.FNo,
      wayType: baggage?.Trip,
    })),
    mealPreferences: traveler.Meal.filter(
      (pref) => segmentMap[`${pref.Src}-${pref.Des}`]
    ).map((meal) => ({
      name: meal?.SsrDesc,
      code: meal?.SsrCode,
      amount: meal?.Price,
      currency: meal?.Currency || "INR",
      paid: meal?.Paid,
      desc: meal?.SsrDesc,
      key: meal?.key || "",
      origin: meal?.Src,
      destination: meal?.Des,
      airlineCode: meal?.FCode,
      flightNumber: meal?.FNo,
      wayType: meal?.Trip,
    })),
    dob: traveler.Dob ?? "",
    gender: traveler.Gender?.at?.(0)?.toUpperCase?.() || "M",
    passportDetails: traveler?.Optional?.PassportNo
      ? {
          number: traveler?.Optional?.PassportNo ?? "",
          issuingCountry: traveler?.Optional?.ResidentCountry,
          expiryDate: moment(traveler?.Optional?.PassportExpiryDate).format(
            "YYYY-MM-DD"
          ),
        }
      : null,
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

function convertBookingResponse(request, response, reqSegment) {
  // const tickets = response?.data?.journey?.[0]?.travellerDetails[0]?.eTicket;
  // const src = request.SearchRequest.Segments[0].Origin; // TODO: needs to be dynamic
  const src = reqSegment.Origin;
  const des = reqSegment.Destination;
  // const des = request.SearchRequest.Segments[0].Destination; // TODO: needs to be dynamic
  const pnrs = response?.data?.journey?.[0]?.recLocInfo;
  let [PNR, APnr, GPnr] = [null, null, null];
  if (pnrs?.length) {
    PNR = pnrs.find((pnr) => pnr.type === "Airline")?.pnr ?? null;
    APnr = pnrs.find((pnr) => pnr.type === "AirReservation")?.pnr ?? null;
    GPnr = pnrs.find((pnr) => pnr.type === "GDS")?.pnr ?? null;
  }
  // if (tickets.length) {
  // }
  const travelerDetails = response?.data?.journey?.[0]?.travellerDetails;
  try {
    const data = {
      Status: PNR ? "Success" : "Failed",
      BookingInfo: {
        BookingId: "",
        BookingRemark: "",
        PNR,
        APnr,
        GPnr,
        SalePurchase: "",
      },
      PaxInfo: updatePassengerDetails(
        request.PassengerPreferences,
        travelerDetails,
        src,
        des
      ),
    };
    data.BookingInfo.IsError = data.Status !== "Success";
    data.BookingInfo.CurrentStatus =
      data.Status !== "Success" ? "Failed" : "PENDING";
    if (travelerDetails?.[0]?.eTicket?.length)
      data.BookingInfo.CurrentStatus = "CONFIRMED";
    data.ErrorMessage =
      data.Status !== "Success" ? response?.message ?? "" : "";
    data.WarningMessage = data.ErrorMessage;
    return { data };
  } catch (error) {
    saveLogInFile("error.json", { stack: error.stack, message: error.message });
    return {
      data: {
        Status: PNR ? "Success" : "Failed",
        BookingInfo: {
          BookingId: "",
          BookingRemark: "",
          PNR,
          APnr,
          GPnr,
          SalePurchase: "",
          IsError: true,
          CurrentStatus: "Failed",
          ErrorMessage: error.message,
          WarningMessage: error.message,
        },
        PaxInfo: updatePassengerDetails(
          passengerPreferences,
          travelerDetails,
          src,
          des
        ),
      },
    };
  }
}

function updatePassengerDetails(
  passengerPreferences,
  travelerDetails,
  src,
  des
) {
  if (!travelerDetails?.length) return passengerPreferences;
  const updatedPassengerPreferences = {
    ...passengerPreferences,
    Passengers: passengerPreferences.Passengers.map((pax, idx) => {
      if (!travelerDetails?.[idx]?.eTicket?.length) return pax;
      const ticketDetails =
        travelerDetails?.[idx]?.eTicket?.map?.((ticket) => ({
          ticketNumber: ticket.eTicketNumber,
          src,
          des,
        })) || [];
      const EMDDetails = travelerDetails[idx]?.emd || [];
      // if (
      //   ticketDetails?.length &&
      //   !pax.Optional?.ticketDetails?.some((ticket) => ticket?.ticketNumber)
      // ) {
      //   pax.Optional.ticketDetails = ticketDetails;
      // } else {
      //   pax.Optional.ticketDetails = [
      //     ...pax.Optional.ticketDetails,
      //     ticketDetails,
      //   ];
      // }
      // if (
      //   EMDDetails.length &&
      //   !pax.Optional?.EMD?.some((emd) => emd?.EMDNumber)
      // ) {
      //   pax.Optional.EMDDetails = EMDDetails;
      // } else {
      //   pax.Optional.EMDDetails = [...pax.Optional.EMDDetails, EMDDetails];
      // }
      // return pax;
      saveLogInFile("tickets.json", { ticketDetails, EMDDetails });
      return {
        ...pax,
        Optional: {
          ticketDetails,
          EMDDetails,
          // ...pax.Optional = {}
        },
      };
    }),
  };
  return updatedPassengerPreferences;
}
module.exports = {
  createAirBookingRequestBodyForCommonAPI,
  convertTravelerDetailsForCommonAPI,
  convertBookingResponse,
};
