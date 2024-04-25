const flightcommercial = require("./flight.commercial");
const PromoCode = require("../../models/AirlinePromoCode");
const Company = require("../../models/Company");
const Supplier = require("../../models/Supplier");
const Role = require("../../models/Role");
const UserModel = require("../../models/User");
const ledger = require("../../models/Ledger");
const creditRequest = require("../../models/CreditRequest");
const transaction = require("../../models/transaction");
const agentConfig = require("../../models/AgentConfig");
const fareFamilyMaster = require("../../models/FareFamilyMaster");
const passengerPreferenceModel = require("../../models/booking/PassengerPreference");
const BookingDetails = require("../../models/booking/BookingDetails");
const moment = require('moment');
const axios = require("axios");
const uuid = require("uuid");
const NodeCache = require("node-cache");
const flightCache = new NodeCache();

const startBooking = async (req, res) => {
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
    paymentMethodType
  } = req.body;
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
  if (!companyId || !UserId) {
    return {
      response: "Company or User id field are required",
    };
  }

  // Check if company Id exists
  const checkCompanyIdExist = await Company.findById(companyId);
  if (!checkCompanyIdExist || checkCompanyIdExist.type !== "TMC") {
    return {
      response: "TMC Compnay id does not exist",
    };
  }
  // Also CHeck Role Of TMC by Company Id( PENDING )
  // Logs Pending

  // Check Travel Type ( International / Domestic )
  let result;
  if (TravelType !== "International" && TravelType !== "Domestic") {
    return {
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
      paymentMethodType
    );
  }

  if (!result.IsSucess) {
    return {
      response: result.response,
    };
  } else {
    return {
      response: "Fetch Data Successfully",
      data: result.response,
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
  paymentMethodType
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
  const supplierCredentials = await Supplier.find({
    companyId: CompanyId,
    credentialsType: CredentialType,
    status: true,
  })
    .populate({
      path: "supplierCodeId",
      select: "supplierCode",
    })
    .exec();
  if (!supplierCredentials || !supplierCredentials.length) {
    return {
      IsSucess: false,
      response: "Supplier credentials does not exist",
    };
  }

  // GET PromoCode
  //  const getPromoCode = await PromoCode.find({ companyId: CompanyId, supplierCode: supplierCredentials });
  // console.log("aaaaaaaaaaaaaaaaaaaaaaa" + fareTypeVal);
  // return false

  if (!TraceId) {
    return {
      IsSucess: false,
      response: "Trace Id Required",
    };
  }

  //airline promo code query here
  // Commertial query call here ( PENDING )
  // Supplier API Integration Start Here ....
  const responsesApi = await Promise.all(
    supplierCredentials.map(async (supplier) => {
      try {
        switch (supplier.supplierCodeId.supplierCode) {
          case "Kafila":
            // check here airline promoCode if active periority first agent level then group level
            return await KafilaFun(
              Authentication,
              supplier,
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
              supplier.supplierCodeId.supplierCode,
              PassengerPreferences,
              ItineraryPriceCheckResponses,
              paymentMethodType
            );

          default:
            throw new Error(
              `Unsupported supplier: ${supplier.supplierCodeId.supplierCode}`
            );
        }
      } catch (error) {
        return { error: error.message, supplier: supplier };
      }
    })
  );
  // delete this one
  return {
    IsSucess: true,
    response: responsesApi.flat(),
  }; 
}

const KafilaFun = async (
  Authentication,
  supplier,
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
  Provider,
  PassengerPreferences,
  ItineraryPriceCheckResponses,
  paymentMethodType
) => {
  
  let createTokenUrl;
  let flightSearchUrl;
  // Apply APi for Type of trip ( ONEWAY / ROUNDTRIP / MULTYCITY )
  if (!["MULTYCITY", "ONEWAY", "ROUNDTRIP"].includes(TypeOfTrip)) {
    return {
      IsSucess: false,
      response: "Type of trip does not exist",
    };
  }

  // add api with here oneway round multicity
  let credentialType = "D";
  if (Authentication.CredentialType === "LIVE") {
    // Live Url here
    credentialType = "P";
    createTokenUrl = `http://fhapip.ksofttechnology.com/api/Freport`;
    flightSearchUrl = `http://fhapip.ksofttechnology.com/api/FPNR`;
  } else {
    // Test Url here
    createTokenUrl = `http://stage1.ksofttechnology.com/api/Freport`;
    flightSearchUrl = `http://stage1.ksofttechnology.com/api/FPNR`;
  }
  let getuserDetails;
  try {
     getuserDetails = await UserModel.findOne({
      _id: Authentication.UserId,
    }).populate('company_ID');
    if (getuserDetails) {
      getuserDetails = getuserDetails;
    } else {
      getuserDetails = "User Not Found";
    } 
  } catch (error) {
    // console.error('Error creating booking:', error);
    getuserDetails = "User Not Found";

  } 

  let tripTypeValue;
  if (TravelType == "International") {
    switch (TypeOfTrip) {
      case "ONEWAY":
        tripTypeValue = "I1";
        break;
      case "ROUNDTRIP":
        tripTypeValue = "I2";
        break;
      case "MULTYCITY":
        tripTypeValue = "I3";
        break;
      default:
        return {
          IsSucess: false,
          response: "Invalid TypeOfTrip",
        };
    }
  } else if (TravelType == "Domestic") {
    switch (TypeOfTrip) {
      case "ONEWAY":
        tripTypeValue = "D1";
        break;
      case "ROUNDTRIP":
        tripTypeValue = "D2";
        break;
      case "MULTYCITY":
        tripTypeValue = "D3";
        break;
      default:
        return {
          IsSucess: false,
          response: "Invalid TypeOfTrip",
        };
    }
  } else {
    return {
      IsSucess: false,
      response: "Invalid TypeOfTrip",
    };
  }
  
  // Calculate Balance with commercial 
const preparePassengerArrayListForBookingApiPayload = async (allPassengerArrayList,allItineraryArrayList) => {  
    let returnPassengerPayloadArrayList = allPassengerArrayList;            
        
      returnPassengerPayloadArrayList.forEach((passengerElement) => {
          
          let totalBasePrice = 0, totalTaxPrice = 0, totalBookingFees = 0, totalGstAmount = 0;
          
          allItineraryArrayList.forEach((childElement) => {
              let PriceBreakup = childElement?.PriceBreakup;
              let advanceAgentMarkup = childElement?.advanceAgentMarkup;
  
              PriceBreakup.forEach((priceBreakupElement) => {
                if (
                    passengerElement?.PaxType ==
                    priceBreakupElement?.PassengerType
                ) {
                  
                    totalBasePrice +=
                        priceBreakupElement?.BaseFare +
                        priceBreakupElement?.AgentMarkupBreakup?.Basic +
                        advanceAgentMarkup?.adult?.baseFare;
    
                    totalTaxPrice +=
                        priceBreakupElement?.Tax +
                        priceBreakupElement?.AgentMarkupBreakup?.Tax +
                        advanceAgentMarkup?.adult?.taxesFare;
    
                    totalBookingFees +=
                        priceBreakupElement?.AgentMarkupBreakup?.BookingFee +
                        advanceAgentMarkup?.adult?.feesFare;
                        
                    totalGstAmount += advanceAgentMarkup?.adult?.gstFare;
                    if (priceBreakupElement?.AgentMarkupBreakup?.BookingFee)
                        totalGstAmount +=
                            priceBreakupElement?.AgentMarkupBreakup?.BookingFee
                             //* new AppSetting().gstPercentageAmount;
    
                    priceBreakupElement?.CommercialBreakup.forEach(
                        (commercialBreakup) => {
                            let { CommercialType, Amount } = commercialBreakup;
                            if (CommercialType == "Markup") totalBasePrice += Amount;
                        }
                    );

                    
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
}

// Example usage:
const getAllPriceAppliedPessengerwise = await preparePassengerArrayListForBookingApiPayload(PassengerPreferences.Passengers, ItineraryPriceCheckResponses);
let totalssrPrice = 0;

for (const passenger of getAllPriceAppliedPessengerwise) {
  totalssrPrice += (passenger.totalMealPrice || 0) + (passenger.totalSeatPrice || 0) + (passenger.totalBaggagePrice || 0);    
}
//return totalssrPrice;

// function prepareAppliedCommercialArrayList(selectedReprizedItenary) {
//   let adultCommercialArrayList = [];
//   let childCommercialArrayList = [];
//   let infantsCommercialArrayList = [];  
//   if (selectedReprizedItenary?.PriceBreakup[0]?.PassengerType == "ADT")
//     adultCommercialArrayList = selectedReprizedItenary?.PriceBreakup[0]?.CommercialBreakup;
//   if (selectedReprizedItenary?.PriceBreakup[1]?.PassengerType == "CHD")
//     childCommercialArrayList = selectedReprizedItenary?.PriceBreakup[1]?.CommercialBreakup;
//   if (selectedReprizedItenary?.PriceBreakup[2]?.PassengerType == "INF")
//     infantsCommercialArrayList = selectedReprizedItenary?.PriceBreakup[2]?.CommercialBreakup;
//   //console.log(adultCommercialArrayList)
//   adultCommercialArrayList = calculateCommercialBreakupArray(adultCommercialArrayList, childCommercialArrayList);
//   adultCommercialArrayList = calculateCommercialBreakupArray(adultCommercialArrayList, infantsCommercialArrayList);

//   return adultCommercialArrayList;
// }

// const oneWayItinerary = prepareAppliedCommercialArrayList(ItineraryPriceCheckResponses[0]);


// let returnItinerary = [];

// if (ItineraryPriceCheckResponses.length >= 1) {
  
//   returnItinerary = prepareAppliedCommercialArrayList(ItineraryPriceCheckResponses[1]);
// }

// const allCommercialList = [...oneWayItinerary, ...returnItinerary];
// function calculateCommercialBreakupArray(parentArrayList, childArrayList) {
//   parentArrayList.forEach((parentElement) => {
//     childArrayList.forEach((childElement) => {
//       parentElement.Amount = Number(parentElement.Amount);
//       if (parentElement?.CommercialType == childElement?.CommercialType)
//         parentElement.Amount += Number(childElement?.Amount);
//     });
//   });
//   return parentArrayList;
// }

// function removeDuplicateCommercialTypeButKeepUpperPrice(allResultArrayList) {
//   const result = Object.values(
//     allResultArrayList.reduce((reduced, objectElement) => {
//       if (!reduced[objectElement?.CommercialType] ||
//         objectElement?.Amount > reduced[objectElement?.CommercialType]?.Amount)
//         reduced[objectElement?.CommercialType] = objectElement;

//       return reduced;
//     }, {})
//   );
//   return result;
// }

// const uniqueCommercialList = removeDuplicateCommercialTypeButKeepUpperPrice(allCommercialList);
// return uniqueCommercialList
function offerPricePlusInAmount(plusKeyName) {
  let returnBoolean = false;
  switch (plusKeyName) {
    case "TDS":
      returnBoolean = true;
      break;
    case "BookingFees":
      returnBoolean = true;
      break;
    case "ServiceFees":
      returnBoolean = true;
      break;
    case "GST":
      returnBoolean = true;
      break;
    case "Markup":
      returnBoolean = true;
      break;

    default:
      returnBoolean = false;
      break;
  }
  return returnBoolean;
}

function offerPriceMinusInAmount(plusKeyName) {
  let returnBoolean = false;
  switch (plusKeyName) {
    case "Discount":
      returnBoolean = true;
      break;
    case "SegmentKickback":
      returnBoolean = true;
      break;
    case "Incentive":
      returnBoolean = true;
      break;
    case "PLB":
      returnBoolean = true;
      break;

    default:
      returnBoolean = false;
      break;
  }
  return returnBoolean;
}


const calculateOfferedPrice = async (fareFamiliyElement) => {
  let returnCalculatedOfferedPrice = 0,
    adultPriceCalculate = 0,
    childPriceCalculate = 0,
    infantPriceCalculate = 0;

  fareFamiliyElement.PriceBreakup?.forEach((priceBreakupElement) => {
    let { PassengerType, NoOfPassenger, CommercialBreakup, BaseFare, Tax } =
      priceBreakupElement;

    if (PassengerType == "ADT") {
      adultPriceCalculate = Number(BaseFare) * NoOfPassenger;
      adultPriceCalculate += Number(Tax) * NoOfPassenger;
      CommercialBreakup?.forEach((commercialBreakup) => {
        let { CommercialType, Amount } = commercialBreakup;
        if (offerPriceMinusInAmount(CommercialType))
          adultPriceCalculate -= Number(Amount) * NoOfPassenger;
        else if (offerPricePlusInAmount(CommercialType))
          adultPriceCalculate += Number(Amount) * NoOfPassenger;
      });
    } else if (PassengerType == "CHD") {
      childPriceCalculate = Number(BaseFare) * NoOfPassenger;
      childPriceCalculate += Number(Tax) * NoOfPassenger;
      CommercialBreakup?.forEach((commercialBreakup) => {
        let { CommercialType, Amount } = commercialBreakup;
        if (offerPriceMinusInAmount(CommercialType))
          childPriceCalculate -= Number(Amount) * NoOfPassenger;
        else if (offerPricePlusInAmount(CommercialType))
          childPriceCalculate += Number(Amount) * NoOfPassenger;
      });
    } else if (PassengerType == "INF") {
      infantPriceCalculate = Number(BaseFare) * NoOfPassenger;
      infantPriceCalculate += Number(Tax) * NoOfPassenger;
      CommercialBreakup?.forEach((commercialBreakup) => {
        let { CommercialType, Amount } = commercialBreakup;
        if (offerPriceMinusInAmount(CommercialType))
          infantPriceCalculate -= Number(Amount) * NoOfPassenger;
        else if (offerPricePlusInAmount(CommercialType))
          infantPriceCalculate += Number(Amount) * NoOfPassenger;
      });
    }
  });

  returnCalculatedOfferedPrice =
    adultPriceCalculate + childPriceCalculate + infantPriceCalculate;
  return returnCalculatedOfferedPrice;
}
async function calculateOfferedPriceForAll() {
  let calculationOfferPriceWithCommercial = 0; // Initialize to 0
  for (const itinerary of ItineraryPriceCheckResponses) {
    calculationOfferPriceWithCommercial += await calculateOfferedPrice(itinerary);    
  }
  return calculationOfferPriceWithCommercial;
}

const calculationOfferPriceWithCommercial = await calculateOfferedPriceForAll();

// Check Balance Available or Not Available
const totalSSRWithCalculationPrice = calculationOfferPriceWithCommercial + totalssrPrice;

try {
  // Retrieve agent configuration
  const getAgentConfig = await agentConfig.findOne({ userId: getuserDetails._id });
  const getcreditRequest = await creditRequest.find({
    agencyId: getuserDetails.company_ID,
    expireDate: { $gte: new Date() }, // Assuming "expireDate" is a date field and you want to find requests that haven't expired yet
    status: 'approved',
    product: 'Flight'
  });
  let creditTotal = 0;
  if(getcreditRequest && getcreditRequest.length > 0){
    
    getcreditRequest.forEach(request => {
      creditTotal += request.amount;
    });
  }else{
    creditTotal = 0;
  }
  // Check if maxCreditLimit exists, otherwise set it to 0
  const checkCreditLimit = getAgentConfig?.maxcreditLimit ?? 0 + creditTotal;
  const maxCreditLimit = getAgentConfig?.maxcreditLimit ?? 0;

  // Check if balance is sufficient
  if (checkCreditLimit < totalSSRWithCalculationPrice) {
    return "Your Balance is not sufficient";
  }

  // Deduct balance from user configuration and update in DB
  const newBalance = maxCreditLimit - totalSSRWithCalculationPrice; 
  await agentConfig.updateOne({ userId: getuserDetails._id }, { maxcreditLimit: newBalance });

  // Generate random ledger ID
  const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
  
  // Create ledger entry
  await ledger.create({
    userId: getuserDetails._id,
    companyId: getuserDetails.company_ID._id,
    ledgerId: ledgerId,
    transactionAmount: totalSSRWithCalculationPrice,
    currencyType: "INR",
    fop: "Credit",
    transactionType: "Debit",
    runningAmount: newBalance,
    remarks: "Booking Amount Added Into Your Account.",
    transactionBy: getuserDetails._id,
    cartId: ItineraryPriceCheckResponses[0].BookingId
  });
  
  // Create transaction Entry
  await transaction.create({
    userId: getuserDetails._id,
    companyId: getuserDetails.company_ID._id,
    trnsNo: Math.floor(100000 + Math.random() * 900000),        
    trnsType: "Debit",
    paymentMode:"CL",
    trnsStatus:"success",
    transactionBy: getuserDetails._id,
    bookingId: ItineraryPriceCheckResponses[0].BookingId
  });
  

  //return addToLedger;
} catch (error) {
  // Handle errors
  console.error("Error:", error.message);
  return "An error occurred. Please try again later.";
}


// Calculation End here
// return totalSSRWithCalculationPrice;

  let tokenData = {
    P_TYPE: "API",
    R_TYPE: "FLIGHT",
    R_NAME: "GetToken",
    AID: supplier.supplierWsapSesssion,
    UID: supplier.supplierUserId,
    PWD: supplier.supplierPassword,
    Version: "1.0.0.0.0.0",
  };

  try {
    let response = await axios.post(createTokenUrl, tokenData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.Status === "success") {      
      const createBooking = async (newItem) => {
        try {          
            let bookingDetailsCreate = await BookingDetails.create(newItem);

            return {
              msg: "Booking created successfully",
              bookingId: newItem.bookingId,
              bid: bookingDetailsCreate._id,
            };          
         
        } catch (error) {
          // console.error('Error creating booking:', error);
          return {
            IsSucess: false,
            response: "Error creating booking:",
            error,
          };
        }
      };
      try {
        const existingBooking = await BookingDetails.findOne({
          bookingId: ItineraryPriceCheckResponses[0].BookingId,
        });
        if (existingBooking) {
          return {
            msg: "Booking already exists",
            bookingId: newItem.bookingId,
          };
        } 
      } catch (error) {
        // console.error('Error creating booking:', error);
        return {
          IsSucess: false,
          response: "Error creating booking:",
          error,
        };
      }
      
      const newArray = await Promise.all(
        ItineraryPriceCheckResponses?.map(async (itineraryItem) => {
          if(itineraryItem.Provider === "Kafila"){
            const sectorsArray = itineraryItem?.Sectors?.map((sector) => {
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
                TravelTime: sector.TravelTime,
                Departure: departure,
                Arrival: arrival,
              };
        
              return sectorObject; // Return the constructed sector object
            });
        
            // Construct PriceBreakup array
            const priceBreakupArray = itineraryItem?.PriceBreakup?.map((price) => {
              return {
                PassengerType: price.PassengerType,
                NoOfPassenger: price.NoOfPassenger,
                Tax: price.Tax,
                BaseFare: price.BaseFare,
                TaxBreakup: price?.TaxBreakup?.map((tax) => ({
                  TaxType: tax.TaxType,
                  Amount: tax.Amount,
                })),
                CommercialBreakup: price?.CommercialBreakup?.map((commercial) => ({
                  CommercialType: commercial.CommercialType,
                  onCommercialApply: commercial.onCommercialApply,
                  Amount: commercial.Amount,
                  SupplierType: commercial.SupplierType,
                })),
                AgentMarkupBreakup: {
                  BookingFee: price?.AgentMarkupBreakup?.BookingFee,
                  Basic: price?.AgentMarkupBreakup?.Basic,
                  Tax: price?.AgentMarkupBreakup?.Tax,
                },
              };
            });
        
            // Construct item object with populated itineraryArray
            const newItem = {
              userId: Authentication?.UserId,
              companyId: Authentication?.CompanyId,
              bookingId: itineraryItem?.BookingId, // Changed from item?.BookingId to itineraryItem?.BookingId
              prodBookingId: itineraryItem?.IndexNumber,
              provider: itineraryItem?.Provider,
              bookingType: "Automated",
              bookingStatus: "PENDING",
              bookingTotalAmount: itineraryItem?.GrandTotal, // Changed from item?.GrandTotal to itineraryItem?.GrandTotal
              Supplier: itineraryItem?.ValCarrier, // Changed from item?.ValCarrier to itineraryItem?.ValCarrier
              travelType: TravelType,
              bookingTotalAmount:itineraryItem.offeredPrice + itineraryItem.totalMealPrice + itineraryItem.totalBaggagePrice + itineraryItem.totalSeatPrice,
              totalMealPrice: itineraryItem.totalMealPrice,
              totalBaggagePrice: itineraryItem.totalBaggagePrice,
              totalSeatPrice: itineraryItem.totalSeatPrice,
              itinerary: {
                UID: itineraryItem.UID,
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
                advanceAgentMarkup:{        
                  adult: {
                    baseFare: itineraryItem.advanceAgentMarkup.adult.baseFare,
                    taxesFare: itineraryItem.advanceAgentMarkup.adult.taxesFare,
                    feesFare: itineraryItem.advanceAgentMarkup.adult.feesFare,
                    gstFare: itineraryItem.advanceAgentMarkup.adult.gstFare,
                  },
                  child: {
                    baseFare: itineraryItem.advanceAgentMarkup.child.baseFare,
                    taxesFare: itineraryItem.advanceAgentMarkup.child.taxesFare,
                    feesFare: itineraryItem.advanceAgentMarkup.child.feesFare,
                    gstFare: itineraryItem.advanceAgentMarkup.child.gstFare,
                  },
                  infant: {
                    baseFare: itineraryItem.advanceAgentMarkup.infant.baseFare,
                    taxesFare: itineraryItem.advanceAgentMarkup.infant.taxesFare,
                    feesFare: itineraryItem.advanceAgentMarkup.infant.feesFare,
                    gstFare: itineraryItem.advanceAgentMarkup.infant.gstFare,
                  }
              },
                PriceBreakup: priceBreakupArray,
                Sectors: sectorsArray,
              },
            };
        
            return await createBooking(newItem); // Call function to create booking
         }
        })
      );
      

        
      // return newArray;
      //console.log(newArray);
      if (Array.isArray(newArray) && newArray.length > 0) {
        const response = newArray[0];       
        
        if (response.msg === "Booking created successfully") {
          const passengerPreferencesData = PassengerPreferences;
          const passengerPreference = new passengerPreferenceModel({
            userId: Authentication?.UserId,
            companyId: Authentication?.CompanyId,
            bookingId: response?.bookingId,
            bid: response?.bid,
            GstData:passengerPreferencesData?.GstData,
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
                  TicketNumber: passenger?.Optional?.TicketNumber,
                  PassportNo: passenger?.Optional.PassportNo,
                  PassportExpiryDate: passenger?.Optional?.PassportExpiryDate,
                  FrequentFlyerNo: passenger?.Optional?.FrequentFlyerNo,
                  Nationality: passenger?.Optional?.Nationality,
                  ResidentCountry: passenger?.Optional?.ResidentCountry,
                },
                Meal: passenger?.Meal,
                Baggage: passenger?.Baggage,
                Seat: passenger?.Seat,                
                totalBaggagePrice: passenger?.totalBaggagePrice,
                totalMealPrice: passenger?.totalMealPrice,
                totalSeatPrice: passenger?.totalSeatPrice,
              })
            ),
            modifyBy: Authentication?.UserId,
          });
          await passengerPreference.save();
          
          const hitAPI = await Promise.all(
            ItineraryPriceCheckResponses.map(async (item) => {
              
              let requestDataFSearch = {
                FareChkRes: {
                  Error: item.Error,
                  IsFareUpdate: item.IsFareUpdate,
                  IsAncl: item.IsAncl,
                  Param: item.Param,
                  SelectedFlight: [item.SelectedFlight],
                  FareBreakup: item.FareDifference,
                  GstData: item.GstData,
                  Ancl: null,
                },
                PaxInfo: PassengerPreferences,
              };
    
              try {
                let fSearchApiResponse = await axios.post(
                  flightSearchUrl,
                  requestDataFSearch,
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
    
                if (fSearchApiResponse.data.Status == "failed") {
                  await BookingDetails.updateOne(
                    { bookingId: item?.BookingId, "itinerary.IndexNumber": item.IndexNumber }, 
                    { $set: { bookingStatus: "FAILED",
                      bookingRemarks: error.message                    
                    } }
                  );
                  
                  // Ledget Create After booking Failed 
                  const getAgentConfigForUpdate = await agentConfig.findOne({ userId: getuserDetails._id });
                  // Check if maxCreditLimit exists, otherwise set it to 0
                  const maxCreditLimitPrice = getAgentConfigForUpdate?.maxcreditLimit ?? 0;
                  const newBalanceCredit = maxCreditLimitPrice + item?.offeredPrice + item?.totalMealPrice + item?.totalBaggagePrice + item?.totalSeatPrice;
                  await agentConfig.updateOne({ userId: getuserDetails._id }, { maxcreditLimit: newBalanceCredit });
                  await ledger.create({
                    userId: getuserDetails._id,
                    companyId: getuserDetails.company_ID._id,
                    ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
                    transactionAmount: item?.offeredPrice + item?.totalMealPrice + item?.totalBaggagePrice + item?.totalSeatPrice,
                    currencyType: "INR",
                    fop: "Credit",
                    transactionType: "CREDIT",
                    runningAmount: newBalanceCredit,
                    remarks: "Booking Amount Added Into Your Account.",
                    transactionBy: getuserDetails._id,
                    cartId: item?.BookingId
                  });
  
                  return `${fSearchApiResponse.data.ErrorMessage}-${fSearchApiResponse.data.WarningMessage}`;
                }
                const bookingResponce = {
                    CartId: item.BookingId,
                    bookingResponce: { 
                        CurrentStatus: fSearchApiResponse.data.BookingInfo.CurrentStatus,
                        BookingStatus: fSearchApiResponse.data.BookingInfo.BookingStatus,
                        BookingRemark: fSearchApiResponse.data.BookingInfo.BookingRemark,
                        BookingId: fSearchApiResponse.data.BookingInfo.BookingId,
                        PNR: fSearchApiResponse.data.BookingInfo.APnr,
                        Type: fSearchApiResponse.data.BookingInfo.GPnr,
                        APnr:fSearchApiResponse.data.BookingInfo.APnr,
                        GPnr:fSearchApiResponse.data.BookingInfo.GPnr                        
                    }, 
                    itinerary: item,
                    PassengerPreferences:PassengerPreferences,
                    userDetails:getuserDetails           
                  };
                  await BookingDetails.updateOne(
                    { bookingId: item?.BookingId, "itinerary.IndexNumber": item.IndexNumber }, 
                    { $set: { bookingStatus: fSearchApiResponse.data.BookingInfo.CurrentStatus,
                      bookingRemarks: fSearchApiResponse.data.BookingInfo.BookingRemark,
                      PNR: fSearchApiResponse.data.BookingInfo.APnr,                        
                      APnr:fSearchApiResponse.data.BookingInfo.APnr,
                      GPnr:fSearchApiResponse.data.BookingInfo.GPnr,                      
                    } }
                  );
                    
                  if(fSearchApiResponse.data.BookingInfo.CurrentStatus === "FAILED"){
                    const getAgentConfigForUpdate = await agentConfig.findOne({ userId: getuserDetails._id });
                    // Check if maxCreditLimit exists, otherwise set it to 0
                    const maxCreditLimitPrice = getAgentConfigForUpdate?.maxcreditLimit ?? 0; 
                    
                    const newBalanceCredit = maxCreditLimitPrice + item?.offeredPrice + item?.totalMealPrice + item?.totalBaggagePrice + item?.totalSeatPrice;
                    await agentConfig.updateOne({ userId: getuserDetails._id }, { maxcreditLimit: newBalanceCredit });
                    await ledger.create({
                      userId: getuserDetails._id,
                      companyId: getuserDetails.company_ID._id,
                      ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
                      transactionAmount: item?.offeredPrice + item?.totalMealPrice + item?.totalBaggagePrice + item?.totalSeatPrice,
                      currencyType: "INR",
                      fop: "Credit",
                      transactionType: "CREDIT",
                      runningAmount: newBalanceCredit,
                      remarks: "Booking Amount Added Into Your Account.",
                      transactionBy: getuserDetails._id,
                      cartId: item?.BookingId
                    });
                  }else{
                    // Transtion 
                  await transaction.updateOne({ bookingId: item?.BookingId }, { statusDetail: "APPROVED OR COMPLETED SUCCESSFULLY" });
                
                  }
                   //return fSearchApiResponse.data;
                return bookingResponce;
              } catch (error) {               
                await BookingDetails.updateOne(
                  { bookingId: item?.BookingId, "itinerary.IndexNumber": item.IndexNumber }, 
                  { $set: { bookingStatus: "FAILED",
                    bookingRemarks: error.message                    
                  } }
                );
                
                // Ledget Create After booking Failed 
                const getAgentConfigForUpdate = await agentConfig.findOne({ userId: getuserDetails._id });
                // Check if maxCreditLimit exists, otherwise set it to 0
                const maxCreditLimitPrice = getAgentConfigForUpdate?.maxcreditLimit ?? 0;        

                
                const newBalanceCredit = maxCreditLimitPrice + item?.offeredPrice + item?.totalMealPrice + item?.totalBaggagePrice + item?.totalSeatPrice;
                await agentConfig.updateOne({ userId: getuserDetails._id }, { maxcreditLimit: newBalanceCredit });
                await ledger.create({
                  userId: getuserDetails._id,
                  companyId: getuserDetails.company_ID._id,
                  ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
                  transactionAmount: item?.offeredPrice + item?.totalMealPrice + item?.totalBaggagePrice + item?.totalSeatPrice,
                  currencyType: "INR",
                  fop: "Credit",
                  transactionType: "CREDIT",
                  runningAmount: newBalanceCredit,
                  remarks: "Booking Amount Added Into Your Account.",
                  transactionBy: getuserDetails._id,
                  cartId: item?.BookingId
                });
                return error.message;
              }
            })
          );  
          return hitAPI;
        //   const itineraryArray = await Promise.all(hitAPI?.map(async (itineraryItem) => {
        //     try {
        //       const bookingData = await BookingDetails.find({ bookingId: response?.bookingId, itinerary.Sectors:itineraryItem.Param.Sector[0].Src, itinerary.Sectors:Param.Sector[0].Des });
        //       const passengerPreferenceData = await passengerPreferenceModel.findOne({ bookingId: response?.bookingId });
              
        //         return {
        //             BookingInfo: { 
        //                 CurrentStatus: itineraryItem.BookingInfo.CurrentStatus,
        //                 BookingStatus: itineraryItem.BookingInfo.BookingStatus,
        //                 BookingRemark: itineraryItem.BookingInfo.BookingRemark,
        //                 BookingId: itineraryItem.BookingInfo.BookingId,
        //                 PNR: itineraryItem.BookingInfo.APnr,
        //                 Type: itineraryItem.BookingInfo.GPnr
        //             },
        //             itinerary: bookingData,  // Replace "daddda" with the actual itinerary data
        //         };
        //     } catch (error) {
        //         console.error("Error fetching booking data:", error);
        //         return null; // Or handle the error as needed
        //     }
        // }));
        
        
          // const bookingResponce = {
          //   CartId: response?.bookingId,
          //   bookingResponce:itineraryArray             
          // };
          // return {
          //   IsSuccess: true,
          //   response: bookingResponce,
          // };      
          // Continue with further actions if needed
        } else {
          return "Booking already exists";
        }
      } else {
        return "Some Technical Issue";
      }

      //return newArray;

      //let getToken = response.data.Result;
      

      return hitAPI;

      //flightCache.set(cacheKey, fSearchApiResponse.data, 300);
      let apiResponse = fSearchApiResponse.data;
      let apiResponseCommon = [];

      for (let index = 0; index < apiResponse.SelectedFlight.length; index++) {
        let schedule = apiResponse.SelectedFlight[index];
        //let oldItinerary = Itinerary[index];
        // apiResponseCommon.push(schedule);
        apiResponseCommon.push({
          UID: Itinerary[index].UID,
          BaseFare: schedule.Fare.BasicTotal,
          Taxes: schedule.Fare.TaxesTotal,
          TotalPrice: schedule.Fare.GrandTotal,
          ExtraCharges: 0.0,
          TaxMarkUp: 0.0,
          MarkUp: 0.0,
          Commission: 0.0,
          Fees: 0.0,
          BookingFees: 0.0,
          ServiceFee: 0.0,
          CancellationFees: 0.0,
          RescheduleFees: 0.0,
          AdminFees: 0.0,
          Discount: 0.0,
          TDS: 0.0,
          BaseCharges: 0.0,
          SupplierDiscount: 0.0,
          SupplierDiscountPercent: 0.0,
          GrandTotal: schedule.Fare.GrandTotal,
          Currency: "INR",
          FareType: schedule.FareType,
          TourCode: "",
          PricingMethod: "Guaranteed",
          FareFamily: schedule.Alias,
          PromotionalFare: false,
          FareFamilyDN: null,
          PromotionalCode: "",
          PromoCodeType: "",
          RefundableFare: schedule.Offer.Refund === "Refundable" ? true : false,
          IndexNumber: index,
          Provider: Provider,
          ValCarrier: schedule.FCode.split(",")[0],
          LastTicketingDate: "",
          TravelTime: schedule.Dur,
          PriceBreakup: [
            PaxDetail.Adults > 0
              ? {
                  PassengerType: "ADT",
                  NoOfPassenger: PaxDetail.Adults,
                  Tax: schedule.Fare.Adt.Taxes,
                  BaseFare: schedule.Fare.Adt.Basic,
                  MarkUp: 0.0,
                  TaxMarkUp: 0.0,
                  Commission: 0.0,
                  Fees: 0.0,
                  BookingFees: 0.0,
                  CancellationFees: 0.0,
                  RescheduleFees: 0.0,
                  AdminFees: 0.0,
                  TDS: 0.0,
                  gst: 0.0,
                  ServiceFees: 0.0,
                  Discount: 0.0,
                  BaseCharges: 0.0,
                  TaxBreakup: [
                    {
                      TaxType: "YQ",
                      Amount: schedule.Fare.Adt.Yq,
                    },
                  ],
                  AirPenalty: [],
                  CommercialBreakup: [],
                  AgentMarkupBreakup: {
                    BookingFee: 0.0,
                    Basic: 0.0,
                    Tax: 0.0,
                  },
                  Key: null,
                  OI: schedule.Fare.OI,
                }
              : {},
            PaxDetail.Child > 0
              ? {
                  PassengerType: "CHD",
                  NoOfPassenger: PaxDetail.Child,
                  Tax: schedule.Fare.Chd.Taxes,
                  BaseFare: schedule.Fare.Chd.Basic,
                  MarkUp: 0.0,
                  TaxMarkUp: 0.0,
                  Commission: 0.0,
                  Fees: 0.0,
                  BookingFees: 0.0,
                  CancellationFees: 0.0,
                  RescheduleFees: 0.0,
                  AdminFees: 0.0,
                  TDS: 0.0,
                  gst: 0.0,
                  ServiceFees: 0.0,
                  Discount: 0.0,
                  BaseCharges: 0.0,
                  TaxBreakup: [
                    {
                      TaxType: "YQ",
                      Amount: schedule.Fare.Chd.Yq,
                    },
                  ],
                  AirPenalty: [],
                  CommercialBreakup: [],
                  AgentMarkupBreakup: {
                    BookingFee: 0.0,
                    Basic: 0.0,
                    Tax: 0.0,
                  },
                  Key: null,
                  OI: schedule.Fare.OI,
                }
              : {},
            PaxDetail.Infants > 0
              ? {
                  PassengerType: "INF",
                  NoOfPassenger: PaxDetail.Infants,
                  Tax: schedule.Fare.Inf.Taxes,
                  BaseFare: schedule.Fare.Inf.Basic,
                  MarkUp: 0.0,
                  TaxMarkUp: 0.0,
                  Commission: 0.0,
                  Fees: 0.0,
                  BookingFees: 0.0,
                  CancellationFees: 0.0,
                  RescheduleFees: 0.0,
                  AdminFees: 0.0,
                  TDS: 0.0,
                  gst: 0.0,
                  ServiceFees: 0.0,
                  Discount: 0.0,
                  BaseCharges: 0.0,
                  TaxBreakup: [
                    {
                      TaxType: "YQ",
                      Amount: schedule.Fare.Inf.Yq,
                    },
                  ],
                  AirPenalty: [],
                  CommercialBreakup: [],
                  AgentMarkupBreakup: {
                    BookingFee: 0.0,
                    Basic: 0.0,
                    Tax: 0.0,
                  },
                  Key: null,
                  OI: schedule.Fare.OI,
                }
              : {},
          ],
          Sectors: schedule.Itinerary.map((sector) => ({
            IsConnect: false,
            AirlineCode: sector.FCode,
            AirlineName: sector.FName,
            Class: sector.FClass,
            CabinClass: sector.PClass,
            BookingCounts: "",
            NoSeats: sector.Seat,
            FltNum: sector.FNo,
            EquipType: sector.FlightType,
            FlyingTime: sector.Dur,
            TravelTime: sector.Dur,
            TechStopOver: 1,
            Status: "",
            OperatingCarrier: null,
            MarketingCarrier: null,
            BaggageInfo: schedule.FareRule.CHKNBG,
            HandBaggage: schedule.FareRule.CBNBG,
            TransitTime: null,
            MealCode: null,
            Key: "",
            Distance: "",
            ETicket: "No",
            ChangeOfPlane: "",
            ParticipantLevel: "",
            OptionalServicesIndicator: false,
            AvailabilitySource: "",
            Group: "0",
            LinkAvailability: "true",
            PolledAvailabilityOption: "",
            FareBasisCode: sector.FBasis,
            HostTokenRef: "",
            APISRequirementsRef: "",
            Departure: {
              Terminal: sector.DTrmnl,
              Date: sector.DDate,
              Time: sector.DDate,
              Day: null,
              DateTimeStamp: sector.DDate,
              Code: sector.Src,
              Name: sector.DArpt,
              CityCode: sector.Src,
              CityName: sector.SrcName,
              CountryCode: "IN",
              CountryName: "India",
            },
            Arrival: {
              Terminal: sector.ATrmnl,
              Date: sector.ADate,
              Time: sector.ADate,
              Day: null,
              DateTimeStamp: sector.ADate,
              Code: sector.Des,
              Name: sector.AArpt,
              CityCode: sector.Des,
              CityName: sector.DesName,
              CountryCode: "IN",
              CountryName: "India",
            },
            OI: sector.OI,
          })),
          FareDifference: apiResponse.FareBreakup,
          HostTokens: null,
          Key: "",
          SearchID: "",
          TRCNumber: null,
          TraceId: Authentication.TraceId,
          OI: schedule.OI ?? null,
        });
      }

      return {
        IsSucess: true,
        response: apiResponseCommon,
      };
    } else {
      return {
        IsSucess: false,
        response: response.data.ErrorMessage,
      };
    }
  } catch (error) {
    return {
      IsSucess: false,
      response: error.message,
    };
  }
};

module.exports = {
  startBooking,
};
