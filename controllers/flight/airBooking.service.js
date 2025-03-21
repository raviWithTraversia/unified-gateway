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
const Logs = require("../../controllers/logs/PortalApiLogsCommon");
const fareFamilyMaster = require("../../models/FareFamilyMaster");
const passengerPreferenceModel = require("../../models/booking/PassengerPreference");
const BookingDetails = require("../../models/booking/BookingDetails");
const BookingTemp = require("../../models/booking/BookingTemp");
const moment = require("moment");
const axios = require("axios");
const uuid = require("uuid");
const NodeCache = require("node-cache");
const flightCache = new NodeCache();
const {
  createLeadger,
  getTdsAndDsicount,
  commonProviderMethodDate,
} = require("../../controllers/commonFunctions/common.function");
const SupplierCode = require("../../models/supplierCode");
const { getSupplierCredentials } = require("../../utils/get-supplier-creds");
const { commonFlightBook } = require("../../services/common-flight-book");
const { saveLogInFile } = require("../../utils/save-log");

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
    paymentMethodType,
    paymentGateway,
    isHoldBooking,
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
  if (!companyId || !UserId || !TraceId) {
    return {
      response: "Company or User Trace id field are required",
    };
  }

  const bookingData = await BookingDetails.find({
    "itinerary.TraceId": TraceId,
  });
  if (bookingData.length > 0) {
    return {
      response: "allready created booking",
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
      paymentMethodType,
      paymentGateway,
      req,
      isHoldBooking
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
  paymentMethodType,
  paymentGateway,
  req,
  isHoldBooking
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

  const {
    supplier,
    supplierCode,
    error: supplierError,
  } = await getSupplierCredentials({
    provider: ItineraryPriceCheckResponses?.[0]?.Provider,
  });

  if (supplierError) {
    return {
      IsSucess: false,
      response: supplierError,
    };
  }
  // const supplierCredentials = await Supplier.find({
  //   companyId: CompanyId,
  //   credentialsType: CredentialType,
  //   status: true,
  // })
  //   .populate({
  //     path: "supplierCodeId",
  //     select: "supplierCode",
  //   })
  //   .exec();
  // if (!supplierCredentials || !supplierCredentials.length) {
  //   return {
  //     IsSucess: false,
  //     response: "Supplier credentials does not exist",
  //   };
  // }

  // GET PromoCode
  //  const getPromoCode = await PromoCode.find({ companyId: CompanyId, supplierCode: supplierCredentials });
  // console.log("aaaaaaaaaaaaaaaaaaaaaaa" + fareTypeVal);
  // return false

  //airline promo code query here
  // Commertial query call here ( PENDING )
  // Supplier API Integration Start Here ....

  // const responsesApi = await Promise.all(
  //   supplierCredentials.map(async (supplier) => {
  //     console.log({ supplier, passedProvider: ItineraryPriceCheckResponses[0].Provider });
  //     try {
  //       if (
  //         ItineraryPriceCheckResponses[0].Provider ===
  //         supplier.supplierCodeId.supplierCode
  //       ) {
  //         switch (supplier.supplierCodeId.supplierCode) {
  //           case "Kafila":
  //           case "1A":
  //             console.log({ provider: supplier.supplierCodeId.supplierCode });
  //             // check here airline promoCode if active periority first agent level then group level
  //             return await KafilaFun(
  //               Authentication,
  //               supplier,
  //               TypeOfTrip,
  //               Segments,
  //               PaxDetail,
  //               TravelType,
  //               Flexi,
  //               Direct,
  //               ClassOfService,
  //               Airlines,
  //               FareFamily,
  //               RefundableOnly,
  //               supplier.supplierCodeId.supplierCode,
  //               PassengerPreferences,
  //               ItineraryPriceCheckResponses,
  //               paymentMethodType,
  //               paymentGateway
  //             );

  //           default:
  //             throw new Error(
  //               `Unsupported supplier: ${supplier.supplierCodeId.supplierCode}`
  //             );
  //         }
  //       }
  //     } catch (error) {
  //       return { error: error.message, supplier: supplier };
  //     }
  //   })
  // );

  const responsesApi = await KafilaFun(
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
    supplierCode.supplierCode,
    PassengerPreferences,
    ItineraryPriceCheckResponses,
    paymentMethodType,
    paymentGateway,
    req,
    isHoldBooking
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
  paymentMethodType,
  paymentGateway,
  req,
  isHoldBooking
) => {
  const paxList = JSON.parse(JSON.stringify(req.body.PassengerPreferences));
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

  let createTokenUrl;
  let flightSearchUrl;
  // Apply APi for Type of trip ( ONEWAY / ROUNDTRIP / MULTYCITY )

  // add api with here oneway round multicity
  let credentialType = "D";
  if (Authentication.CredentialType === "LIVE") {
    // Live Url here
    credentialType = "P";
    createTokenUrl = `${supplier.supplierLiveUrl}/api/Freport`;
    flightSearchUrl = `${supplier.supplierLiveUrl}/api/FPNR`;
  } else {
    // Test Url here
    createTokenUrl = `${supplier.supplierTestUrl}/api/Freport`;
    flightSearchUrl = `${supplier.supplierTestUrl}/api/FPNR`;
  }
  let getuserDetails;
  try {
    getuserDetails = await UserModel.findOne({
      _id: Authentication.UserId,
    }).populate("company_ID");
    if (!getuserDetails) {
      getuserDetails = "User Not Found";
    }
  } catch (error) {
    // console.error('Error creating booking:', error);
    getuserDetails = "User Not Found";
  }

  // Calculate Balance with commercial
  const preparePassengerArrayListForBookingApiPayload = async (
    allPassengerArrayList,
    allItineraryArrayList
  ) => {
    let returnPassengerPayloadArrayList = allPassengerArrayList;

    returnPassengerPayloadArrayList.forEach((passengerElement) => {
      let totalBasePrice = 0,
        totalTaxPrice = 0,
        totalBookingFees = 0,
        totalGstAmount = 0;

      allItineraryArrayList.forEach((childElement) => {
        let PriceBreakup = childElement?.PriceBreakup;
        let advanceAgentMarkup = childElement?.advanceAgentMarkup;

        PriceBreakup.forEach((priceBreakupElement) => {
          if (passengerElement?.PaxType == priceBreakupElement?.PassengerType) {
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
            if (priceBreakupElement?.AgentMarkupBreakup?.BookingFee)
              totalGstAmount +=
                priceBreakupElement?.AgentMarkupBreakup?.BookingFee;
            //* new AppSetting().gstPercentageAmount;

            priceBreakupElement?.CommercialBreakup?.forEach?.(
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
      passengerElement.totalPublishedPrice =
        totalBasePrice +
        totalTaxPrice +
        totalBookingFees +
        totalGstAmount +
        totalGstAmount;
    });

    return returnPassengerPayloadArrayList;
  };

  // Example usage:
  const getAllPriceAppliedPessengerwise =
    await preparePassengerArrayListForBookingApiPayload(
      PassengerPreferences.Passengers,
      ItineraryPriceCheckResponses
    );
  let totalssrPrice = 0;

  for (const passenger of getAllPriceAppliedPessengerwise) {
    totalssrPrice +=
      (passenger.totalMealPrice || 0) +
      (passenger.totalSeatPrice || 0) +
      (passenger.totalBaggagePrice || 0) +
      (passenger.totalFastForwardPrice || 0);
  }

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
      case "otherTax":
        returnBoolean = true;
        break;
      case "FixedBookingFees":
        returnBoolean = true;
        break;
      case "FixedServiceFees":
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

  // const calculateOfferedPrice = async (fareFamiliyElement) => {
  //   let returnCalculatedOfferedPrice = 0,
  //     adultPriceCalculate = 0,
  //     childPriceCalculate = 0,
  //     infantPriceCalculate = 0;

  //   fareFamiliyElement.PriceBreakup?.forEach((priceBreakupElement) => {
  //     let { PassengerType, NoOfPassenger, CommercialBreakup, BaseFare, Tax } =
  //       priceBreakupElement;

  //     if (PassengerType == "ADT") {
  //       adultPriceCalculate = Number(BaseFare) * NoOfPassenger;
  //       adultPriceCalculate += Number(Tax) * NoOfPassenger;
  //       CommercialBreakup?.forEach((commercialBreakup) => {
  //         let { CommercialType, Amount } = commercialBreakup;
  //         if (offerPriceMinusInAmount(CommercialType))
  //           adultPriceCalculate -= Number(Amount) * NoOfPassenger;
  //         else if (offerPricePlusInAmount(CommercialType))
  //           adultPriceCalculate += Number(Amount) * NoOfPassenger;
  //       });
  //     } else if (PassengerType == "CHD") {
  //       childPriceCalculate = Number(BaseFare) * NoOfPassenger;
  //       childPriceCalculate += Number(Tax) * NoOfPassenger;
  //       CommercialBreakup?.forEach((commercialBreakup) => {
  //         let { CommercialType, Amount } = commercialBreakup;
  //         if (offerPriceMinusInAmount(CommercialType))
  //           childPriceCalculate -= Number(Amount) * NoOfPassenger;
  //         else if (offerPricePlusInAmount(CommercialType))
  //           childPriceCalculate += Number(Amount) * NoOfPassenger;
  //       });
  //     } else if (PassengerType == "INF") {
  //       infantPriceCalculate = Number(BaseFare) * NoOfPassenger;
  //       infantPriceCalculate += Number(Tax) * NoOfPassenger;
  //       CommercialBreakup?.forEach((commercialBreakup) => {
  //         let { CommercialType, Amount } = commercialBreakup;
  //         if (offerPriceMinusInAmount(CommercialType))
  //           infantPriceCalculate -= Number(Amount) * NoOfPassenger;
  //         else if (offerPricePlusInAmount(CommercialType))
  //           infantPriceCalculate += Number(Amount) * NoOfPassenger;
  //       });
  //     }
  //   });

  //   returnCalculatedOfferedPrice =
  //     adultPriceCalculate + childPriceCalculate + infantPriceCalculate;
  //   return returnCalculatedOfferedPrice;
  // };

  const calculateOfferedPrice = async (fareFamiliyElement) => {
    let returnCalculatedOfferedPrice = 0;

    fareFamiliyElement.PriceBreakup?.forEach((priceBreakupElement) => {
      let {
        PassengerType,
        NoOfPassenger,
        CommercialBreakup,
        BaseFare,
        Tax,
        TaxBreakup,
      } = priceBreakupElement;

      if (PassengerType) {
        returnCalculatedOfferedPrice += Number(BaseFare) * NoOfPassenger;
        returnCalculatedOfferedPrice += Number(Tax) * NoOfPassenger;

        // TaxBreakup?.forEach((taxBreakup) => {
        //   let { TaxType, Amount } = taxBreakup;
        //   if (TaxType)
        //     returnCalculatedOfferedPrice += Number(Amount) * NoOfPassenger;
        // });

        CommercialBreakup?.forEach((commercialBreakup) => {
          let { CommercialType, Amount } = commercialBreakup;
          if (offerPricePlusInAmount(CommercialType) && CommercialType != "TDS")
            returnCalculatedOfferedPrice +=
              roundOffNumberValues(Amount) * NoOfPassenger;
          if (offerPriceMinusInAmount(CommercialType))
            returnCalculatedOfferedPrice -=
              roundOffNumberValues(Amount) * NoOfPassenger;
          if (
            CommercialType == "Discount" ||
            CommercialType == "SegmentKickback"
          ) {
            // console.log(PassengerType, "PassengerType");
            const discountOrSegmentValue = roundOffNumberValues(Amount);
            // console.log(CommercialType + "=" + discountOrSegmentValue, "before adding");
            returnCalculatedOfferedPrice +=
              discountOrSegmentValue * 0.02 * NoOfPassenger;
            // console.log(returnCalculatedOfferedPrice, "tdsAmount");
          }
        });
      }
    });
    console.log(returnCalculatedOfferedPrice, "before round off");

    returnCalculatedOfferedPrice = Number(
      roundOffNumberValues(returnCalculatedOfferedPrice)
    );

    console.log(returnCalculatedOfferedPrice, "before round up");

    return returnCalculatedOfferedPrice;
  };

  function roundOffNumberValues(numberValue) {
    if (isNaN(numberValue)) numberValue = 0;
    const integerPart = Math.floor(numberValue);
    const fractionalPart = numberValue - integerPart;
    const result =
      fractionalPart >= 0.5 ? Math.ceil(numberValue) : Math.floor(numberValue);
    return result.toFixed(2);
  }

  async function calculateOfferedPriceForAll() {
    let calculationOfferPriceWithCommercial = 0; // Initialize to 0
    for (const itinerary of ItineraryPriceCheckResponses) {
      calculationOfferPriceWithCommercial += await calculateOfferedPrice(
        itinerary
      );
    }
    return calculationOfferPriceWithCommercial;
  }

  const calculationOfferPriceWithCommercial =
    await calculateOfferedPriceForAll();

  // ("");
  // Check Balance Available or Not Available
  const totalSSRWithCalculationPrice =
    calculationOfferPriceWithCommercial + totalssrPrice;
  saveLogInFile("price-with-commercial.json", {
    calculationOfferPriceWithCommercial,
    totalSSRWithCalculationPrice,
  });
  if (paymentMethodType === "Wallet") {
    try {
      // Retrieve agent configuration

      const companieIds = await UserModel.findById(getuserDetails._id);

      const getAllComapnies = await UserModel.find({
        company_ID: companieIds.company_ID,
      }).populate("roleId");
      let allIds = getAllComapnies
        .filter((item) => item.roleId.name === "Agency")
        .map((item) => item._id);

      console.log(allIds, "allIds");
      const getAgentConfig = await agentConfig.findOne({
        userId: allIds[0],
      });
      // console.log(getAllComapnies,"getuserDetails");
      const getcreditRequest = await creditRequest.find({
        agencyId: getuserDetails.company_ID,
        expireDate: { $gte: new Date() }, // Assuming "expireDate" is a date field and you want to find requests that haven't expired yet
        status: "approved",
        product: "Flight",
      });
      let creditTotal = 0;
      if (getcreditRequest && getcreditRequest.length > 0) {
        getcreditRequest.forEach((request) => {
          creditTotal += request.amount;
        });
      } else {
        creditTotal = 0;
      }
      // Check if maxCreditLimit exists, otherwise set it to 0
      if (!isHoldBooking) {
        const checkCreditLimit =
          getAgentConfig?.maxcreditLimit ?? 0 + creditTotal;
        const maxCreditLimit = getAgentConfig?.maxcreditLimit ?? 0;

        // Check if balance is sufficient
        if (checkCreditLimit < totalSSRWithCalculationPrice) {
          console.log({ checkCreditLimit, totalSSRWithCalculationPrice });
          return "Your Balance is not sufficient";
        }
        // Deduct balance from user configuration and update in DB
        const newBalance = maxCreditLimit - totalSSRWithCalculationPrice;
        console.log(
          {
            newBalance,
            maxCreditLimit,
            totalSSRWithCalculationPrice,
            stage: 5,
          },
          "newBalance"
        );
        await agentConfig.updateOne(
          { userId: allIds[0] },
          { maxcreditLimit: newBalance }
        );

        // Generate random ledger ID
        var ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
        let gtTsAdDnt = await getTdsAndDsicount(ItineraryPriceCheckResponses);

        // Create ledger entry
        await ledger.create({
          userId: allIds[0],
          companyId: getuserDetails.company_ID._id,
          ledgerId: ledgerId,
          transactionAmount: totalSSRWithCalculationPrice,
          currencyType: "INR",
          fop: "CREDIT",
          deal: gtTsAdDnt?.ldgrdiscount,
          tds: gtTsAdDnt?.ldgrtds,
          transactionType: "DEBIT",
          runningAmount: newBalance,
          remarks: "Booking amount deducted from your account.",
          transactionBy: getuserDetails._id,
          cartId: ItineraryPriceCheckResponses[0].BookingId,
        });

        // Create transaction Entry
        await transaction.create({
          userId: getuserDetails._id,
          companyId: getuserDetails.company_ID._id,
          trnsNo: Math.floor(100000 + Math.random() * 900000),
          trnsType: "DEBIT",
          paymentMode: "CL",
          trnsStatus: "success",
          transactionBy: getuserDetails._id,
          bookingId: ItineraryPriceCheckResponses[0].BookingId,
        });
      }

      //return addToLedger;
    } catch (error) {
      // Handle errors
      console.error("Error:", error.message);
      return "An error occurred. Please try again later.";
    }
  } else {
    return await kafilaFunOnlinePayment(
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
      paymentMethodType,
      paymentGateway
    );
  }

  // Calculation End here
  // return totalSSRWithCalculationPrice;

  try {
    let response = {
      data: {
        Status: "success",
      },
    };
    if (ItineraryPriceCheckResponses[0].Provider === "Kafila") {
      let tokenData = {
        P_TYPE: "API",
        R_TYPE: "FLIGHT",
        R_NAME: "GetToken",
        AID: supplier.supplierWsapSesssion,
        UID: supplier.supplierUserId,
        PWD: supplier.supplierPassword,
        Version: "1.0.0.0.0.0",
      };
      response = await axios.post(createTokenUrl, tokenData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (response.data.Status === "success") {
      try {
        const existingBooking = await BookingDetails.findOne({
          bookingId: ItineraryPriceCheckResponses[0].BookingId,
        });
        if (existingBooking) {
          const getAgentConfigForUpdate = await agentConfig.findOne({
            userId: getuserDetails._id,
          });
          // Check if maxCreditLimit exists, otherwise set it to 0
          const maxCreditLimitPrice =
            getAgentConfigForUpdate?.maxcreditLimit ?? 0;
          const newBalanceCredit =
            maxCreditLimitPrice + totalSSRWithCalculationPrice;
          console.log({
            newBalanceCredit,
            maxCreditLimitPrice,
            totalSSRWithCalculationPrice,
            stage: 4,
          });
          await agentConfig.updateOne(
            { userId: getuserDetails._id },
            { maxcreditLimit: newBalanceCredit }
          );
          await ledger.create({
            userId: getuserDetails._id,
            companyId: getuserDetails.company_ID._id,
            ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
            transactionAmount: totalSSRWithCalculationPrice,
            currencyType: "INR",
            fop: "CREDIT",
            transactionType: "CREDIT",
            runningAmount: newBalanceCredit,
            remarks: "Booking amount added back to your account.",
            transactionBy: getuserDetails._id,
            cartId: ItineraryPriceCheckResponses[0].BookingId,
          });
          return {
            msg: "Booking already exists",
            bookingId: ItineraryPriceCheckResponses[0].BookingId,
          };
        }
      } catch (error) {
        // console.error('Error creating booking:', error);
        console.log(error, "djei");
        return {
          IsSucess: false,
          response: "Error creating booking:",
          error,
        };
      }
      const createBooking = async (newItem) => {
        try {
          console.log(newItem, "newItem");
          let bookingDetailsCreate = await BookingDetails.create(newItem);
          // console.log({ bookingDetailsCreate });
          return {
            msg: "Booking created successfully",
            bookingId: newItem.bookingId,
            bid: bookingDetailsCreate._id,
          };
        } catch (error) {
          console.error("Error creating booking:", error);
          return {
            IsSucess: false,
            response: "Error creating booking:",
            error,
          };
        }
      };

      console.log("creating booking");
      const newArray = await Promise.all(
        ItineraryPriceCheckResponses?.map(async (itineraryItem) => {
          // if (itineraryItem.Provider === "Kafila") {
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

          // Construct PriceBreakup array

          const priceBreakupArray = itineraryItem?.PriceBreakup?.map(
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
          );

          // Construct item object with populated itineraryArray
          const newItem = {
            userId: Authentication?.UserId,
            companyId: Authentication?.CompanyId,
            AgencyId: Authentication?.AgencyId,
            BookedBy: Authentication?.BookedBy,
            bookingId: itineraryItem?.BookingId, // Changed from item?.BookingId to itineraryItem?.BookingId
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
              TraceId: itineraryItem?.TraceId,
              // TraceId: Authentication?.TraceId,
            },
          };
          console.log({ newItem });
          return await createBooking(newItem); // Call function to create booking
          // }
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
            modifyBy: Authentication?.UserId,
          });
          await passengerPreference.save();

          console.log("before hitting API");
          var totalRefundAmount = 0;

          const hitAPI = await Promise.all(
            ItineraryPriceCheckResponses.map(async (item, idx) => {
              if (item.GstData) {
                let gstD = item.GstData;
                delete gstD.GstDetails.isAgentGst;
              }
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
                let fSearchApiResponse = null;
                if (item.Provider === "Kafila") {
                  fSearchApiResponse = await axios.post(
                    flightSearchUrl,
                    requestDataFSearch,
                    {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  );
                } else {
                  const reqSegment = req.body?.SearchRequest?.Segments?.[idx];
                  saveLogInFile("request-segment.json", { reqSegment });
                  fSearchApiResponse = await commonFlightBook(
                    req.body,
                    reqSegment,
                    item,
                    paxList
                  );
                }
                if (
                  (typeof fSearchApiResponse?.data === "string" ||
                    typeof fSearchApiResponse === "string") &&
                  item.Provider === "Kafila"
                ) {
                  const requestBodyForResponseFetch = {
                    P_TYPE: "API",

                    R_TYPE: "FLIGHT",

                    R_NAME: "FlightBookingResponse",

                    R_DATA: {
                      TYPE: "PNRRES",

                      BOOKING_ID: "",

                      TRACE_ID: Authentication?.TraceId,
                    },

                    AID: supplier.supplierWsapSesssion,

                    MODULE: "B2B",

                    IP: "182.73.146.154",

                    TOKEN: supplier.supplierOfficeId,

                    ENV: credentialType,

                    Version: "1.0.0.0.0.0",
                  };

                  fSearchApiResponse = await axios.post(
                    flightSearchUrl,
                    requestBodyForResponseFetch,
                    {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  );
                }

                const logData = {
                  traceId: item?.TraceId,
                  // traceId: Authentication?.TraceId,
                  companyId: Authentication?.CompanyId,
                  userId: Authentication?.UserId,
                  source: "Kafila",
                  type: "API Log",
                  BookingId: item?.BookingId,
                  product: "Flight",
                  logName: "Air Booking",
                  request: requestDataFSearch,
                  responce: fSearchApiResponse?.data,
                };
                Logs(logData);
                let fSearchApiResponseStatus = fSearchApiResponse?.data?.Status;
                if (
                  !isHoldBooking &&
                  (fSearchApiResponseStatus?.toLowerCase() == "failed" ||
                    fSearchApiResponse?.data?.IsError == true ||
                    fSearchApiResponse?.data?.BookingInfo?.CurrentStatus?.toUpperCase() ==
                      "FAILED" ||
                    fSearchApiResponse?.data?.BookingInfo?.CurrentStatus?.toUpperCase() ==
                      "HOLD")
                ) {
                  await BookingDetails.updateOne(
                    {
                      bookingId: item?.BookingId,
                      "itinerary.IndexNumber": item.IndexNumber,
                      bookingStatus: { $ne: "CONFIRMED" },
                    },
                    {
                      $set: {
                        bookingStatus: "FAILED",
                        bookingRemarks:
                          fSearchApiResponse?.data?.ErrorMessage ||
                          fSearchApiResponse?.data?.BookingInfo
                            ?.BookingRemark ||
                          "error occured",
                      },
                    },
                    { new: true }
                  );

                  const findFailedBooking = await BookingDetails.find(
                    {
                      bookingId: item?.BookingId,
                      bookingStatus: "FAILED",
                    },
                    { bookingTotalAmount: 1 }
                  );

                  const refundAmount = await findFailedBooking.reduce(
                    (sum, element) => {
                      return sum + (element.bookingTotalAmount || 0); // Add if bookingTotalAmount exists
                    },
                    0
                  );
                  totalRefundAmount =
                    findFailedBooking.length > 1
                      ? totalSSRWithCalculationPrice
                      : refundAmount;
                  // Ledget Create After booking Failed

                  // return `${fSearchApiResponse.data.ErrorMessage}-${fSearchApiResponse.data.WarningMessage}`;
                }

                const bookingResponce = {
                  CartId: item.BookingId,
                  bookingResponce: {
                    CurrentStatus:
                      fSearchApiResponse.data.BookingInfo.CurrentStatus,
                    BookingStatus:
                      fSearchApiResponse.data.BookingInfo.BookingStatus,
                    BookingRemark:
                      fSearchApiResponse.data.BookingInfo.BookingRemark,
                    BookingId: fSearchApiResponse.data.BookingInfo.BookingId,
                    providerBookingId:
                      fSearchApiResponse.data.BookingInfo.BookingId,
                    PNR: fSearchApiResponse.data.BookingInfo.APnr,
                    Type: fSearchApiResponse.data.BookingInfo.GPnr,
                    APnr: fSearchApiResponse.data.BookingInfo.APnr,
                    GPnr: fSearchApiResponse.data.BookingInfo.GPnr,
                  },
                  itinerary: item,
                  PassengerPreferences: PassengerPreferences,
                  userDetails: getuserDetails,
                };
                await BookingDetails.updateOne(
                  {
                    bookingId: item?.BookingId,
                    "itinerary.IndexNumber": item.IndexNumber,
                  },
                  {
                    $set: {
                      bookingStatus:
                        fSearchApiResponse.data.BookingInfo.CurrentStatus,
                      bookingRemarks:
                        fSearchApiResponse.data.BookingInfo.BookingRemark,
                      providerBookingId: fSearchApiResponse.data.BookingInfo
                        ?.BookingId
                        ? fSearchApiResponse.data.BookingInfo?.BookingId
                        : fSearchApiResponse.data.BookingInfo.CurrentStatus ===
                          "CONFIRMED"
                        ? await commonProviderMethodDate()
                        : fSearchApiResponse.data.BookingInfo.BookingId,
                      PNR: fSearchApiResponse.data.BookingInfo.APnr,
                      APnr: fSearchApiResponse.data.BookingInfo.APnr,
                      GPnr: fSearchApiResponse.data.BookingInfo.GPnr,
                      SalePurchase:
                        fSearchApiResponse.data?.BookingInfo?.SalePurchase
                          ?.ATDetails?.Account,
                    },
                  }
                );
                const getpassengersPrefrence =
                  await passengerPreferenceModel.findOne({
                    bookingId: item?.BookingId,
                  });

                // item.Provider === "Kafila" &&
                // getpassengersPrefrence && getpassengersPrefrence.Passengers
                if (
                  item.Provider === "Kafila" &&
                  getpassengersPrefrence?.Passengers
                ) {
                  // await Promise.all(
                  getpassengersPrefrence.Passengers.map((passenger) => {
                    const apiPassenger =
                      fSearchApiResponse.data.PaxInfo.Passengers.find(
                        (p) =>
                          p.FName === passenger.FName &&
                          p.LName === passenger.LName
                      );
                    if (apiPassenger) {
                      passenger.Status = fSearchApiResponse.data.BookingInfo
                        .CurrentStatus
                        ? fSearchApiResponse.data.BookingInfo.CurrentStatus
                        : "CONFIRMED";
                      const ticketUpdate =
                        passenger?.Optional?.ticketDetails?.find?.(
                          (p) =>
                            p?.src ===
                              fSearchApiResponse?.data?.Param?.Sector?.[0]
                                ?.Src &&
                            p?.des ===
                              fSearchApiResponse?.data?.Param?.Sector?.[0]?.Des
                        );
                      if (ticketUpdate) {
                        ticketUpdate.ticketNumber =
                          apiPassenger?.Optional?.TicketNumber;
                      }

                      // passenger.Status = "CONFIRMED";
                    }
                  });
                  // );
                  bookingResponce.PassengerPreferences.Passengers =
                    getpassengersPrefrence.Passengers;
                  await getpassengersPrefrence.save();
                } else if (
                  fSearchApiResponse?.data?.BookingInfo?.CurrentStatus ===
                  "CONFIRMED"
                ) {
                  getpassengersPrefrence.Passengers.map?.(async (passenger) => {
                    const segmentMap = {};
                    passenger.Optional.ticketDetails.forEach((ticket, idx) => {
                      segmentMap[`${ticket.src}-${ticket.des}`] = idx;
                    });
                    const selectedPax =
                      fSearchApiResponse.data.PaxInfo.Passengers.find(
                        (p) =>
                          p.FName === passenger.FName &&
                          p.LName === passenger.LName
                      );
                    if (!selectedPax) return passenger;
                    passenger.Status = fSearchApiResponse.data.BookingInfo
                      .CurrentStatus
                      ? fSearchApiResponse.data.BookingInfo.CurrentStatus
                      : "CONFIRMED";

                    saveLogInFile("selected-pax.json", selectedPax);
                    passenger.Optional.EMDDetails = [
                      ...(passenger.Optional.EMDDetails || []),
                      ...(selectedPax?.Optional?.EMDDetails || []),
                    ];
                    if (selectedPax?.Optional?.ticketDetails?.length) {
                      selectedPax.Optional?.ticketDetails.forEach((ticket) => {
                        const segmentIdx =
                          segmentMap[`${ticket.src}-${ticket.des}`];
                        if (segmentIdx != null) {
                          passenger.Optional.ticketDetails[
                            segmentIdx
                          ].ticketNumber = ticket.ticketNumber;
                        } else {
                          passenger.Optional.ticketDetails.push(ticket);
                        }
                      });
                    }
                    return passenger;
                  });
                  bookingResponce.PassengerPreferences.Passengers =
                    getpassengersPrefrence.Passengers;
                  saveLogInFile(
                    "pax-preferences.json",
                    getpassengersPrefrence._doc
                  );
                  await getpassengersPrefrence.save();
                }
                // else if (
                //   fSearchApiResponse?.data?.BookingInfo?.CurrentStatus ===
                //   "CONFIRMED"
                // ) {
                //   const passengersLength =
                //     getpassengersPrefrence.Passengers.length;
                //   console.log({ passengersLength });
                //   for (let i = 0; i < passengersLength; i++) {
                //     const pax = getpassengersPrefrence.Passengers[i];
                //     if (
                //       fSearchApiResponse?.data?.PaxInfo?.Passengers?.[i]
                //         ?.Optional?.ticketDetails
                //     )
                //       pax.Optional.ticketDetails =
                //         fSearchApiResponse?.data?.PaxInfo?.Passengers?.[
                //           i
                //         ]?.Optional?.ticketDetails;
                //     if (
                //       fSearchApiResponse?.data?.PaxInfo?.Passengers?.[i]
                //         ?.Optional?.EMDDetails
                //     )
                //       pax.Optional.EMDDetails =
                //         fSearchApiResponse?.data?.PaxInfo?.Passengers?.[
                //           i
                //         ]?.Optional?.EMDDetails;
                //   }

                //   bookingResponce.PassengerPreferences.Passengers =
                //     getpassengersPrefrence.Passengers;
                //   await getpassengersPrefrence.save();
                // }

                // if (
                //   fSearchApiResponse?.data?.BookingInfo?.CurrentStatus?.toUpperCase() ===
                //   "FAILED"
                // ) {
                //   const getAgentConfigForUpdate = await agentConfig.findOne({
                //     userId: getuserDetails._id,
                //   });
                //   // Check if maxCreditLimit exists, otherwise set it to 0
                //   const maxCreditLimitPrice =
                //     getAgentConfigForUpdate?.maxcreditLimit ?? 0;

                //   // const transactionAmount =
                //   // item.Provider === "Kafila"
                //   //   ? item?.offeredPrice +
                //   //       item?.totalMealPrice +
                //   //       item?.totalBaggagePrice +
                //   //       item?.totalSeatPrice || item.GrandTotal
                //   //   : item.GrandTotal;
                //   const newBalanceCredit =
                //     maxCreditLimitPrice + totalSSRWithCalculationPrice;
                //   // maxCreditLimitPrice + transactionAmount;
                //   console.log({
                //     newBalanceCredit,
                //     maxCreditLimitPrice,
                //     totalSSRWithCalculationPrice,
                //     stage: 2,
                //   });
                //   await agentConfig.updateOne(
                //     { userId: getuserDetails._id },
                //     { maxcreditLimit: newBalanceCredit }
                //   );
                //   await ledger.create({
                //     userId: getuserDetails._id,
                //     companyId: getuserDetails.company_ID._id,
                //     ledgerId:
                //       "LG" + Math.floor(100000 + Math.random() * 900000),
                //     transactionAmount: totalSSRWithCalculationPrice,
                //     currencyType: "INR",
                //     fop: "CREDIT",
                //     transactionType: "CREDIT",
                //     runningAmount: newBalanceCredit,
                //     remarks: "Booking amount added back to your account.",
                //     transactionBy: getuserDetails._id,
                //     cartId: item?.BookingId,
                //   });
                // } else {
                // Transtion
                await transaction.updateOne(
                  { bookingId: item?.BookingId },
                  { statusDetail: "APPROVED OR COMPLETED SUCCESSFULLY" }
                );
                // }
                //return fSearchApiResponse.data;
                const barcodeupdate = await updateBarcode2DByBookingId(
                  item?.BookingId,
                  PassengerPreferences,
                  item,
                  fSearchApiResponse.data?.BookingInfo?.APnr
                );
                if (barcodeupdate) {
                  return bookingResponce;
                } else {
                  return bookingResponce;
                }
              } catch (error) {
                const logDataCatch = {
                  traceId: Authentication?.TraceId,
                  companyId: Authentication?.CompanyId,
                  userId: Authentication?.UserId,
                  source: "Kafila",
                  type: "API Log",
                  BookingId: item?.BookingId,
                  product: "Flight",
                  logName: "Air Booking",
                  request: "Air Booking Catch Request",
                  // responce: error,
                  responce: { message: error.message, stack: error.stack },
                };
                Logs(logDataCatch);

                if (error.message?.toLowerCase().includes("socket hang up")) {
                  await BookingDetails.updateOne(
                    {
                      bookingId: item?.BookingId,
                      "itinerary.IndexNumber": item.IndexNumber,
                      bookingStatus: { $ne: "CONFIRMED" },
                    },
                    {
                      $set: {
                        bookingStatus: "PENDING",
                      },
                    }
                  );

                  return error.message;
                } else {
                  await BookingDetails.updateOne(
                    {
                      bookingId: item?.BookingId,
                      "itinerary.IndexNumber": item.IndexNumber,
                      bookingStatus: { $ne: "CONFIRMED" },
                    },
                    {
                      $set: {
                        bookingStatus: "FAILED",
                        bookingRemarks: error.message,
                      },
                    }
                  );

                  if (isHoldBooking) {
                    totalRefundAmount = 0;
                  } else {
                    const findFailedBooking = await BookingDetails.find(
                      {
                        bookingId: item?.BookingId,
                        bookingStatus: "FAILED",
                      },
                      { bookingTotalAmount: 1 }
                    );

                    const refundAmount = await findFailedBooking.reduce(
                      (sum, element) => {
                        return sum + (element.bookingTotalAmount || 0); // Add if bookingTotalAmount exists
                      },
                      0
                    );
                    totalRefundAmount =
                      findFailedBooking.length > 1
                        ? totalSSRWithCalculationPrice
                        : refundAmount;
                  }
                  // Ledget Create After booking Failed
                  // const getAgentConfigForUpdate = await agentConfig.findOne({
                  //   userId: getuserDetails._id,
                  // });
                  // // Check if maxCreditLimit exists, otherwise set it to 0
                  // const maxCreditLimitPrice =
                  //   getAgentConfigForUpdate?.maxcreditLimit ?? 0;

                  // const transactionAmount =
                  //   item.Provider === "Kafila"
                  //     ? item?.offeredPrice +
                  //         item?.totalMealPrice +
                  //         item?.totalBaggagePrice +
                  //         item?.totalSeatPrice || item.GrandTotal
                  //     : item.GrandTotal;

                  // const newBalanceCredit =
                  //   maxCreditLimitPrice + totalSSRWithCalculationPrice;
                  // // maxCreditLimitPrice + transactionAmount;
                  // console.log({
                  //   newBalanceCredit,
                  //   maxCreditLimitPrice,
                  //   // transactionAmount,
                  //   stage: 1,
                  // });
                  // await agentConfig.updateOne(
                  //   { userId: getuserDetails._id },
                  //   { maxcreditLimit: newBalanceCredit }
                  // );

                  // await createLeadger(getuserDetails,item,currencyType="INR",fop="CREDIT",transactionType="DEBIT",runningAmount=newBalanceCredit,remarks="Booking Amount Dedactive Into Your Account.");
                  // await ledger.create({
                  //   userId: getuserDetails._id,
                  //   companyId: getuserDetails.company_ID._id,
                  //   ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
                  //   transactionAmount: totalSSRWithCalculationPrice,
                  //   currencyType: "INR",
                  //   fop: "CREDIT",
                  //   transactionType: "CREDIT",
                  //   runningAmount: newBalanceCredit,
                  //   remarks: "Booking amount added back to your account.",
                  //   transactionBy: getuserDetails._id,
                  //   cartId: item?.BookingId,
                  // });

                  return error.message;
                }
              }
            })
          );
          if (totalRefundAmount > 0) {
            const getAgentConfigForUpdate = await agentConfig.findOne({
              userId: getuserDetails._id,
            });
            // Check if maxCreditLimit exists, otherwise set it to 0
            const maxCreditLimitPrice =
              getAgentConfigForUpdate?.maxcreditLimit ?? 0;
            // const transactionAmount =
            //   item.Provider === "Kafila"
            //     ? item?.offeredPrice +
            //         item?.totalMealPrice +
            //         item?.totalBaggagePrice +
            //         item?.totalSeatPrice || item.GrandTotal
            //     : item.GrandTotal;
            const newBalanceCredit = maxCreditLimitPrice + totalRefundAmount;
            // maxCreditLimitPrice + transactionAmount;
            saveLogInFile("transaction-amount.json", {
              totalRefundAmount,
            });
            await agentConfig.updateOne(
              { userId: getuserDetails._id },
              { maxcreditLimit: newBalanceCredit }
            );
            await ledger.create({
              userId: getuserDetails._id,
              companyId: getuserDetails.company_ID._id,
              ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
              transactionAmount: totalRefundAmount,
              currencyType: "INR",
              fop: "CREDIT",
              transactionType: "CREDIT",
              runningAmount: newBalanceCredit,
              remarks: "amount added back to your account.",
              transactionBy: getuserDetails._id,
              cartId: ItineraryPriceCheckResponses[0].BookingId,
            });
          }

          return hitAPI;
        } else {
          return "Booking already exists";
        }
      } else {
        return "Some Technical Issue";
      }
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

const kafilaFunOnlinePayment = async (
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
  paymentMethodType,
  paymentGateway
) => {
  const createBooking = async (newItem) => {
    try {
      let bookingDetailsCreate = await BookingDetails.create(newItem);
      console.log(bookingDetailsCreate, "bookingDetailsCreate1");
      return {
        msg: "Booking created successfully",
        bookingId: newItem.bookingId,
        bid: bookingDetailsCreate._id,
      };
    } catch (error) {
      console.error("Error creating booking:", error);
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
      return "Booking already exists";
    }
  } catch (error) {
    // console.error('Error creating booking:', error);
    return "Error creating booking";
  }

  const newArray = await Promise.all(
    ItineraryPriceCheckResponses?.map(async (itineraryItem) => {
      // if (itineraryItem.Provider === "Kafila") {
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
          layover: sector.layover,
          Group: sector.Group,
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
      console.log({ itineraryItem });

      // Construct item object with populated itineraryArray
      const newItem = {
        userId: Authentication?.UserId,
        companyId: Authentication?.CompanyId,
        AgencyId: Authentication?.AgencyId,
        BookedBy: Authentication?.BookedBy,
        bookingId: itineraryItem?.BookingId, // Changed from item?.BookingId to itineraryItem?.BookingId
        prodBookingId: itineraryItem?.IndexNumber,
        provider: itineraryItem?.Provider,
        bookingType: "Automated",
        bookingStatus: "INCOMPLETE",
        paymentMethodType: paymentMethodType,
        paymentGateway: paymentGateway,
        bookingTotalAmount: itineraryItem?.GrandTotal ?? 0, // Changed from item?.GrandTotal to itineraryItem?.GrandTotal
        Supplier: itineraryItem?.ValCarrier, // Changed from item?.ValCarrier to itineraryItem?.ValCarrier
        travelType: TravelType,
        fareRules:
          itineraryItem?.fareRules !== undefined &&
          itineraryItem?.fareRules !== null
            ? itineraryItem?.fareRules
            : null,
        bookingTotalAmount:
          itineraryItem.offeredPrice +
          itineraryItem.totalMealPrice +
          itineraryItem.totalBaggagePrice +
          itineraryItem.totalSeatPrice +
          itineraryItem.totalFastForwardPrice,
        totalMealPrice: itineraryItem.totalMealPrice,
        totalBaggagePrice: itineraryItem.totalBaggagePrice,
        totalSeatPrice: itineraryItem.totalSeatPrice,
        totalFastForwardPrice: itineraryItem.totalFastForwardPrice,
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
              baseFare: itineraryItem.advanceAgentMarkup.adult.baseFare,
              taxesFare: itineraryItem.advanceAgentMarkup.adult.taxesFare,
              feesFare: itineraryItem.advanceAgentMarkup.adult.feesFare,
              gstFare: itineraryItem.advanceAgentMarkup.adult.gstFare,
            },
            child: {
              baseFare: itineraryItem.advanceAgentMarkup?.child?.baseFare,
              taxesFare: itineraryItem.advanceAgentMarkup?.child?.taxesFare,
              feesFare: itineraryItem.advanceAgentMarkup?.child?.feesFare,
              gstFare: itineraryItem.advanceAgentMarkup?.child?.gstFare,
            },
            infant: {
              baseFare: itineraryItem.advanceAgentMarkup?.infant?.baseFare,
              taxesFare: itineraryItem.advanceAgentMarkup?.infant?.taxesFare,
              feesFare: itineraryItem.advanceAgentMarkup?.infant?.feesFare,
              gstFare: itineraryItem.advanceAgentMarkup?.infant?.gstFare,
            },
          },
          PriceBreakup: priceBreakupArray,
          Sectors: sectorsArray,
          TraceId: itineraryItem?.TraceId,
          // TraceId: Authentication?.TraceId,
        },
      };
      console.log({ newItem });
      return await createBooking(newItem); // Call function to create booking
      // }
    })
  );

  // return newArray;
  console.log(newArray);
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
        Passengers: passengerPreferencesData?.Passengers?.map((passenger) => ({
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
            PassportNo: passenger?.Optional.PassportNo,
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
        })),
        modifyBy: Authentication?.UserId,
      });
      const cardStore = await passengerPreference.save();
      if (cardStore) {
        const passengerPreferencesString = JSON.stringify(PassengerPreferences);
        const itineraryPriceCheckResponsesString = JSON.stringify(
          ItineraryPriceCheckResponses
        );
        const authData = JSON.stringify(Authentication);
        const request = JSON.stringify({
          PassengerPreferences: passengerPreferencesString,
          ItineraryPriceCheckResponses: itineraryPriceCheckResponsesString,
          Authentication: authData,
          Segments: Segments,
          TravelType: TypeOfTrip,
        });

        const bookingTemp = await BookingTemp.create({
          companyId: Authentication.companyId,
          userId: Authentication.userId,
          source: "Kafila",
          BookingId: ItineraryPriceCheckResponses[0].BookingId,
          request: request,
          responce: "Booking Save Successfully",
        });
        if (bookingTemp) {
          return "Booking Save Successfully";
        } else {
          return "Booking already exists";
        }
      } else {
        return "Booking already exists";
      }
      // const hitAPI = await Promise.all(
      //   ItineraryPriceCheckResponses.map(async (item) => {
      //     let requestDataFSearch = {
      //       FareChkRes: {
      //         Error: item.Error,
      //         IsFareUpdate: item.IsFareUpdate,
      //         IsAncl: item.IsAncl,
      //         Param: item.Param,
      //         SelectedFlight: [item.SelectedFlight],
      //         FareBreakup: item.FareDifference,
      //         GstData: item.GstData,
      //         Ancl: null,
      //       },
      //       PaxInfo: PassengerPreferences,
      //     };

      //     try {
      //       let fSearchApiResponse = await axios.post(
      //         flightSearchUrl,
      //         requestDataFSearch,
      //         {
      //           headers: {
      //             "Content-Type": "application/json",
      //           },
      //         }
      //       );
      //       const logData = {
      //         traceId: Authentication.TraceId,
      //         companyId: Authentication.CompanyId,
      //         userId: Authentication.UserId,
      //         source: "Kafila",
      //         type: "API Log",
      //         BookingId: item?.BookingId,
      //         product: "Flight",
      //         logName: "Flight Search",
      //         request: requestDataFSearch,
      //         responce: fSearchApiResponse?.data,
      //       };
      //       Logs(logData);
      //       if (fSearchApiResponse.data.Status == "failed") {
      //         await BookingDetails.updateOne(
      //           {
      //             bookingId: item?.BookingId,
      //             "itinerary.IndexNumber": item.IndexNumber,
      //           },
      //           {
      //             $set: {
      //               bookingStatus: "FAILED",
      //               bookingRemarks: error.message,
      //             },
      //           }
      //         );

      //         // Ledget Create After booking Failed
      //         const getAgentConfigForUpdate = await agentConfig.findOne({
      //           userId: getuserDetails._id,
      //         });
      //         // Check if maxCreditLimit exists, otherwise set it to 0
      //         const maxCreditLimitPrice =
      //           getAgentConfigForUpdate?.maxcreditLimit ?? 0;
      //         const newBalanceCredit =
      //           maxCreditLimitPrice +
      //           item?.offeredPrice +
      //           item?.totalMealPrice +
      //           item?.totalBaggagePrice +
      //           item?.totalSeatPrice;
      //         await agentConfig.updateOne(
      //           { userId: getuserDetails._id },
      //           { maxcreditLimit: newBalanceCredit }
      //         );
      //         await ledger.create({
      //           userId: getuserDetails._id,
      //           companyId: getuserDetails.company_ID._id,
      //           ledgerId:
      //             "LG" + Math.floor(100000 + Math.random() * 900000),
      //           transactionAmount:
      //             item?.offeredPrice +
      //             item?.totalMealPrice +
      //             item?.totalBaggagePrice +
      //             item?.totalSeatPrice,
      //           currencyType: "INR",
      //           fop: "CREDIT",
      //           transactionType: "DEBIT",
      //           runningAmount: newBalanceCredit,
      //           remarks: "Booking Amount Dedactive Into Your Account.",
      //           transactionBy: getuserDetails._id,
      //           cartId: item?.BookingId,
      //         });

      //         return `${fSearchApiResponse.data.ErrorMessage}-${fSearchApiResponse.data.WarningMessage}`;
      //       }

      //       const bookingResponce = {
      //         CartId: item.BookingId,
      //         bookingResponce: {
      //           CurrentStatus:
      //             fSearchApiResponse.data.BookingInfo.CurrentStatus,
      //           BookingStatus:
      //             fSearchApiResponse.data.BookingInfo.BookingStatus,
      //           BookingRemark:
      //             fSearchApiResponse.data.BookingInfo.BookingRemark,
      //           BookingId: fSearchApiResponse.data.BookingInfo.BookingId,
      //           providerBookingId:
      //             fSearchApiResponse.data.BookingInfo.BookingId,
      //           PNR: fSearchApiResponse.data.BookingInfo.APnr,
      //           Type: fSearchApiResponse.data.BookingInfo.GPnr,
      //           APnr: fSearchApiResponse.data.BookingInfo.APnr,
      //           GPnr: fSearchApiResponse.data.BookingInfo.GPnr,
      //         },
      //         itinerary: item,
      //         PassengerPreferences: PassengerPreferences,
      //         userDetails: getuserDetails,
      //       };
      //       await BookingDetails.updateOne(
      //         {
      //           bookingId: item?.BookingId,
      //           "itinerary.IndexNumber": item.IndexNumber,
      //         },
      //         {
      //           $set: {
      //             bookingStatus:
      //               fSearchApiResponse.data.BookingInfo.CurrentStatus,
      //             bookingRemarks:
      //               fSearchApiResponse.data.BookingInfo.BookingRemark,
      //             providerBookingId:
      //               fSearchApiResponse.data.BookingInfo.BookingId,
      //             PNR: fSearchApiResponse.data.BookingInfo.APnr,
      //             APnr: fSearchApiResponse.data.BookingInfo.APnr,
      //             GPnr: fSearchApiResponse.data.BookingInfo.GPnr,
      //           },
      //         }
      //       );

      //       if (
      //         fSearchApiResponse.data.BookingInfo.CurrentStatus === "FAILED"
      //       ) {
      //         const getAgentConfigForUpdate = await agentConfig.findOne({
      //           userId: getuserDetails._id,
      //         });
      //         // Check if maxCreditLimit exists, otherwise set it to 0
      //         const maxCreditLimitPrice =
      //           getAgentConfigForUpdate?.maxcreditLimit ?? 0;

      //         const newBalanceCredit =
      //           maxCreditLimitPrice +
      //           item?.offeredPrice +
      //           item?.totalMealPrice +
      //           item?.totalBaggagePrice +
      //           item?.totalSeatPrice;
      //         await agentConfig.updateOne(
      //           { userId: getuserDetails._id },
      //           { maxcreditLimit: newBalanceCredit }
      //         );
      //         await ledger.create({
      //           userId: getuserDetails._id,
      //           companyId: getuserDetails.company_ID._id,
      //           ledgerId:
      //             "LG" + Math.floor(100000 + Math.random() * 900000),
      //           transactionAmount:
      //             item?.offeredPrice +
      //             item?.totalMealPrice +
      //             item?.totalBaggagePrice +
      //             item?.totalSeatPrice,
      //           currencyType: "INR",
      //           fop: "CREDIT",
      //           transactionType: "DEBIT",
      //           runningAmount: newBalanceCredit,
      //           remarks: "Booking Amount Dedactive Into Your Account.",
      //           transactionBy: getuserDetails._id,
      //           cartId: item?.BookingId,
      //         });
      //       } else {
      //         // Transtion
      //         await transaction.updateOne(
      //           { bookingId: item?.BookingId },
      //           { statusDetail: "APPROVED OR COMPLETED SUCCESSFULLY" }
      //         );
      //       }
      //       //return fSearchApiResponse.data;
      //       const barcodeupdate = await updateBarcode2DByBookingId(
      //         item?.BookingId,
      //         PassengerPreferences,
      //         item,
      //         fSearchApiResponse.data.BookingInfo.APnr
      //       );
      //       if (barcodeupdate) {
      //         return bookingResponce;
      //       } else {
      //         return bookingResponce;
      //       }
      //     } catch (error) {
      //       await BookingDetails.updateOne(
      //         {
      //           bookingId: item?.BookingId,
      //           "itinerary.IndexNumber": item.IndexNumber,
      //         },
      //         {
      //           $set: {
      //             bookingStatus: "FAILED",
      //             bookingRemarks: error.message,
      //           },
      //         }
      //       );

      //       // Ledget Create After booking Failed
      //       const getAgentConfigForUpdate = await agentConfig.findOne({
      //         userId: getuserDetails._id,
      //       });
      //       // Check if maxCreditLimit exists, otherwise set it to 0
      //       const maxCreditLimitPrice =
      //         getAgentConfigForUpdate?.maxcreditLimit ?? 0;

      //       const newBalanceCredit =
      //         maxCreditLimitPrice +
      //         item?.offeredPrice +
      //         item?.totalMealPrice +
      //         item?.totalBaggagePrice +
      //         item?.totalSeatPrice;
      //       await agentConfig.updateOne(
      //         { userId: getuserDetails._id },
      //         { maxcreditLimit: newBalanceCredit }
      //       );
      //       await ledger.create({
      //         userId: getuserDetails._id,
      //         companyId: getuserDetails.company_ID._id,
      //         ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
      //         transactionAmount:
      //           item?.offeredPrice +
      //           item?.totalMealPrice +
      //           item?.totalBaggagePrice +
      //           item?.totalSeatPrice,
      //         currencyType: "INR",
      //         fop: "CREDIT",
      //         transactionType: "DEBIT",
      //         runningAmount: newBalanceCredit,
      //         remarks: "Booking Amount Dedactive Into Your Account.",
      //         transactionBy: getuserDetails._id,
      //         cartId: item?.BookingId,
      //       });
      //       return error.message;
      //     }
      //   })
      // );
    } else {
      return "Booking already exists";
    }
  } else {
    return "Some Technical Issue";
  }
};

async function updateBarcode2DByBookingId(
  bookingId,
  passengerPreferencesData,
  item,
  pnr
) {
  try {
    const generateBarcodeUrl =
      "http://flightapi.traversia.net/api/GenerateBarCode/GenerateBarCode";
    const lastSectorIndex = item.Sectors.length - 1;
    const passengerPreference = await passengerPreferenceModel.findOne({
      bookingId: bookingId,
    });

    if (!passengerPreference) {
      console.error(
        "Passenger preference not found for booking ID:",
        bookingId
      );
      return; // Exit function if document not found
    }

    for (let passenger of passengerPreference.Passengers) {
      try {
        let reqPassengerData = {
          Company: item?.Provider,
          TripType: "O",
          PNR: pnr,
          PaxId: bookingId,
          PassangerFirstName: passenger?.FName,
          PassangerLastName: passenger?.LName,
          PassangetMidName: null,
          isInfant: false,
          MyAllData: [
            {
              DepartureStation: item?.Sectors[0]?.Departure?.Code,
              ArrivalStation: item?.Sectors[lastSectorIndex]?.Arrival?.Code,
              CarrierCode: item?.Sectors[0]?.AirlineCode,
              FlightNumber: item?.Sectors[0]?.FltNum,
              JulianDate: item?.Sectors[0]?.Departure?.Date,
              SeatNo: "",
              CheckInSeq: "N",
            },
          ],
        };

        const response = await axios.post(
          generateBarcodeUrl,
          reqPassengerData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const newToken = response.data;
        if (!passenger.barCode2D) {
          passenger.barCode2D = [];
        }
        // break;
        //passengerPreference.Passengers.forEach(p => {
        //if (p.FName === passenger.FName && p.LName === passenger.LName) {
        passenger.barCode2D.push({
          FCode: item?.Sectors[0]?.AirlineCode,
          FNo: item?.Sectors[0]?.FltNum,
          Src: item?.Sectors[0]?.Departure?.Code,
          Des: item?.Sectors[lastSectorIndex]?.Arrival?.Code,
          Code: newToken,
        });
        //}
        //});

        //console.log("mytoken", passenger);
        // console.log("Barcode2D updated successfully for passenger:", passenger);
      } catch (error) {
        // console.error(
        //   "Error updating Barcode2D for passenger:",
        //   passenger,
        //   error
        // );
      }
    }
    //console.log("mydata", passengerPreference);
    // Save the updated document back to the database
    await passengerPreference.save();
    //console.log("Barcode2D updated successfully for booking ID:", bookingId);
  } catch (error) {
    //console.error("Error updating Barcode2D:", error);
  }
}

module.exports = {
  startBooking,
  updateBarcode2DByBookingId,
};
