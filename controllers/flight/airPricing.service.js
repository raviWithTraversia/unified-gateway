const flightcommercial = require("./flight.commercial");
const PromoCode = require("../../models/AirlinePromoCode");
const Company = require("../../models/Company");
const Supplier = require("../../models/Supplier");
const Role = require("../../models/Role");
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
              Itinerary
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
  const getApplyAllCommercialVar = await flightcommercial.getApplyAllCommercial(
    Authentication,
    TravelType,
    commonArray
  );

  return {
    IsSucess: true,
    response: getApplyAllCommercialVar,
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
  Itinerary
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
      let getToken = response.data.Result;
      let requestDataFSearch = {Param: {
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
      },   SelectedFlights: [
        {
            PId: 0,
            Id: 0,
            TId: 0,
            Src: "DEL",
            Des: "BLR",
            FCode: "6E",
            FName: "GoIndigo",
            FNo: "2375",
            DDate: "2023-11-30T03:00:00",
            ADate: "2023-11-30T05:50:00",
            Dur: "0d:2h:50m",
            Stop: "0",
            Seat: 38,
            Sector: "DEL,BLR",
            Itinerary: [
                {
                    Id: 0,
                    Src: "DEL",
                    SrcName: "Delhi",
                    Des: "BLR",
                    DesName: "Bengaluru",
                    FLogo: "0 -123px",
                    FCode: "6E",
                    FName: "GoIndigo",
                    FNo: "2375",
                    DDate: "2023-11-30T03:00:00",
                    ADate: "2023-11-30T05:50:00",
                    DTrmnl: "2",
                    ATrmnl: "1",
                    DArpt: "Delhi Indira Gandhi Intl",
                    AArpt: "Bengaluru Intl Arpt",
                    Dur: "0d:2h:50m",
                    layover: "",
                    Seat: 38,
                    FClass: "R",
                    PClass: "A",
                    FBasis: "RFIP",
                    FlightType: "320",
                    OI: [
                        "SSK=6E~2375~ ~~DEL~11/30/2023 03:00~BLR~11/30/2023 05:50~~"
                    ]
                }
            ],
            Fare: {
                GrandTotal: 13964,
                BasicTotal: 11060,
                YqTotal: 0,
                TaxesTotal: 2904,
                Adt: {
                    Basic: 5530,
                    Yq: 0,
                    Taxes: 1452,
                    Total: 6982
                },
                Chd: null,
                Inf: null,
                OI: [
                    {
                        FAT: "Route",
                        FSK: "0~R~~6E~RFIP~4301~~0~60~~X"
                    }
                ]
            },
            FareRule: {
                CBNBG: "7KG",
                CHKNBG: "15KG",
                CBH: "96HRS",
                CWBH: "96HRS-4HRS",
                RBH: "96HRS",
                RWBH: "96HRS-4HRS",
                CBHA: 3000,
                CWBHA: 3600,
                RBHA: 2850,
                RWBHA: 3350,
                SF: 50.00
            },
            Alias: "MAIN",
            FareType: null,
            PFClass: "A-R",
            Offer: {
                Msg: "",
                Refund: "Refundable",
                IsPromoAvailable: true,
                IsGstMandatory: false,
                IsLcc: true
            },
            OI: {
                Jsk: "6E~2375~ ~~DEL~11/30/2023 03:00~BLR~11/30/2023 05:50~~",
                Pcc: "364549474E3030303346447E4D41494E",
                Security: "NA"
            },
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
        }
    ],
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
      //console.log(fSearchApiResponse.data, "API Responce")
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
        apiResponseCommon.push({
          UID: randomUID,
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
                  CommercialBreakup: [{
                    CommercialType: "SegmentKickback",
                    SubCommercialType: null,
                    Amount: 0.0,
                    SupplierId: supplier._id,
                    SupplierType: "TMC"
                }],
                AgentMarkupBreakup: {
                  BookingFee: 0.0,
                  Basic: 0.0,
                  Tax: 0.0,                  
              },
                  Key: null,
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
                  CommercialBreakup: [{
                    CommercialType: "SegmentKickback",
                    SubCommercialType: null,
                    Amount: 0.0,
                    SupplierId: supplier._id,
                    SupplierType: "TMC"
                }],
                AgentMarkupBreakup: {
                  BookingFee: 0.0,
                  Basic: 0.0,
                  Tax: 0.0,                  
              },
                  Key: null,
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
                  CommercialBreakup: [{
                    CommercialType: "SegmentKickback",
                    SubCommercialType: null,
                    Amount: 0.0,
                    SupplierId: supplier._id,
                    SupplierType: "TMC"
                }],
                AgentMarkupBreakup: {
                  BookingFee: 0.0,
                  Basic: 0.0,
                  Tax: 0.0,                  
              },
                  Key: null,
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
            BaggageInfo: "20 Kilograms",
            HandBaggage: "7 KG",
            TransitTime: null,
            MealCode: null,
            Key: "",
            Distance: "708",
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
              CountryCode: "IN",
              CountryName: "India",
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
              CountryCode: "IN",
              CountryName: "India",
            },
          })),
          HostTokens: null,
          Key: "",
          SearchID: "",
          TRCNumber: null,
          TraceId: Authentication.TraceId,
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
    airPricing,
};
