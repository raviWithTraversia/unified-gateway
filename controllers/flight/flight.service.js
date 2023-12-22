const PromoCode = require("../../models/AirlinePromoCode");
const Company = require("../../models/Company");
const Supplier = require("../../models/Supplier");
const axios = require("axios");
const uuid = require('uuid');
const NodeCache = require('node-cache');
const flightCache = new NodeCache();

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

  if (!companyId) {
    return {
      response: "company Id field are required",
    };
  }

  // Check if company Id exists
  const checkCompanyIdExist = await Company.findById(companyId);
  if (!checkCompanyIdExist) {
    return {
      response: "Compnay id does not exist",
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
  }else{
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
  // Commertial query call here ( PENDING )
  // Supplier API Integration Start Here ....
  const responsesApi = await Promise.all(
    supplierCredentials.map(async (supplier) => {
      try {
        switch (supplier.supplierCodeId.supplierCode) {
          case "Kafila":
            return await internationalKafilaFun(
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
              RefundableOnly
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
  const  commercialApplyResult = await commercialApplyHandle(commonArray); 

  return {
    IsSucess: true,
    response: commercialApplyResult,
  };
}

const internationalKafilaFun = async (
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
  RefundableOnly
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
  if(Authentication.CredentialType === "LIVE"){
    // Live Url here
    createTokenUrl = `http://stage1.ksofttechnology.com/api/Freport`;
    flightSearchUrl = `http://stage1.ksofttechnology.com/api/FSearch`;    
  }else{
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
  }else if(TravelType == "Domestic"){
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
  }else{
    return {
      IsSucess: false,
      response: "Invalid TypeOfTrip",
    };
  } 
  //Class Of Service Economy, Business, Premium Economy
  const classOfServiceMap = {
    "Economy": "EC",
    "Business": "BU",
    "Premium Economy": "PE",
    "First":""
  };
  
  let classOfServiceVal = classOfServiceMap[ClassOfService] || "";
  
  // Fare Family Array 
  let fareFamilyVal = FareFamily && FareFamily.length > 0 ? FareFamily.join(',') : "";


  const segmentsArray = Segments.map(segment => ({
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
        'Content-Type': 'application/json',
      },
    });
    if(response.data.Status === "success"){
      let getToken = response.data.Result;      
      let requestDataFSearch = {        
        Trip: tripTypeValue,
        Adt: PaxDetail.Adults,
        Chd: PaxDetail.Child,
        Inf: PaxDetail.Infants,
        Sector: segmentsArray,
        PF: Airlines.length > 0 ? Airlines.join(',') : "",
        PC: classOfServiceVal,
        Routing: "ALL",
        Ver: "1.0.0.0",
        Auth: {
          AgentId: supplier.supplierWsapSesssion,
          Token: getToken,
        },
        Env: "D",
        Module: "B2B",
        OtherInfo: {
          PromoCode: "KAF2022",
          FFlight: "",
          FareType: fareFamilyVal,
          TraceId: Authentication.TraceId,
          IsUnitTesting: false,
          TPnr: false
        }
      };
       
      let fSearchApiResponse = await axios.post(flightSearchUrl, requestDataFSearch, {
        headers: {
          'Content-Type': 'application/json',
        },
      });     
      
      if (fSearchApiResponse.data.Status == "failed") {
        return {
          IsSucess: false,
          response: fSearchApiResponse.data.ErrorMessage + '-' + fSearchApiResponse.data.WarningMessage,
        };
      } 
      //flightCache.set(cacheKey, fSearchApiResponse.data, 300);
      let apiResponse = fSearchApiResponse.data;
      let apiResponseCommon = [];
      for (let schedule of apiResponse.Schedules[0]) { 
        let randomUID = uuid.v4();
       // apiResponseCommon.push(schedule);
        apiResponseCommon.push({
          "UID": randomUID,
          "BaseFare":schedule.Fare.BasicTotal,          
          "Taxes":schedule.Fare.TaxesTotal,
          "TotalPrice":schedule.Fare.GrandTotal,
          "ExtraCharges":0.0,
          "TaxMarkUp":0.0,
          "MarkUp":0.0,
          "Commission":0.0,
          "Fees":0.0,
          "BookingFees":0.0,
          "ServiceFee":0.0,
          "CancellationFees":0.0,
          "RescheduleFees":0.0,
          "AdminFees":0.0,
          "Discount":0.0,
          "TDS":0.0,
          "BaseCharges":0.0,
          "SupplierDiscount":0.0,
          "SupplierDiscountPercent":0.0,
          "GrandTotal":schedule.Fare.GrandTotal,
          "Currency":"INR",
          "FareType":"",
          "TourCode":"",
          "PricingMethod":"Guaranteed",
          "FareFamily":"Regular Fare",
          "PromotionalFare":false,
          "FareFamilyDN":null,
          "PromotionalCode":"",
          "PromoCodeType":"Partner",
          "RefundableFare":false,
          "IndexNumber":0,
          "Provider":"1G",
          "ValCarrier":"AI",
          "LastTicketingDate":"2023-12-27T23:59:00.000+05:30",
          "TravelTime":null,
          "Sectors":schedule.Itinerary.map(sector => (
            {
              "IsConnect":false,
              "AirlineCode": sector.FCode,
              "AirlineName": sector.FName,
              "Class": sector.FClass,
              "CabinClass":"Economy",
              "BookingCounts":"",
              "NoSeats":0,
              "FltNum":sector.FNo,
              "EquipType":"32N",
              "FlyingTime":"01:25",
              "TravelTime":"03:30",
              "TechStopOver":1,
              "Status":"",
              "OperatingCarrier":null,
              "MarketingCarrier":null,
              "BaggageInfo":"20 Kilograms",
              "HandBaggage":"7 KG",
              "TransitTime":null,
              "MealCode":null,
              "Key":"gvEvQxFDuDKAOTyacNAAAA==",
              "Distance":"708",
              "ETicket":"Yes",
              "ChangeOfPlane":"false",
              "ParticipantLevel":"Secure Sell",
              "OptionalServicesIndicator":false,
              "AvailabilitySource":"P",
              "Group":"0",
              "LinkAvailability":"true",
              "PolledAvailabilityOption":"Cached status used. Polled avail exists",
              "FareBasisCode":"SIP",
              "HostTokenRef":"",
              "APISRequirementsRef":"",
              "Departure":{
                "Terminal":sector.DTrmnl,
                "Date": sector.DDate.split('T')[0],
                "Time":sector.DDate.split('T')[1].substring(0, 5),
                "Day":null,
                "DateTimeStamp":sector.DDate,
                "Code":sector.Src,
                "Name":sector.DArpt,
                "CityCode":sector.Src,
                "CityName": sector.SrcName,
                "CountryCode":"IN",
                "CountryName":"India"
              },
              "Arrival":{
                "Terminal":sector.ATrmnl,
                "Date":sector.ADate.split('T')[0],
                "Time":sector.ADate.split('T')[1].substring(0, 5),
                "Day":null,
                "DateTimeStamp":sector.ADate,
                "Code":sector.Des,
                "Name":sector.AArpt,
                "CityCode":sector.Des,
                "CityName":sector.DesName,
                "CountryCode":"IN",
                "CountryName":"India"
              }
            }
            )),
          "HostTokens":null,
          "Key":"gvEvQxFDuDKAkayacNAAAA==",
          "SearchID":"2a1aefe1-8b53-419a-b5fb-44a7f4b4f859",
          "TRCNumber":null,
          "TraceId":"c27f4b59-679c-47c4-922e-8ca4db457c3a"  
        });
      }


      return {
        IsSucess: true,
        response: apiResponseCommon,
      };     
         
     
      
    }else{ 
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

const commercialApplyHandle = async (commonArray) => {
  // const commercialPlan = await  
  // const supplierCredentials = await Supplier.find({
  //   companyId: CompanyId,
  //   credentialsType: CredentialType,
  // })
  //   .populate({
  //     path: "supplierCodeId",
  //     select: "supplierCode",
  //   })
  //   .exec();
  return {
    IsSucess: true,
    response: commonArray,
  };
}

module.exports = {
  getSearch,
};
