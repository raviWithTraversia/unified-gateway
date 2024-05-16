const flightcommercial = require("./flight.commercial");
const PromoCode = require("../../models/AirlinePromoCode");
const Company = require("../../models/Company");
const Supplier = require("../../models/Supplier");
const seriesDeparture = require("../../models/SeriesDeparture");
const AirportsDetails = require("../../models/AirportDetail");
const fareFamilyMaster = require("../../models/FareFamilyMaster");
const Logs = require("../../controllers/logs/PortalApiLogsCommon");
const Role = require("../../models/Role");
const axios = require("axios");
const uuid = require("uuid");
const NodeCache = require("node-cache");
const flightCache = new NodeCache();
const moment = require("moment");

const getSearch = async (req, res) => {
  const {
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
  ];
  const missingFields = fieldNames.filter(
    (fieldName) =>
      req.body[fieldName] === null || req.body[fieldName] === undefined
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
      RefundableOnly
    );
  }

  const logData = {
    traceId: Authentication.TraceId,
    companyId: Authentication.CompanyId,
    userId: Authentication.UserId,
    source: "Kafila",
    type: "Portal Log",
    product: "Flight",
    logName: "Flight Search",
    request: req.body,
    responce: result
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
  RefundableOnly
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
  let airportDetails;
  try {
      airportDetails = await AirportsDetails.find({
          $or: [
              { Airport_Code: Segments[0].Origin },
              { Airport_Code: Segments[0].Destination }
          ]
      });
  } catch (error) {
      console.error("Error fetching airport details:", error);
      airportDetails = null;
  }




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
              airportDetails
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
  //console.log(responsesApi)
   
  // Combine the responses here
  const combineResponseObj = {};
  supplierCredentials.forEach((supplier, index) => {
    const responsecombineapi = responsesApi[index];
    if (!responsecombineapi.error) {
      combineResponseObj[supplier.supplierCodeId.supplierCode] =
        responsecombineapi;
    } else {
      combineResponseObj[supplier.supplierCodeId.supplierCode] = {
        IsSucess: false,
        response: "Supplier Not Found",
      };
    }
  });


  // make common before commercial
  let commonArray = [];
  
  for (let key in combineResponseObj) {
    if (combineResponseObj[key].IsSucess) {
      commonArray.push(...combineResponseObj[key].response);
    }
  }

  // Check Series Booking 
  const series = await seriesDeparture.find({ CompanyId: Authentication.CompanyId,isactive:true });
  if (series && series.length > 0) {
    // Series array is not empty      
    const seriesArray = await seriesMapsHandle(series, Segments, PaxDetail, TravelType, Airlines, FareFamily,ClassOfService,Authentication,airportDetails);
    //console.log("Series is not empty:", seriesArray);
     if(seriesArray.IsSucess){
      commonArray.push(...seriesArray.response);
     }    
  }
  
  //apply commercial function
  const getApplyAllCommercialVar = await flightcommercial.getApplyAllCommercial(
    Authentication,
    TravelType,
    commonArray
  );

  return {
    IsSucess: true,
    response: getApplyAllCommercialVar.IsSucess ? getApplyAllCommercialVar.response.sort(
      (a, b) => a.TotalPrice - b.TotalPrice
    ) : getApplyAllCommercialVar.sort(
      (a, b) => a.TotalPrice - b.TotalPrice
    ),
  };
  // return {
  //     IsSucess: true,
  //     response: commonArray.IsSucess ? commonArray.response : commonArray,
  //   };
   
};

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
  airportDetails
) => {
  const cacheKey = JSON.stringify({
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
    airportDetails
  });

  const cachedResult = flightCache.get(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }
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
    flightSearchUrl = `http://fhapip.ksofttechnology.com/api/FSearch`;
    //createTokenUrl = `http://stage1.ksofttechnology.com/api/Freport`;
    //flightSearchUrl = `http://stage1.ksofttechnology.com/api/FSearch`;
  } else {
    // Test Url here
    createTokenUrl = `http://stage1.ksofttechnology.com/api/Freport`;
    flightSearchUrl = `http://stage1.ksofttechnology.com/api/FSearch`;
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
  //Class Of Service Economy, Business, Premium Economy
  const classOfServiceMap = {
    Economy: "EC",
    Business: "BU",
    "Premium Economy": "PE",
    First: "",
  };

  let classOfServiceVal = classOfServiceMap[ClassOfService] || "";

  // Fare Family Array
  // let fareFamilyMasterGet = [];
  // if (FareFamily && FareFamily.length > 0) {
  //     fareFamilyMasterGet = await fareFamilyMaster.distinct("fareFamilyCode", { fareFamilyName: { $in: FareFamily } });
  // }  
  // let fareFamilyVal =
  // fareFamilyMasterGet && fareFamilyMasterGet.length > 0 ? fareFamilyMasterGet.join(",") : "";

  let fareFamilyVal =
    FareFamily && FareFamily.length > 0 ? FareFamily.join(",") : "";

  const segmentsArray = Segments.map((segment) => ({
    Src: segment.Origin,
    Des: segment.Destination,
    DDate: segment.DepartureDate,
  }));

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
    if (response.
      data.Status === "success") {
      let getToken = response.data.Result;
      let requestDataFSearch = {
        Trip: tripTypeValue,
        Adt: PaxDetail.Adults,
        Chd: PaxDetail.Child,
        Inf: PaxDetail.Infants,
        Sector: segmentsArray,
        PF: Airlines.length > 0 ? Airlines.join(",") : "",
        PC: classOfServiceVal,
        Routing: "ALL",
        Ver: "1.0.0.0",
        Auth: {
          AgentId: supplier.supplierWsapSesssion,
          Token: getToken,
        },
        Env: credentialType,
        Module: "B2B",
        OtherInfo: {
          PromoCode: "",
          FFlight: "",
          FareType: fareFamilyVal,
          TraceId: Authentication.TraceId,
          IsUnitTesting: false,
          TPnr: false,
        },
      };      
           
      let fSearchApiResponse = await axios.post(
        flightSearchUrl,
        requestDataFSearch,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const logData = {
        traceId: Authentication.TraceId,
        companyId: Authentication.CompanyId,
        userId: Authentication.UserId,
        source: "Kafila",
        type: "API Log",
        product: "Flight",
        logName: "Flight Search",
        request: requestDataFSearch,
        responce: fSearchApiResponse?.data
      };  
      Logs(logData);
      //logger.info(fSearchApiResponse.data);
       //console.log(fSearchApiResponse.data.Schedules, "API Responce")
      if (fSearchApiResponse.data.Status == "failed") {
        return {
          IsSucess: false,
          response:
            fSearchApiResponse.data.ErrorMessage +
            "-" +
            fSearchApiResponse.data.WarningMessage,
        };
      }
      
      //flightCache.set(cacheKey, fSearchApiResponse.data, 300);
      let apiResponse = fSearchApiResponse.data;
      let apiResponseCommon = [];
      for (let index = 0; index < apiResponse.Schedules[0].length; index++) {
        let schedule = apiResponse.Schedules[0][index];        
        let randomUID = uuid.v4();
        // apiResponseCommon.push(schedule);
        //console.log(schedule.Itinerary)
        apiResponseCommon.push({
          UID: randomUID,
          BaseFare: schedule.Fare.BasicTotal,
          Taxes: schedule.Fare.TaxesTotal,
          TotalPrice: schedule.Fare.GrandTotal,
          // ExtraCharges: 0.0,
          // TaxMarkUp: 0.0,
          // MarkUp: 0.0,
          // Commission: 0.0,
          // Fees: 0.0,
          // BookingFees: 0.0,
          // ServiceFee: 0.0,
          // CancellationFees: 0.0,
          // RescheduleFees: 0.0,
          // AdminFees: 0.0,
          // Discount: 0.0,
          // TDS: 0.0,
          // BaseCharges: 0.0,
          // SupplierDiscount: 0.0,
          // SupplierDiscountPercent: 0.0,
          GrandTotal: schedule.Fare.GrandTotal,
          Currency: "INR",
          FareType: schedule.FareType,
          Stop:schedule.Stop,
          IsVia: schedule?.Itinerary[0]?.layover != "" ? true : false,
          TourCode: "",
          PricingMethod: "Guaranteed",
          FareFamily: schedule?.Offer?.Msg === "" ? schedule?.Alias : schedule?.Offer?.Msg,
          PromotionalFare: false,
          FareFamilyDN: null,
          PromotionalCode: "",
          PromoCodeType: "",
          RefundableFare: schedule.Offer.Refund === "Refundable" ? true : false,
          IndexNumber: index,
          Provider: Provider,
          ValCarrier: schedule.FCode.split(',')[0],
          LastTicketingDate: "",
          TravelTime: schedule.Dur,
          PriceBreakup: [
            PaxDetail.Adults > 0
              ? {
                  PassengerType: "ADT",
                  NoOfPassenger: PaxDetail.Adults,
                  Tax: schedule.Fare.Adt.Taxes,
                  BaseFare: schedule.Fare.Adt.Basic,
                  // MarkUp: 0.0,
                  // TaxMarkUp: 0.0,
                  // Commission: 0.0,
                  // Fees: 0.0,
                  // BookingFees: 0.0,
                  // CancellationFees: 0.0,
                  // RescheduleFees: 0.0,
                  // AdminFees: 0.0,
                  // TDS: 0.0,
                  // gst: 0.0,
                  // ServiceFees: 0.0,
                  // Discount: 0.0,
                  // BaseCharges: 0.0,
                  TaxBreakup: [
                    {
                      TaxType: "YQ",
                      Amount: schedule.Fare.Adt.Yq,
                    }                    
                  ],
                  AirPenalty: [],
                  CommercialBreakup: [],
                AgentMarkupBreakup: {
                  BookingFee: 0.0,
                  Basic: 0.0,
                  Tax: 0.0,                  
              },
                  Key: null,
                  OI:schedule.Fare.OI
                }
              : {},
            PaxDetail.Child > 0
              ? {
                  PassengerType: "CHD",
                  NoOfPassenger: PaxDetail.Child,
                  Tax: schedule.Fare.Chd.Taxes,
                  BaseFare: schedule.Fare.Chd.Basic,
                  // MarkUp: 0.0,
                  // TaxMarkUp: 0.0,
                  // Commission: 0.0,
                  // Fees: 0.0,
                  // BookingFees: 0.0,
                  // CancellationFees: 0.0,
                  // RescheduleFees: 0.0,
                  // AdminFees: 0.0,
                  // TDS: 0.0,
                  // gst: 0.0,
                  // ServiceFees: 0.0,
                  // Discount: 0.0,
                  // BaseCharges: 0.0,
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
                  OI:schedule.Fare.OI
                }
              : {},
            PaxDetail.Infants > 0
              ? {
                  PassengerType: "INF",
                  NoOfPassenger: PaxDetail.Infants,
                  Tax: schedule.Fare.Inf.Taxes,
                  BaseFare: schedule.Fare.Inf.Basic,
                  // MarkUp: 0.0,
                  // TaxMarkUp: 0.0,
                  // Commission: 0.0,
                  // Fees: 0.0,
                  // BookingFees: 0.0,
                  // CancellationFees: 0.0,
                  // RescheduleFees: 0.0,
                  // AdminFees: 0.0,
                  // TDS: 0.0,
                  // gst: 0.0,
                  // ServiceFees: 0.0,
                  // Discount: 0.0,
                  // BaseCharges: 0.0,
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
                  OI:schedule.Fare.OI
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
            layover:sector.layover,
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
              Date: sector.DDate.split("T")[0],
              Time: sector.DDate.split("T")[1].substring(0, 5),
              Day: null,
              DateTimeStamp: sector.DDate,
              Code: sector.Src,
              Name: sector.DArpt,
              CityCode: sector.Src,
              CityName: sector.SrcName,
              CountryCode: findCountryCodeByCode(airportDetails,sector.Src),
              CountryName: findCountryNameByCode(airportDetails,sector.Src),
            },
            Arrival: {
              Terminal: sector.ATrmnl,
              Date: sector.ADate.split("T")[0],
              Time: sector.ADate.split("T")[1].substring(0, 5),
              Day: null,
              DateTimeStamp: sector.ADate,
              Code: sector.Des,
              Name: sector.AArpt,
              CityCode: sector.Des,
              CityName: sector.DesName,
              CountryCode: findCountryCodeByCode(airportDetails,sector.Des),
              CountryName: findCountryNameByCode(airportDetails,sector.Des),
            },
            OI:sector.OI
          })),
          FareRule:schedule.FareRule,
          apiItinerary:schedule,
          HostTokens: null,
          Key: "",
          SearchID: "",
          TRCNumber: null,
          TraceId: apiResponse.Param.OtherInfo.TraceId,
          OI:schedule.OI ?? null
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

const seriesMapsHandle = async (seriesArray , Segments, PaxDetail, TravelType, Airlines, FareFamily, ClassOfService, Authentication,airportDetails) => {
  // Define an array to store the processed results
  const processedSeries = [];
  for (const seriesObj of seriesArray) {     

    const departureDate = moment(seriesObj.departure_date).format('YYYY-MM-DD');
    const segmentDepartureDate = moment(Segments[0].DepartureDate, 'YYYY-MM-DD').format('YYYY-MM-DD');

      if(seriesObj.origin_airport_code == Segments[0].Origin && 
        seriesObj.destination_airport_code == Segments[0].Destination &&
        departureDate === segmentDepartureDate &&
        (Airlines.length === 0 || Airlines.includes(seriesObj.flights[0].airline_code)) &&
        (FareFamily.length === 0 || FareFamily.includes(seriesObj.fare_name))  &&
        seriesObj.available_seats >= (PaxDetail.Adults + PaxDetail.Child) 
        ///ClassOfService == ""
        ){          
          // console.log(airportDetails,'airportdata');
          // console.log(seriesObj.flights[0]?.origin,'origincode');          
          let randomUID = uuid.v4();
          const totalPricecalculate = seriesObj.baseamountcost + seriesObj.baseamountchdcost + seriesObj.baseamountinfcost;
          const totalTaxesCalculate = seriesObj.taxamountcost + seriesObj.taxamountchdcost + seriesObj.taxamountinfcost
          processedSeries.push({
            UID: randomUID,
            BaseFare: totalPricecalculate,
            Taxes: totalTaxesCalculate,
            TotalPrice: totalPricecalculate + totalTaxesCalculate,
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
            GrandTotal: totalPricecalculate + totalTaxesCalculate,
            Currency: "INR",
            FareType: seriesObj?.cabin_class,
            TourCode: "",
            PricingMethod: "Guaranteed",
            FareFamily: seriesObj?.fare_name,
            PromotionalFare: false,
            FareFamilyDN: null,
            PromotionalCode: "",
            PromoCodeType: "",
            RefundableFare: seriesObj?.isrefundable,
            IndexNumber: "series",
            Provider: "Kafila",
            ValCarrier: seriesObj?.flights[0]?.airline_code,
            LastTicketingDate: "",
            TravelTime: seriesObj?.travel_time,
            PriceBreakup: [
              PaxDetail.Adults > 0
                ? {
                    PassengerType: "ADT",
                    NoOfPassenger: PaxDetail?.Adults,
                    Tax: seriesObj?.taxamountcost,
                    BaseFare: seriesObj?.baseamountcost,
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
                        Amount: seriesObj?.fuelsurchgcost,
                      }                    
                    ],
                    AirPenalty: [],
                    CommercialBreakup: [],
                  AgentMarkupBreakup: {
                    BookingFee: 0.0,
                    Basic: 0.0,
                    Tax: 0.0,                  
                }  
                  }
                : {},
              PaxDetail.Child > 0
                ? {
                    PassengerType: "CHD",
                    NoOfPassenger: PaxDetail?.Child,
                    Tax: seriesObj?.taxamountchdcost,
                    BaseFare: seriesObj?.baseamountchdcost,
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
                        Amount: seriesObj?.fuelsurchgchdcost,
                      },
                    ],
                    AirPenalty: [],
                    CommercialBreakup: [],
                  AgentMarkupBreakup: {
                    BookingFee: 0.0,
                    Basic: 0.0,
                    Tax: 0.0,                  
                }                    
                  }
                : {},
              PaxDetail.Infants > 0
                ? {
                    PassengerType: "INF",
                    NoOfPassenger: PaxDetail?.Infants,
                    Tax: seriesObj?.taxamountinfcost,
                    BaseFare: seriesObj?.baseamountinfcost,
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
                        Amount: seriesObj?.fuelsurchginfcost,
                      },
                    ],
                    AirPenalty: [],
                    CommercialBreakup: [],
                  AgentMarkupBreakup: {
                    BookingFee: 0.0,
                    Basic: 0.0,
                    Tax: 0.0,                  
                }                    
                  }
                : {},
            ],
            Sectors: seriesObj?.flights?.map((sector) => ({
              IsConnect: false,
              AirlineCode: sector?.airline_code,
              AirlineName: seriesObj?.airline_code,
              Class: seriesObj?.rbd,
              CabinClass: "",
              BookingCounts: "",
              NoSeats: seriesObj?.available_seats,
              FltNum: sector?.flightnumber,
              EquipType: "",
              FlyingTime: sector?.flyingtime,
              TravelTime: seriesObj?.travel_time,
              TechStopOver: 1,
              Status: "",
              OperatingCarrier: null,
              MarketingCarrier: null,
              BaggageInfo: seriesObj?.baggage?.name,
              HandBaggage: seriesObj?.baggage?.name,
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
              FareBasisCode: "",
              HostTokenRef: "",
              APISRequirementsRef: "",
              Departure: {
                Terminal: sector?.dterm,
                Date: sector?.flights?.departuredate,
                Time: sector?.flights?.departuretime,
                Day: null,
                DateTimeStamp: sector?.flights?.departuredate,
                Code: sector?.origin,
                Name: "",
                CityCode: sector?.origin,
                CityName: "",
                CountryCode: findCountryCodeByCode(airportDetails, sector?.origin),
                CountryName: findCountryNameByCode(airportDetails, sector?.origin),
              },
              Arrival: {
                Terminal: sector?.oterm,
                Date: sector?.arrivaldate,
                Time: sector?.arrivaltime,
                Day: null,
                DateTimeStamp: sector?.arrivaldate,
                Code: sector?.destination,
                Name: "",
                CityCode: sector?.destination,
                CityName: "",
                CountryCode: findCountryCodeByCode(airportDetails,sector?.destination),
                CountryName: findCountryNameByCode(airportDetails,sector?.destination),
              }
              
            })),
            HostTokens: null,
            Key: "",
            SearchID: "",
            TRCNumber: null,
            TraceId: Authentication.TraceId
            
          });
      }
       
      
  }  
  //console.log(processedSeries);  
  return {
    IsSucess: true,
    response: processedSeries,
  };
};

const findCountryNameByCode = (airportDetails,countryCode) => {
  const airport = airportDetails.find(airport => airport.Airport_Code === countryCode);
  return airport ? airport.Country_Name : null;
};

const findCountryCodeByCode = (airportDetails,countryCode) => {
  const airport = airportDetails.find(airport => airport.Airport_Code === countryCode);
  return airport ? airport.Country_Code : null;
};


module.exports = {
  getSearch
};
