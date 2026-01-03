const flightcommercial = require("./flight.commercial");
const PromoCode = require("../../models/AirlinePromoCode");
const Company = require("../../models/Company");
const Supplier = require("../../models/Supplier");
// const Role = require("../../models/Role");
const UserModel = require("../../models/User");
const ledger = require("../../models/Ledger");
const creditRequest = require("../../models/CreditRequest");
const transaction = require("../../models/transaction");
const agentConfig = require("../../models/AgentConfig");
const Logs = require("../../controllers/logs/PortalApiLogsCommon");
// const fareFamilyMaster = require("../../models/FareFamilyMaster");
const passengerPreferenceModel = require("../../models/booking/PassengerPreference");
const BookingDetails = require("../../models/booking/BookingDetails");
const BookingTemp = require("../../models/booking/BookingTemp");
// const moment = require("moment");
const axios = require("axios");
// const uuid = require("uuid");
// const NodeCache = require("node-cache");
// const flightCache = new NodeCache();
// const {commonMethodBooking}=require('../../controllers/payuController/payu.}
const { Config } = require('../../configs/config')
const {
  createLeadger,
  getTdsAndDsicount,
  commonProviderMethodDate,
  updateStatus,
} = require("../../controllers/commonFunctions/common.function");
const SupplierCode = require("../../models/supplierCode");
const { getSupplierCredentials } = require("../../utils/get-supplier-creds");
const { commonFlightBook } = require("../../services/common-flight-book");
const { saveLogInFile } = require("../../utils/save-log");
const { updateBarcode2DByBookingId } = require('./airBooking.service')
const EventLogs = require("../../controllers/logs/EventApiLogsCommon")
const { cancelationDataUpdate } = require("./cancelation.service")
const { makeAuthentication } = require("../../helpers/common-decoratare-helper")


const pkFareStartBooking = async (req, res, body) => {
  const {
    SearchRequest: {
      Authentication,
      TypeOfTrip,
      Segments,
      PaxDetail,
      TravelType,
      Flexi,
      Direct,
      ClassOfService,
      Airlines,
      FareFamily,
      RefundableOnly,
    },
    PassengerPreferences,
    ItineraryPriceCheckResponses,
    paymentMethodType,
    paymentGateway,
    isHoldBooking,
  } = body;
  const fieldNames = [
    "Authentication",
    "TypeOfTrip",
    "Segments",
    "PaxDetail",
    "TravelType",
    "Flexi",
    "Direct",
    "ClassOfService",
    "Airlines",
    "FareFamily",
    "RefundableOnly",
    "PassengerPreferences",
    "ItineraryPriceCheckResponses",
    "paymentMethodType",
    "paymentGateway",
  ];
  //   const missingFields = fieldNames.filter(
  //     (fieldName) =>
  //       req.body.SearchRequest[fieldName] === null || req.body.SearchRequest[fieldName] === undefined
  //   );

  const missingFields = fieldNames.filter(
    (field) => field === null || field === undefined
  );
  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(", ");
    return {
      response: null,
      isSometingMissing: true,
      data: `Missing or null fields: ${missingFieldsString}`,
    };
  }

  let companyId = Authentication.CompanyId;
  let UserId = Authentication.UserId;
  let TraceId = Authentication.TraceId;
  let bookingId = await gernrateCartId(Authentication);
  if (!bookingId) {
    return {
      IsSuccess: false,
      response: "bookingId not generated",
    };
  }

  if (!companyId || !UserId || !TraceId) {
    return {
      IsSuccess: false,
      response: "Company or User Trace id field are required",
    };
  }

  const [bookingData, checkCompanyIdExist] = await Promise.all([
    BookingDetails.find({ "itinerary.TraceId": TraceId }),
    Company.findById(companyId)
  ]);

  // Check if booking already exists
  if (bookingData.length > 0) {
    return {
      response: "already created booking",
    };
  }


  // Check if company Id exists
  if (!checkCompanyIdExist || checkCompanyIdExist.type !== "TMC") {
    return {
      IsSuccess: false,
      response: "TMC Company id does not exist",
    };
  }
  // Also CHeck Role Of TMC by Company Id( PENDING )
  // Logs Pending

  // Check Travel Type ( International / Domestic )
  let result;
  if (TravelType.toLowerCase() !== "international" && TravelType.toUpperCase() !== "DOMESTIC") {
    return {
      IsSuccess: false,
      response: "Travel Type Not Valid",
    };
  } else {
    result = await handleflight(
      Authentication,
      TypeOfTrip,
      Segments,
      PaxDetail,
      TravelType,
      Flexi,
      Direct,
      ClassOfService,
      Airlines,
      FareFamily,
      RefundableOnly,
      PassengerPreferences,
      ItineraryPriceCheckResponses,
      paymentMethodType,
      paymentGateway,
      req,
      isHoldBooking,
      bookingId
    );
  }
  const logData = {
    traceId: Authentication.TraceId,
    companyId: Authentication.CompanyId,
    userId: Authentication.UserId,
    source: "Kafila",
    type: "Portal Log",
    product: "Flight",
    logName: "Air Booking",
    request: req.body,
    responce: result,
  };
  Logs(logData);
  if (!result.IsSucess || result.response === "Some Technical Issue" || !result.response.IsSucess) {
    return {
      response: result?.response?.response ?? result.response,
    };
  } else {
    return {
      response: "Fetch Data Successfully",
      data: bookingId,
    };
  }
};

async function handleflight(
  Authentication,
  TypeOfTrip,
  Segments,
  PaxDetail,
  TravelType,
  Flexi,
  Direct,
  ClassOfService,
  Airlines,
  FareFamily,
  RefundableOnly,
  PassengerPreferences,
  ItineraryPriceCheckResponses,
  paymentMethodType,
  paymentGateway,
  req,
  isHoldBooking,
  bookingId
) {
  // International
  // Check LIVE and TEST
  const { CredentialType, CompanyId, TraceId } = Authentication;
  if (!["LIVE", "TEST"].includes(CredentialType)) {
    return {
      IsSucess: false,
      response: "Credential Type does not exist",
    };
  }

  if (!TraceId) {
    return {
      IsSucess: false,
      response: "Trace Id Required",
    };
  }
  if (!["MULTYCITY", "ONEWAY", "ROUNDTRIP"].includes(TypeOfTrip)) {
    return {
      IsSucess: false,
      response: "Type of trip does not exist",
    };
  }

  //  let supplier="Kafila"

  const responsesApi = await KafilaFun(
    Authentication,
    // supplier,
    TypeOfTrip,
    Segments,
    PaxDetail,
    TravelType,
    Flexi,
    Direct,
    ClassOfService,
    Airlines,
    FareFamily,
    RefundableOnly,
    // supplierCode.supplierCode,
    PassengerPreferences,
    ItineraryPriceCheckResponses,
    paymentMethodType,
    paymentGateway,
    req,
    isHoldBooking,
    bookingId
  );
  // console.dir({ responsesApi }, { depth: null });
  // delete this one
  return {
    IsSucess: true,
    response: responsesApi,
    // response: responsesApi.flat(),
  };
}
const KafilaFun = async (
  Authentication,
  TypeOfTrip,
  Segments,
  PaxDetail,
  TravelType,
  Flexi,
  Direct,
  ClassOfService,
  Airlines,
  FareFamily,
  RefundableOnly,
  PassengerPreferences,
  ItineraryPriceCheckResponses,
  paymentMethodType,
  paymentGateway,
  req,
  isHoldBooking,
  bookingId
) => {
  try {
    // 1️⃣ Get user
    const getuserDetails = await getUserDetails(Authentication);

    // 2️⃣ Prepare passenger data
    const getAllPriceAppliedPessengerwise = await preparePassengerArrayListForBookingApiPayload(
      PassengerPreferences.Passengers,
      ItineraryPriceCheckResponses
    );

    // 3️⃣ Calculate totals
    let totalssrPrice = getAllPriceAppliedPessengerwise.reduce((sum, passenger) => {
      return (
        sum +
        (passenger.totalMealPrice || 0) +
        (passenger.totalSeatPrice || 0) +
        (passenger.totalBaggagePrice || 0) +
        (passenger.totalFastForwardPrice || 0)
      );
    }, 0);

    const calculationOfferPriceWithCommercial = await calculateOfferedPriceForAll(ItineraryPriceCheckResponses);
    const totalSSRWithCalculationPrice = calculationOfferPriceWithCommercial + totalssrPrice;

    // 4️⃣ Handle payment
    if (paymentMethodType === "Wallet" || isHoldBooking) {
      const paymentResult = await handleWalletPayment(getuserDetails, totalSSRWithCalculationPrice, ItineraryPriceCheckResponses, isHoldBooking, bookingId);
      if (paymentResult) return paymentResult;
    }

    // 5️⃣ Create bookings
    const newArray = await Promise.all(
      ItineraryPriceCheckResponses.map(async (itineraryItem) => {
        const [sectorsArray, priceBreakupArray] = await Promise.all([
          sectorObjectReturn(itineraryItem),
          returnPriceBreakupArray(itineraryItem)
        ])
        if (sectorsArray.length > 0 && priceBreakupArray.length > 0) {
          const newItem = {
            userId: Authentication?.UserId,
            companyId: Authentication?.CompanyId,
            AgencyId: Authentication?.AgencyId,
            BookedBy: Authentication?.BookedBy,
            bookingId: bookingId, // Changed from item?.BookingId to itineraryItem?.BookingId
            prodBookingId: itineraryItem?.IndexNumber,
            provider: itineraryItem?.Provider,
            bookingType: "Automated",
            bookingStatus: "INCOMPLETE",
            paymentMethodType: paymentMethodType,
            paymentGateway: paymentGateway,
            bookingTotalAmount: itineraryItem?.GrandTotal, // Changed from item?.GrandTotal to itineraryItem?.GrandTotal
            Supplier: itineraryItem?.ValCarrier, // Changed from item?.ValCarrier to itineraryItem?.ValCarrier
            travelType: TravelType,
            fareRules:
              itineraryItem?.fareRules !== undefined &&
                itineraryItem?.fareRules !== null
                ? itineraryItem?.fareRules
                : null,
            bookingTotalAmount:
              (itineraryItem.offeredPrice || 0) +
              (itineraryItem.totalMealPrice || 0) +
              (itineraryItem.totalBaggagePrice || 0) +
              (itineraryItem.totalSeatPrice || 0) +
              (itineraryItem.totalFastForwardPrice || 0),
            totalMealPrice: itineraryItem.totalMealPrice ?? 0,
            totalBaggagePrice: itineraryItem.totalBaggagePrice ?? 0,
            totalSeatPrice: itineraryItem.totalSeatPrice ?? 0,
            totalFastForwardPrice: itineraryItem.totalFastForwardPrice ?? 0,
            itinerary: {
              UID: itineraryItem.UID,
              UniqueKey: itineraryItem?.UniqueKey || "",
              BaseFare: itineraryItem.BaseFare,
              Taxes: itineraryItem.Taxes,
              TotalPrice: itineraryItem.TotalPrice,
              GrandTotal: itineraryItem.GrandTotal,
              FareFamily: itineraryItem.FareFamily,
              IndexNumber: itineraryItem.IndexNumber,
              Provider: itineraryItem.Provider,
              ValCarrier: itineraryItem.ValCarrier,
              LastTicketingDate: itineraryItem.LastTicketingDate,
              TravelTime: itineraryItem.TravelTime,
              advanceAgentMarkup: {
                adult: {
                  baseFare:
                    itineraryItem.advanceAgentMarkup?.adult?.baseFare ?? 0,
                  taxesFare:
                    itineraryItem.advanceAgentMarkup?.adult?.taxesFare ?? 0,
                  feesFare:
                    itineraryItem.advanceAgentMarkup?.adult?.feesFare ?? 0,
                  gstFare:
                    itineraryItem.advanceAgentMarkup?.adult?.gstFare ?? 0,
                },
                child: {
                  baseFare: itineraryItem.advanceAgentMarkup?.child?.baseFare,
                  taxesFare: itineraryItem.advanceAgentMarkup?.child?.taxesFare,
                  feesFare: itineraryItem.advanceAgentMarkup?.child?.feesFare,
                  gstFare: itineraryItem.advanceAgentMarkup?.child?.gstFare,
                },
                infant: {
                  baseFare: itineraryItem.advanceAgentMarkup?.infant?.baseFare,
                  taxesFare:
                    itineraryItem.advanceAgentMarkup?.infant?.taxesFare,
                  feesFare: itineraryItem.advanceAgentMarkup?.infant?.feesFare,
                  gstFare: itineraryItem.advanceAgentMarkup?.infant?.gstFare,
                },
              },
              PriceBreakup: priceBreakupArray,
              Sectors: sectorsArray,
              TraceId: itineraryItem?.TraceId||Authentication?.TraceId,
              // TraceId: Authentication?.TraceId,
            },
          };
          return await createBooking(newItem, req);
        }
        return { IsSucess: false, response: "Something went wrong" }
      })
    );

    // 6️⃣ Handle booking success
    if (Array.isArray(newArray) && newArray.length > 0) {
      const response = newArray[0];
      if (response.msg === "Booking created successfully") {
        const passengerPreferencesData = PassengerPreferences;
        const passengerPreference = new passengerPreferenceModel({
          userId: Authentication?.UserId,
          companyId: Authentication?.CompanyId,
          bookingId: response?.bookingId,
          bid: response?.bid,
          GstData: passengerPreferencesData?.GstData,
          PaxEmail: passengerPreferencesData?.PaxEmail,
          PaxMobile: passengerPreferencesData?.PaxMobile,
          Passengers: passengerPreferencesData?.Passengers?.map(
            (passenger) => ({
              PaxType: passenger?.PaxType,
              passengarSerialNo: passenger?.passengarSerialNo,
              Title: passenger?.Title,
              FName: passenger?.FName,
              LName: passenger?.LName,
              Gender: passenger?.Gender,
              Dob: passenger?.Dob,
              Optional: {
                ticketDetails: passenger?.Optional?.ticketDetails ?? [],
                EMDDetails: passenger?.Optional?.EMDDetails ?? [],
                PassportNo: passenger?.Optional?.PassportNo,
                PassportExpiryDate: passenger?.Optional?.PassportExpiryDate,
                PassportIssuedDate: passenger?.Optional?.PassportIssuedDate,
                FrequentFlyerNo: passenger?.Optional?.FrequentFlyerNo,
                Nationality: passenger?.Optional?.Nationality,
                ResidentCountry: passenger?.Optional?.ResidentCountry,
              },
              Meal: passenger?.Meal,
              Baggage: passenger?.Baggage,
              Seat: passenger?.Seat,
              FastForward: passenger?.FastForward,
              totalBaggagePrice: passenger?.totalBaggagePrice,
              totalFastForwardPrice: passenger?.totalFastForwardPrice,
              totalMealPrice: passenger?.totalMealPrice,
              totalSeatPrice: passenger?.totalSeatPrice,
            })
          ),
          modifyBy: req.user._id,
        });
        await passengerPreference.save();

        return {
          IsSucess: true,
          response: "Booking created successfully",

        };

        // ... save passenger preferences, etc. ...
      } else {
        return {
          ISucess: false,
          response: "Some Technical Issue"
        };
      }
    } else {
      return { ISucess: false, response: "Some Technical Issue" };
    }

  } catch (error) {
    return {
      IsSucess: false,
      response: error.message
    };
  }
};


// async function updateBarcode2DByBookingId(
//   bookingId,
//   passengerPreferencesData,
//   item,
//   pnr
// ) {
//   try {
//     const generateBarcodeUrl =
//       "http://flightapi.traversia.net/api/GenerateBarCode/GenerateBarCode";
//     const lastSectorIndex = item.Sectors.length - 1;
//     const passengerPreference = await passengerPreferenceModel.findOne({
//       bookingId: bookingId,
//     });

//     if (!passengerPreference) {
//       console.error(
//         "Passenger preference not found for booking ID:",
//         bookingId
//       );
//       return; // Exit function if document not found
//     }

//     for (let passenger of passengerPreference.Passengers) {
//       try {
//         let reqPassengerData = {
//           Company: item?.Provider,
//           TripType: "O",
//           PNR: pnr,
//           PaxId: bookingId,
//           PassangerFirstName: passenger?.FName,
//           PassangerLastName: passenger?.LName,
//           PassangetMidName: null,
//           isInfant: false,
//           MyAllData: [
//             {
//               DepartureStation: item?.Sectors[0]?.Departure?.Code,
//               ArrivalStation: item?.Sectors[lastSectorIndex]?.Arrival?.Code,
//               CarrierCode: item?.Sectors[0]?.AirlineCode,
//               FlightNumber: item?.Sectors[0]?.FltNum,
//               JulianDate: item?.Sectors[0]?.Departure?.Date,
//               SeatNo: "",
//               CheckInSeq: "N",
//             },
//           ],
//         };

//         const response = await axios.post(
//           generateBarcodeUrl,
//           reqPassengerData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const newToken = response.data;
//         if (!passenger.barCode2D) {
//           passenger.barCode2D = [];
//         }
//         // break;
//         //passengerPreference.Passengers.forEach(p => {
//         //if (p.FName === passenger.FName && p.LName === passenger.LName) {
//         passenger.barCode2D.push({
//           FCode: item?.Sectors[0]?.AirlineCode,
//           FNo: item?.Sectors[0]?.FltNum,
//           Src: item?.Sectors[0]?.Departure?.Code,
//           Des: item?.Sectors[lastSectorIndex]?.Arrival?.Code,
//           Code: newToken,
//         });
//         //}
//         //});

//         //console.log("mytoken", passenger);
//         // console.log("Barcode2D updated successfully for passenger:", passenger);
//       } catch (error) {
//         // console.error(
//         //   "Error updating Barcode2D for passenger:",
//         //   passenger,
//         //   error
//         // );
//       }
//     }
//     //console.log("mydata", passengerPreference);
//     // Save the updated document back to the database
//     await passengerPreference.save();
//     //console.log("Barcode2D updated successfully for booking ID:", bookingId);
//   } catch (error) {
//     //console.error("Error updating Barcode2D:", error);
//   }
// }


// ==================== HELPER FUNCTIONS ====================
const returnPriceBreakupArray = (itineraryItem) => {
  try {
    return itineraryItem?.PriceBreakup?.map(
      (price) => {
        return {
          PassengerType: price.PassengerType,
          NoOfPassenger: price.NoOfPassenger,
          Tax: price.Tax,
          BaseFare: price.BaseFare,
          TaxBreakup: price?.TaxBreakup?.map((tax) => ({
            TaxType: tax.TaxType,
            Amount: tax.Amount,
          })),
          CommercialBreakup: price?.CommercialBreakup?.map(
            (commercial) => ({
              CommercialType: commercial.CommercialType,
              onCommercialApply: commercial.onCommercialApply,
              Amount: commercial.Amount,
              SupplierType: commercial.SupplierType,
            })
          ),
          AgentMarkupBreakup: {
            BookingFee: price?.AgentMarkupBreakup?.BookingFee,
            Basic: price?.AgentMarkupBreakup?.Basic,
            Tax: price?.AgentMarkupBreakup?.Tax,
          },
        };
      }
    )
  } catch (error) {
    return error.message
  }
}

const sectorObjectReturn = (itineraryItem) => {
  try {
    return itineraryItem?.Sectors?.map((sector) => {
      // Construct departure and arrival objects
      const departure = {
        Terminal: sector.Departure?.Terminal,
        Date: sector.Departure?.Date,
        Time: sector.Departure?.Time,
        Day: sector.Departure?.Day,
        DateTimeStamp: sector.Departure?.DateTimeStamp,
        Code: sector.Departure?.Code,
        Name: sector.Departure?.Name,
        CityCode: sector.Departure?.CityCode,
        CityName: sector.Departure?.CityName,
        CountryCode: sector.Departure?.CountryCode,
        CountryName: sector.Departure?.CountryName,
      };

      const arrival = {
        Terminal: sector.Arrival?.Terminal,
        Date: sector.Arrival?.Date,
        Time: sector.Arrival?.Time,
        Day: sector.Arrival?.Day,
        DateTimeStamp: sector.Arrival?.DateTimeStamp,
        Code: sector.Arrival?.Code,
        Name: sector.Arrival?.Name,
        CityCode: sector.Arrival?.CityCode,
        CityName: sector.Arrival?.CityName,
        CountryCode: sector.Arrival?.CountryCode,
        CountryName: sector.Arrival?.CountryName,
      };

      // Construct sector object
      const sectorObject = {
        AirlineCode: sector.AirlineCode,
        AirlineName: sector.AirlineName,
        Class: sector.Class,
        CabinClass: sector.CabinClass,
        FltNum: sector.FltNum,
        FlyingTime: sector.FlyingTime,
        layover: sector.layover,
        Group: sector.Group,
        TravelTime: sector.TravelTime,
        HandBaggage: sector.HandBaggage,
        BaggageInfo: sector.BaggageInfo,
        Departure: departure,
        Arrival: arrival,
      };

      return sectorObject; // Return the constructed sector object
    });
  } catch (error) {
    return error.message
  }
}



const roundOffNumberValues = (numberValue) => {
  if (isNaN(numberValue)) numberValue = 0;
  const integerPart = Math.floor(numberValue);
  const fractionalPart = numberValue - integerPart;
  const result = fractionalPart >= 0.5 ? Math.ceil(numberValue) : Math.floor(numberValue);
  return result.toFixed(2);
};

const offerPricePlusInAmount = (plusKeyName) => {
  const plusTypes = ["TDS", "BookingFees", "ServiceFees", "GST", "Markup", "otherTax", "FixedBookingFees", "FixedServiceFees"];
  return plusTypes.includes(plusKeyName);
};

const offerPriceMinusInAmount = (plusKeyName) => {
  const minusTypes = ["Discount", "SegmentKickback", "Incentive", "PLB"];
  return minusTypes.includes(plusKeyName);
};

const preparePassengerArrayListForBookingApiPayload = async (allPassengerArrayList, allItineraryArrayList) => {
  const returnPassengerPayloadArrayList = JSON.parse(JSON.stringify(allPassengerArrayList));

  returnPassengerPayloadArrayList.forEach((passengerElement) => {
    let totalBasePrice = 0, totalTaxPrice = 0, totalBookingFees = 0, totalGstAmount = 0;

    allItineraryArrayList.forEach((childElement) => {
      const PriceBreakup = childElement?.PriceBreakup;
      const advanceAgentMarkup = childElement?.advanceAgentMarkup;

      PriceBreakup.forEach((priceBreakupElement) => {
        if (passengerElement?.PaxType === priceBreakupElement?.PassengerType) {
          totalBasePrice +=
            (priceBreakupElement?.BaseFare ?? 0) +
            (priceBreakupElement?.AgentMarkupBreakup?.Basic ?? 0) +
            (advanceAgentMarkup?.adult?.baseFare ?? 0);

          totalTaxPrice +=
            (priceBreakupElement?.Tax ?? 0) +
            (priceBreakupElement?.AgentMarkupBreakup?.Tax ?? 0) +
            (advanceAgentMarkup?.adult?.taxesFare ?? 0);

          totalBookingFees +=
            (priceBreakupElement?.AgentMarkupBreakup?.BookingFee ?? 0) +
            (advanceAgentMarkup?.adult?.feesFare ?? 0);

          totalGstAmount += advanceAgentMarkup?.adult?.gstFare ?? 0;

          if (priceBreakupElement?.AgentMarkupBreakup?.BookingFee) {
            totalGstAmount += priceBreakupElement?.AgentMarkupBreakup?.BookingFee;
          }

          priceBreakupElement?.CommercialBreakup?.forEach?.((commercialBreakup) => {
            const { CommercialType, Amount } = commercialBreakup;
            if (CommercialType === "Markup") totalBasePrice += Amount;
          });
        }
      });
    });

    passengerElement.totalBasePrice = totalBasePrice;
    passengerElement.totalTaxPrice = totalTaxPrice;
    passengerElement.totalBookingFees = totalBookingFees;
    passengerElement.totalGstAmount = totalGstAmount;
    passengerElement.totalPublishedPrice = totalBasePrice + totalTaxPrice + totalBookingFees + totalGstAmount + totalGstAmount;
  });

  return returnPassengerPayloadArrayList;
};

const calculateOfferedPrice = async (fareFamilyElement) => {
  let returnCalculatedOfferedPrice = 0;

  fareFamilyElement.PriceBreakup?.forEach((priceBreakupElement) => {
    const { PassengerType, NoOfPassenger, CommercialBreakup, BaseFare, Tax } = priceBreakupElement;

    if (PassengerType) {
      returnCalculatedOfferedPrice += Number(BaseFare) * NoOfPassenger;
      returnCalculatedOfferedPrice += Number(Tax) * NoOfPassenger;

      CommercialBreakup?.forEach((commercialBreakup) => {
        const { CommercialType, Amount } = commercialBreakup;

        if (offerPricePlusInAmount(CommercialType) && CommercialType !== "TDS") {
          returnCalculatedOfferedPrice += roundOffNumberValues(Amount) * NoOfPassenger;
        }

        if (offerPriceMinusInAmount(CommercialType)) {
          returnCalculatedOfferedPrice -= roundOffNumberValues(Amount) * NoOfPassenger;
        }

        if (CommercialType === "Discount" || CommercialType === "SegmentKickback") {
          const discountOrSegmentValue = roundOffNumberValues(Amount);
          returnCalculatedOfferedPrice += discountOrSegmentValue * 0.02 * NoOfPassenger;
        }
      });
    }
  });

  returnCalculatedOfferedPrice = Number(roundOffNumberValues(returnCalculatedOfferedPrice));
  return returnCalculatedOfferedPrice;
};

const calculateOfferedPriceForAll = async (ItineraryPriceCheckResponses) => {
  let totalPrice = 0;
  for (const itinerary of ItineraryPriceCheckResponses) {
    totalPrice += await calculateOfferedPrice(itinerary);
  }
  return totalPrice;
};

const getUserDetails = async (Authentication) => {
  try {
    const userDetails = await UserModel.findOne({ _id: Authentication.UserId }).populate("company_ID");
    return userDetails || "User Not Found";
  } catch (error) {
    return "User Not Found";
  }
};

const handleWalletPayment = async (getuserDetails, totalSSRWithCalculationPrice, ItineraryPriceCheckResponses, isHoldBooking, bookingId,isPkFareUpdate=false) => {
  if (isHoldBooking) return null;

  try {
    // console.log(ItineraryPriceCheckResponses,"itenaray")
    // 1️⃣ Fetch user’s company first (needed for next queries)
    const companieIds = await UserModel.findById(getuserDetails._id);

    // 2️⃣ Run these 2 queries in parallel (they don’t depend on each other)
    const [getAllCompanies, getcreditRequest] = await Promise.all([
      UserModel.find({ company_ID: companieIds.company_ID }).populate("roleId"),
      creditRequest.find({
        agencyId: getuserDetails.company_ID,
        expireDate: { $gte: new Date() },
        status: "approved",
        product: "Flight"
      }),
    ]);

    // 3️⃣ Filter and get Agency userId
    const allIds = getAllCompanies
      .filter(item => item.roleId?.name === "Agency"||item.roleId?.name === "ApiPartner")
      .map(item => item._id);

    if (!allIds.length) {
      return {
        IsSucess: false, response: "No agency found for this company."
    }
  }
    // 4️⃣ Fetch agent config in parallel with getTdsAndDiscount (if not dependent)
    const [getAgentConfig, gtTsAdDnt] = await Promise.all([
      agentConfig.findOne({ userId: allIds[0] }),
      getTdsAndDsicount(ItineraryPriceCheckResponses)
    ]);

    // 5️⃣ Credit calculation
    const creditTotal = getcreditRequest?.reduce((sum, request) => sum + request.amount, 0) || 0;
    const maxCreditLimit = getAgentConfig?.maxcreditLimit ?? 0;
    const checkCreditLimit = maxCreditLimit + creditTotal;

    if (checkCreditLimit < totalSSRWithCalculationPrice) {

      return { IsSucess: false, response: "Your Balance is not sufficient" };
    }

    // 6️⃣ Update balance
    if (isPkFareUpdate) {
      const newBalance = maxCreditLimit - totalSSRWithCalculationPrice;
      await agentConfig.updateOne({ userId: allIds[0] }, { maxcreditLimit: newBalance });

      // 7️⃣ Create ledger + transaction (parallel)
      const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000);


      await Promise.all([
        ledger.create({
          userId: allIds[0],
          companyId: getuserDetails.company_ID._id,
          ledgerId,
          transactionAmount: totalSSRWithCalculationPrice,
          currencyType: "INR",
          fop: "CREDIT",
          deal: gtTsAdDnt?.ldgrdiscount,
          tds: gtTsAdDnt?.ldgrtds,
          transactionType: "DEBIT",
          runningAmount: newBalance,
          remarks: "Booking amount deducted from your account.",
          transactionBy: getuserDetails._id,
          cartId: bookingId,
        }),

        transaction.create({
          userId: getuserDetails._id,
          companyId: getuserDetails.company_ID._id,
          trnsNo: Math.floor(100000 + Math.random() * 900000),
          trnsType: "DEBIT",
          paymentMode: "CL",
          trnsStatus: "success",
          transactionBy: getuserDetails._id,
          bookingId: bookingId,
        }),
      ]);
    }


    return null;
  } catch (error) {
    console.error("Wallet Payment Error:", error);
  return{
    isSuccess: false,
    response: error.message,
  } 
  }
};

// const createBooking = async (newItem) => {
const createBooking = async (newItem, req) => {
  try {
    const auth = req.body?.authentication;

    if (!auth?.companyId || !auth?.userId || !newItem?.bookingId) {
      throw new Error("Required booking data missing");
    }

    const bookingTempPayload = {
      companyId: auth.companyId,
      userId: auth.userId,
      source: "pkFare",
      BookingId: `${req.body.orderNumber}|${req.body.referenceId}`,
      cartId: newItem.bookingId,
      request: req.body.encryptedRQ ?? null,
      response: "Booking Save Successfully",
    };

    const [bookingDetails, bookingTemp] = await Promise.all([
      BookingDetails.create(newItem),
      BookingTemp.create(bookingTempPayload)
    ]);

    // 🔥 Non-blocking logs
    EventLogs({
      eventName: "createBooking",
      doerId: req.user?._id,
      doerName: "",
      companyId: newItem?.AgencyId,
      documentId: bookingDetails._id,
      description: "Booking created",
      ipAddress: req.user?.userIp
    }).catch(err => console.error("Event log failed", err));

    return {
      IsSucess: true,
      msg: "Booking created successfully",
      bookingId: newItem.bookingId,
      bid: bookingDetails._id
    };

  } catch (error) {
    console.error("CreateBooking Error:", error);

    return {
      IsSucess: false,
      msg: "Error creating booking",
      error: error.message
    };
  }
};

// };


const pkFareUpdateBooking = async (req, res) => {
  const { BookingInfo, cartId, Authentication, PaxInfo } = req.body;

  try {

    const titles = [
      "Mr",
      "MR",
      "mr",
      "Mrs",
      "Miss",
      "Dr",
      "MS",
      "Ms",
      "MISS",
      "MRS",
    ];

    const logData1 = {
      traceId: Authentication.TraceId,
      companyId: Authentication.CompanyId,
      userId: req.user._id,
      source: "Kafila",
      type: "Portal log",
      BookingId: cartId,
      product: "Flight",
      logName: "FULLCANCEL",
      request: req.body,
      responce: {},
    };
    Logs(logData1);

    // // console.log(req.socket.remoteAddress, "req.socket.remoteAddress");
    const bookingDetailCart = await BookingDetails.find({ bookingId: cartId, bookingStatus: { $ne: "INCOMPLETE" } })
    if (bookingDetailCart.length > 0) {
      return {
        IsSucess: false,
        response: "allready update this card"
      }
    }


    if (!BookingInfo || !cartId || !Authentication) {
      return { IsSucess: false, response: "Missing required fields" }
    }

    let totalRefundAmount = 0;



    // Loop through each booking item
    for (const item of BookingInfo) {
      const isFailed =
        item?.BookingStatus?.toLowerCase() === "failed" ||
        item?.CurrentStatus === "FAILED";

      // ============ 🔴 FAILED BOOKING HANDLER =============
      if (isFailed) {
        const errorMessage = item?.ErrorMessage || item?.BookingRemark || "Booking failed";

        // Update booking details to FAILED
        await BookingDetails.updateMany(
          {
            bookingId: cartId,
            "itinerary.Sectors.Departure.CityCode": item.Src,
            "itinerary.Sectors.Arrival.CityCode": item.Des,
            bookingStatus: { $ne: "CONFIRMED" },
          },
          {
            $set: {
              bookingStatus: "FAILED",
              bookingRemarks: errorMessage,
            },
          }
        );

        // Calculate refund amount for failed bookings
        const failedBookings = await BookingDetails.find(
          { bookingId: cartId, bookingStatus: "FAILED" },
          { bookingTotalAmount: 1 }
        );

        const refundAmount = failedBookings.reduce(
          (sum, b) => sum + (b.bookingTotalAmount || 0),
          0
        );

        totalRefundAmount += refundAmount;
        continue; // skip next logic for failed booking
      }

      // ============ ✅ CONFIRMED OR PENDING BOOKING =============
      const confirmedBooking = await BookingDetails.findOneAndUpdate(
        { bookingId: cartId },
        {
          $set: {
            "itinerary.LastTicketingDate": item?.LastTicketingTime || "",
            bookingStatus: item?.CurrentStatus || "PENDING",
            bookingRemarks: item?.BookingRemark || "",
            providerBookingId: item?.BookingId || "",
            PNR: item?.APnr || "",
            APnr: item?.APnr || "",
            GPnr: item?.GPnr || "",
            SalePurchase: item?.SalePurchase?.ATDetails?.Account || "",
          },
        }, { new: true }
      );

      let logsData = {
        eventName: "updateBooking",
        doerId: req.user._id,
        doerName: "",
        oldValue: { bookingStatus: "INCOMPLETE" },
        newValue: confirmedBooking,
        companyId: Authentication.AgencyId,
        documentId: confirmedBooking._id,
        description: "cancellation Charege",
        ipAddress: req.user.userIp
      }
      EventLogs(logsData)

      await updateBarcode2DByBookingId(confirmedBooking?.bookingId, null, confirmedBooking?.itinerary, item?.GPnr)

      // ============ 🧾 UPDATE PASSENGER PREFERENCE =============
      const passengerPref = await passengerPreferenceModel.findOne({ bookingId: cartId });

      if (passengerPref?.Passengers?.length) {
        const isConfirmed = item.CurrentStatus === "CONFIRMED";

        passengerPref.Passengers.forEach((passenger) => {
          const matchedPax = PaxInfo?.Passengers?.find((p) => {
            const filteredFName = p.FName.split(" ")
              .filter((word) => !titles.includes(word))
              .join(" ");
            return (
              filteredFName === passenger.FName.toUpperCase() &&
              p.LName === passenger.LName.toUpperCase()
            );
          });

          passenger.Optional.EMDDetails = [
            ...(passenger.Optional.EMDDetails || []),
            ...(matchedPax?.Optional?.EMDDetails || []),
          ];

          if (matchedPax) {
            (passenger.Optional?.ticketDetails || []).forEach((ticket) => {

              // Update status
              ticket.status = isConfirmed ? "CONFIRMED" : item?.CurrentStatus;

              // Find matching ticket from matchedPax
              const found = matchedPax.Optional?.ticketDetails?.find(
                (t) => t.src === ticket.src && t.des === ticket.des
              );

              // Update ticket number only if found
              ticket.ticketNumber = found?.ticketNumber || ticket.ticketNumber;
            });
          }

        });

        await passengerPref.save();
      }
    }

    // ============ 💰 REFUND HANDLER =============
    if (totalRefundAmount > 0) {
      const userDetails = await UserModel.findById(Authentication.UserId);
      const agentConfigData = await agentConfig.findOne({
        userId: Authentication.UserId,
      });

      const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000);

      await ledger.create({
        userId: Authentication.UserId,
        companyId: userDetails?.company_ID?._id,
        ledgerId,
        transactionAmount: totalRefundAmount,
        currencyType: "INR",
        fop: "DEBIT",
        transactionType: "CREDIT",
        runningAmount: (agentConfigData?.maxcreditLimit || 0) + totalRefundAmount,
        remarks: "Refund processed for booking",
        transactionBy: userDetails?._id,
        cartId,
      });

      await agentConfig.updateOne(
        { userId: Authentication.UserId },
        { $inc: { maxcreditLimit: totalRefundAmount } }
      );
    }

    // ============ ✅ FINAL SUCCESS RESPONSE =============
    return {
      IsSucess: true,
      response: "Booking updated successfully",

    };
  } catch (error) {
    console.error("Booking Update Error:", error.message);

    const logData1 = {
      traceId: Authentication.TraceId,
      companyId: Authentication.CompanyId,
      userId: req.user._id,
      source: "Kafila",
      type: "Portal log",
      BookingId: cartId,
      product: "Flight",
      logName: "FULLCANCEL",
      request: req.body,
      responce: error,
    };
    Logs(logData1);

    const status = error.message?.toLowerCase().includes("socket hang up")
      ? "PENDING"
      : "FAILED";

    await BookingDetails.updateOne(
      {
        bookingId: req.body?.cartId,
        bookingStatus: { $ne: "CONFIRMED" },
      },
      {
        $set: {
          bookingStatus: status,
          bookingRemarks: error.message,
        },
      }
    );

    return {
      IsSucess: false,
      response: error.message,
    };
  }
};




const gernrateCartId = async (Authenticaion) => {
  let url = `${Config[Authenticaion.CredentialType ?? "TEST"].baseURLBackend}/api/flightbooking/idcreation`
  let body = {
    companyId: Authenticaion?.CompanyId ?? Config?.TMCID
  }
  try {
    const response = await axios.post(url, body);
    return response.data.Result;
  } catch (error) {
    console.error("Error generating cartId:", error.message);
    return null;
  }

}





// cancel Request for PkFare



const cancelRequestForPkFare = async (req, res) => {
  try {
    const journey = req.body?.journey?.[0];
    const authData = req.body?.authentication;

    // Extract data safely
    const pnr = journey?.recLoc?.[0]?.pnr || "";
    const bookingStatus = journey?.bookingStatus || "";

    // Validate PNR
    if (!pnr) {
      throw new Error("PNR not found");
    }

    // Validate booking status
    if (bookingStatus.toLowerCase() !== "cancelled") {
      throw new Error("Booking is not cancelled");
    }

    // Build authentication
    const Authentication = makeAuthentication(authData);

    // Check user
    const [checkUserRole, bookingData] = await Promise.all([UserModel.findById(req.user._id), BookingDetails.findOne({ PNR: pnr })
    ]);
    if (!checkUserRole) {
      throw new Error("User not found");
    }

    if (!bookingData) {
      throw new Error("No booking found with given PNR");
    }

    if (bookingData.bookingStatus !== "CONFIRMED") {
      throw new Error("Booking is not in confirmed status");
    }



    // Update booking
    const booking = await BookingDetails.findOneAndUpdate(
      { PNR: pnr, bookingStatus: "CONFIRMED" },
      {
        $set: {
          bookingStatus: "CANCELLATION PENDING",
          bookingRemarks: req.body?.remarks || "",
          cancelationDate: Date.now(),
        },
      },
      { new: true }
    );

    if (!booking) {
      throw new Error("Booking not found with given PNR");
    }

    // --------------------------
    // 🔥 Run both functions in parallel
    // --------------------------
    await Promise.all([
      updateStatus(booking, "CANCELLATION PENDING"),
      cancelationDataUpdate(Authentication, {}, booking, req, checkUserRole)
    ]);

    // Success response
    return res.json({
      isSuccess: true,
      "ResponseStatusCode": 200,
      Message: "Cancellation request processed successfully",
      Result: booking
    });

  } catch (error) {
    // console.error("Cancellation Error:", error);

    return res.status(400).json({
      isSuccess: false,
      "ResponseStatusCode": 400,
      Message: error.message,
    });
  }
};

const getRequestOrderNumberPkFare = async (req, res) => {
  try {
    const { authentication, orderNumber, referenceId } = req.body;

    const requiredFields = ["authentication", "orderNumber", "referenceId"];
    const missingFields = requiredFields.filter(
      field => req.body[field] === undefined || req.body[field] === null
    );

    if (missingFields.length) {
      return res.status(400).json({
        IsSucess: false,
        Message: `Missing fields: ${missingFields.join(", ")}`,
        Result: null
      });
    }

    const bookingId = `${orderNumber}|${referenceId}`;

    const [bookingTemp,loginUser] = await Promise.all([BookingTemp.findOne(
      { BookingId: bookingId,count:0 },
      { request: 1, cartId:1 , _id: 1 }   // 🔥 optimization
    ).lean(),
     UserModel.findById(req.user._id).lean()])


    if (!bookingTemp) {
      return res.status(400).json({
        IsSucess: false,
        Message: "No Booking Found For This BookingId",
        Result: null
      });
    }

    let bookingData=await BookingDetails.findOne({ bookingId: bookingTemp.cartId })
        .select("bookingTotalAmount itinerary")
        .lean()
    if(!bookingData){
      return res.status(400).json({
        IsSucess: false,
        Message: "No Booking Found For This BookingId",
        Result: null
      });
    }
   let amountDeduct=await handleWalletPayment(loginUser, bookingData?.bookingTotalAmount, [bookingData?.itinerary], false, bookingTemp.cartId,true)

   if(amountDeduct){
    return res.status(400).json({
      IsSucess: false,
      Message: amountDeduct.response,
      Result: null
    });
   }

   await BookingTemp.findByIdAndUpdate(bookingTemp._id, {
    $inc: { count: 1 },
   }, { new: true });
    return res.status(200).json({
      IsSucess: true,
      Message: "Success",
      Result: bookingTemp.request,
      cartId: bookingTemp.cartId
    });

  } catch (error) {
    console.error("getRequestPkFare Error:", error);
    return res.status(500).json({
      IsSucess: false,
      Message: "Internal Server Error",
      Result: null
    });
  }
};

module.exports = {
  pkFareStartBooking,
  pkFareUpdateBooking,
  cancelRequestForPkFare,
  getRequestOrderNumberPkFare
  //   updateBarcode2DByBookingId,
};
