const flightcommercial = require("./flight.commercial");
const PromoCode = require("../../models/AirlinePromoCode");
const Company = require("../../models/Company");
const AirportsDetails = require("../../models/AirportDetail");
const Supplier = require("../../models/Supplier");
const fareFamilyMaster = require("../../models/FareFamilyMaster");
const Role = require("../../models/Role");
const Logs = require("../../controllers/logs/PortalApiLogsCommon");
const axios = require("axios");
const uuid = require("uuid");
const NodeCache = require("node-cache");
const flightCache = new NodeCache();

const airPricing = async (req, res) => {
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
    Itinerary
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
    "Itinerary"
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
      RefundableOnly,
      Itinerary
    );
  };
 // console.log("============>>>MMMMMMMMMM", result , "<<<============nnnnnnnnnnnnnnnnnnnn")
 const logData = {
  traceId: Authentication.TraceId,
  companyId: Authentication.CompanyId,
  userId: Authentication.UserId,
  source: "Kafila",
  type: "Portal Log",
  product: "Flight",
  logName: "Air Pricing",
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
      apiReq : result.apiReq 
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
  Itinerary
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
  let res;
  const responsesApi = await Promise.all(
    supplierCredentials.map(async (supplier) => {
      try {
        switch (supplier.supplierCodeId.supplierCode) {
          case "Kafila":
            // check here airline promoCode if active periority first agent level then group level
            return   res = await KafilaFun(
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
              Itinerary,
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


  // return {
  //   IsSucess: true,
  //   response: responsesApi,
  //   apiReq : responsesApi
  // };
 // console.log("pppppppppppppppppppppppp", res, "<<<========pppp")
  // delete this one
  // return {
  //   IsSucess: true,
  //   response: responsesApi,
  // };
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

  // apply commercial function
 // console.log("{{{{{{{{{{{{{{{{{{{",commonArray,"}}}}}}}}}}}}}}}}}}}}}}" )
  const getApplyAllCommercialVar = await flightcommercial.getApplyAllCommercial(
    Authentication,
    TravelType,
    commonArray
  );
  //console.log("pppppppppppppppppppppppp", res, "<<<========ppppvvvvvvvv")
  return {
    IsSucess: true,
    response: getApplyAllCommercialVar.IsSucess ? getApplyAllCommercialVar.response:getApplyAllCommercialVar,
    apiReq : res.apiReq
  };
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
  Itinerary,
  airportDetails
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
     flightSearchUrl = `http://fhapip.ksofttechnology.com/api/FFareCheck`;
    //createTokenUrl = `http://stage1.ksofttechnology.com/api/Freport`;
    //flightSearchUrl = `http://stage1.ksofttechnology.com/api/FFareCheck`;
  } else {
    // Test Url here
    createTokenUrl = `http://stage1.ksofttechnology.com/api/Freport`;
    flightSearchUrl = `http://stage1.ksofttechnology.com/api/FFareCheck`;
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
    if (response.data.Status === "success") { 
      const newArray = Itinerary.map(item => {                 
        const sectorsall = item.Sectors.map(sector => ({          
          Id: 0,
          Src: sector.Departure.Code,
          SrcName: sector.Departure.CityName,
          Des: sector.Arrival.Code,
          DesName: sector.Arrival.CityName,
          FLogo: "",
          FCode: sector.AirlineCode,
          FName: sector.AirlineName,
          FNo: sector.FltNum,
          DDate: sector.Departure.DateTimeStamp,
          ADate: sector.Arrival.DateTimeStamp,
          DTrmnl: sector.Departure.Terminal,
          ATrmnl: sector.Arrival.Terminal,
          DArpt: sector.Departure.Name,
          AArpt: sector.Arrival.Name,
          Dur: sector.FlyingTime,
          layover: sector.layover,
          Seat: 0,
          FClass: sector.Class,
          PClass: sector.CabinClass,
          FBasis: sector.FareBasisCode,
          FlightType: sector.EquipType,
          OI:sector.OI
        }));    
        
        const Adt = item.PriceBreakup[1] ? {
          Basic: item.PriceBreakup[0]?.BaseFare || 0,
          Yq: item.PriceBreakup[0]?.TaxBreakup.find(tax => tax.TaxType === 'YQ')?.Amount || 0,
          Taxes: item.PriceBreakup[0]?.Tax || 0,
          Total: (item.PriceBreakup[0]?.BaseFare || 0) + (item.PriceBreakup[0]?.TaxBreakup.find(tax => tax.TaxType === 'YQ')?.Amount || 0) + (item.PriceBreakup[0]?.Tax || 0)
        } : null;
        
        const Chd = Object.keys(item.PriceBreakup[1]).length !== 0
        ? {
          Basic: item.PriceBreakup[1]?.BaseFare || 0,
          Yq: item.PriceBreakup[1]?.TaxBreakup.find(tax => tax.TaxType === 'YQ')?.Amount || 0,
          Taxes: item.PriceBreakup[1]?.Tax || 0,
          Total: (item.PriceBreakup[1]?.BaseFare || 0) + (item.PriceBreakup[1]?.TaxBreakup.find(tax => tax.TaxType === 'YQ')?.Amount || 0) + (item.PriceBreakup[1]?.Tax || 0)
        } : null;
                
        const Inf = Object.keys(item.PriceBreakup[2]).length !== 0
        ? {
          Basic: item.PriceBreakup[2]?.BaseFare || 0,
          Yq: item.PriceBreakup[2]?.TaxBreakup.find(tax => tax.TaxType === 'YQ')?.Amount || 0,
          Taxes: item.PriceBreakup[2]?.Tax || 0,
          Total: (item.PriceBreakup[2]?.BaseFare || 0) + (item.PriceBreakup[2]?.TaxBreakup.find(tax => tax.TaxType === 'YQ')?.Amount || 0) + (item.PriceBreakup[2]?.Tax || 0)
        } : null;        
            
        return {
          PId: 0,
          Id: 0,
          TId: 0,
          Src: Segments[0].Origin,
          Des: Segments[0].Destination,
          FCode: item.ValCarrier,
          FName: "",
          FNo: "",
          DDate: "",
          ADate: "",
          Dur: "",
          Stop: "",
          Seat: item.Sectors[0].NoSeats,
          Sector: "",
          Itinerary: sectorsall,
          Fare: {
            GrandTotal: item.TotalPrice,
            BasicTotal: item.BaseFare,
            YqTotal: 0,
            TaxesTotal: item.Taxes,
            Adt: Adt,
            Chd: Chd,
            Inf: Inf,
            OI: item.PriceBreakup[0]?.OI || null,
          },
          FareRule: item.FareRule,
          Alias: item.FareFamily,
          FareType: item.FareType,
          PFClass: "A-R",
          Offer: {
            Msg: "",
            Refund: "",
            IsPromoAvailable: true,
            IsGstMandatory: false,
            IsLcc: true
          },
          OI: item.OI,
          Deal: {
            NETFARE: 13439,
            TDISC: 553,
            TDS: 28,
            GST: 100,
            DISCOUNT: {
              DIS: 553,
              SF: 0,
              PDIS: 0,
              CB: 0
            }
          }
        };        
      });      
      
      

      let getToken = response.data.Result;
      //let requestDataFSearch = Itinerary.apiItinerary;
      //console.log(Itinerary[0].apiItinerary);
      let requestDataFSearch = { Param: {
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
      },   
      SelectedFlights: [Itinerary[0].apiItinerary],
    GstData: {
        IsGst: false,
        GstDetails: {
            Name: "Kafila Hospitality and Travels Pvt Ltd",
            Address: "10185-c, Arya samaj Road, Karolbagh",
            Email: "admin@kafilatravel.in",
            Mobile: "9899911993",
            Pin: "110005",
            State: "Delhi",
            Type: "",
            Gstn: "07AAACD3853F1ZW"
        }
    }
    };
    // return {
    //   IsSucess: true,
    //   response: requestDataFSearch,
    //   apiReq: requestDataFSearch
    // };
   // console.log(requestDataFSearch, "API Responce")
   //console.log(requestDataFSearch, "Request")
      let fSearchApiResponse = await axios.post(
        flightSearchUrl,
        requestDataFSearch,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      //logger.info(fSearchApiResponse.data);
      const logData = {
        traceId: Authentication.TraceId,
        companyId: Authentication.CompanyId,
        userId: Authentication.UserId,
        source: "Kafila",
        type: "API Log",
        product: "Flight",
        logName: "Air Pricing",
        request: requestDataFSearch,
        responce: fSearchApiResponse?.data
      };  
      Logs(logData);
    //  console.log(fSearchApiResponse.data, "API Responce")
      if (fSearchApiResponse.data.Status == "failed") {
        return {
          IsSucess: false,
          response:
            fSearchApiResponse.data.ErrorMessage +
            "-" +
            fSearchApiResponse.data.WarningMessage,
        };
      }
      //console.log('apiData',fSearchApiResponse.data); 
          
      //flightCache.set(cacheKey, fSearchApiResponse.data, 300);
      let apiResponse = fSearchApiResponse.data;
      let apiResponseCommon = [];
     // apiResponseCommon.push(fSearchApiResponse.data);
      
      for (let index = 0; index < apiResponse.SelectedFlight.length; index++) {
        let schedule = apiResponse.SelectedFlight[index];   
        //console.log(schedule, 'api responce');     
         //let oldItinerary = Itinerary[index];         
        // apiResponseCommon.push(schedule);       
        
        apiResponseCommon.push({
          UID: Itinerary[index].UID,
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
          TourCode: "",
          PricingMethod: "Guaranteed",
          FareFamily: schedule?.Offer?.Msg === "" ? schedule?.Alias : schedule?.Offer?.Msg,
          PromotionalFare: false,
          FareFamilyDN: null,
          PromotionalCode: "",
          PromoCodeType: "",
          RefundableFare: schedule.Offer.Refund === "Refundable" ? true : false,
          Stop:schedule.Stop,
          IsVia: schedule?.Itinerary[0]?.layover != "" ? true : false,
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
          Sectors: schedule.Itinerary.map((sector,indexcount) => ({
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
            layover:sector.layover,
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
              CountryCode: findCountryCodeByCode(airportDetails,sector.Src),
              CountryName: findCountryNameByCode(airportDetails,sector.Src),
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
              CountryCode: findCountryCodeByCode(airportDetails,sector.Des),
              CountryName: findCountryNameByCode(airportDetails,sector.Des),
            },
            OI:sector.OI
          })),
          FareDifference:apiResponse.FareBreakup,
          Error:apiResponse.Error,
          IsFareUpdate: apiResponse.IsFareUpdate,
          IsAncl: apiResponse.IsAncl,
          Param:apiResponse.Param,
          GstData: {
            IsGst: false,
            GstDetails: {
                Name: "Kafila Hospitality and Travels Pvt Ltd",
                Address: "10185-c, Arya samaj Road, Karolbagh",
                Email: "admin@kafilatravel.in",
                Mobile: "9899911993",
                Pin: "110005",
                State: "Delhi",
                Type: "",
                Gstn: "07AAACD3853F1ZW"
            }
        },
        SelectedFlight:apiResponse.SelectedFlight[0],
          HostTokens: null,
          Key: "",
          SearchID: "",
          TRCNumber: null,
          TraceId: Authentication.TraceId,
          OI:schedule.OI ?? null
        });
      }
     // apiResponseCommon.push("<<<<<<<=============>>>>>>>>>>>>>>>");
   //   apiResponseCommon.push(fSearchApiResponse.data);
      //console.log("==========>>>>",apiResponseCommon , "<<==================")
      return {
        IsSucess: true,
        response: apiResponseCommon,
        apiReq: fSearchApiResponse.data
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

const findCountryNameByCode = (airportDetails,countryCode) => {
  const airport = airportDetails.find(airport => airport.Airport_Code === countryCode);
  return airport ? airport.Country_Name : null;
};

const findCountryCodeByCode = (airportDetails,countryCode) => {
  const airport = airportDetails.find(airport => airport.Airport_Code === countryCode);
  return airport ? airport.Country_Code : null;
};
module.exports = {
    airPricing,
};
