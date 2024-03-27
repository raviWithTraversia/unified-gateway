const flightcommercial = require("./flight.commercial");
const PromoCode = require("../../models/AirlinePromoCode");
const Company = require("../../models/Company");
const AirportsDetails = require("../../models/AirportDetail");
const Supplier = require("../../models/Supplier");
const Role = require("../../models/Role");
const axios = require("axios");
const uuid = require("uuid");
const NodeCache = require("node-cache");
const flightCache = new NodeCache();
const airlineCodeModel = require('../../models/AirlineCode');
const ssrCommercialModel = require('../../models/SsrCommercial');
const moment = require("moment");
const agencyConfigModel = require('../../models/AgentConfig');

const specialServiceReq = async (req,res) => {
  try{
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
      ssrReqData
    }= req.body;

    const feildNames = [
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
      const missingFields = feildNames.filter(
        (feildName) => req.body[feildName] === null || req.body[feildName] == undefined
      );

      if(missingFields.length > 0){
        const missingFieldsString = missingFields.join(', ');
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
      ssrReqData
    );
  //  console.log("============>>>MMMMMMMMMM", result , "<<<============nnnnnnnnnnnnnnnnnnnn")
    if (!result.IsSucess) {
      return {
        response: result.response,
      };
    } else {
     let DepartureDate = Segments[0].DepartureDate;
     let AirlinesData = ssrReqData.SelectedFlight[0].FCode;
     console.log("<<<<",Authentication, ">>>>>>>>>>>>>>>>>>>>")
     await ssrCommercialGroup(Authentication.UserId)
      let tmcSsrData  = await ssrCommercialData(TravelType,DepartureDate,AirlinesData);
      //console.log("===>>>>>>>>>>>>>>>>>>>>>>>>",tmcSsrData);
      if(tmcSsrData){
        result.tmcSsrData = tmcSsrData
      }else{
        result.tmcSsrData = null
      }
     
      return {
        response: "Fetch Data Successfully",
        data: result,
        //apiReq : result.apiReq 
      };
    }
  };
  }catch(error){
     console.log(error);
     throw error
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
  ssrReqData
  
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
  
    let res;
    const responsesApi = await Promise.all(
      supplierCredentials.map(async (supplier) => {
        try {
          switch (supplier.supplierCodeId.supplierCode) {
            case "Kafila":
              return   res = await KafilaFun(
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
      supplier.supplierCodeId.supplierCode,
       airportDetails,
       supplier,
       ssrReqData

              );
  
            default:
              throw new Error(
                `Unsupported supplier: ${supplier.supplierCodeId.supplierCode}`
              );
          }
        } catch (error) {
          return { error: error.message};
        }
      })
    );

    return {
      IsSucess: true,
      response: res,
    };
};
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
  Provider,
   // Itinerary,
  airportDetails,
  supplier,
  ssrReqData
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
      flightSearchUrl = `http://fhapip.ksofttechnology.com/api/FAncl`;
    } else {
      // Test Url here
      createTokenUrl = `http://stage1.ksofttechnology.com/api/Freport`;
      flightSearchUrl = `http://stage1.ksofttechnology.com/api/FAncl`;
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

      let requestDataFSearch = ssrReqData
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
        
       console.log(fSearchApiResponse.data, "API Responce");

        if (fSearchApiResponse.data.Status == "failed") {
          return {
            IsSucess: false,
            response:
              fSearchApiResponse.data.ErrorMessage +
              "-" +
              fSearchApiResponse.data.WarningMessage,
          };
        }
      //   console.log("========>>>ssss",fSearchApiResponse.data.Ancl.Seat, "<<<<jjjjjjjjjjjjjj")
        let seat =  processSsrArray(fSearchApiResponse.data.Ancl.Seat,supplier);
       fSearchApiResponse.data.Ancl.Seat = seat;
      // fSearchApiResponse.ssrCommercialData = await ssrCommercialData()
        return {
          IsSucess: true,
          response: fSearchApiResponse.data,
         // apiReq: fSearchApiResponse.data
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




let provider = "Kafila"
const processSsrArray = (reqArray, provider) => {
  const resArray = { SeatRow: [] };

  reqArray.forEach(seatGroups => {
      seatGroups.forEach(seats => {
          seats.forEach(seat => {
              const { SeatRow, SeatCode, Avlt, Currency, SsrDesc, Price, Compartemnt,FCode,FNo,FType ,Src,Des,Group,DDate,Deck,OI} = seat;
              let seatRowObj = resArray.SeatRow.find(row => row.Number === seat.SeatRow);
              if (!seatRowObj) {
                  seatRowObj = { Number: seat.SeatRow, Facilities: [] };
                  resArray.SeatRow.push(seatRowObj);
              }
              seatRowObj.Facilities.push({
                  ProviderDefinedType: provider,
                  Compartemnt: Compartemnt,
                  Type: 'Seat',
                  Seatcode: SeatCode,
                  Availability: Avlt,
                  Paid: Avlt,
                  Currency: Currency,
                  Characteristics: [SsrDesc],
                  TotalPrice: Price,
                  Key: OI,
                  FCode : FCode,
                  FNo : FNo,
                  FType : FType,
                  Src : Src,
                  Des : Des,
                  Group : Group,
                  DDate : DDate,
                  Deck : Deck

              });
          });
      });
  });

  return resArray;
};


const seatArr = [];

// arrayOfArrays.forEach((subArray, index) => {
//   console.log(`Processing subarray ${index + 1}`);
//   const result = processSsrArray(subArray, "yourProvider");
//   seatArr.push(result);
// });

console.log(seatArr);
let res = {
    "Number":"3",
    "Facilities":[
    {
    "Type":"Seat",
    "SeatCode":"3A",
    "Availability":"Open",
    "Paid":true,
    "Characteristics":[
    "LEGROOM",
    "PRIME",
    "WINDOW"
    ],
    "Key":null,
    "Currency":null,
    "TotalPrice":1200.0,
    "ProviderDefinedType":null
    }
]
};

const ssrCommercialGroup = async (userId) => {
  console.log("mmmmmm", userId)
  let ssrCommercialGroup = await agencyConfigModel.findOne({ userId })
  .populate({
    path: 'agencyGroupId',
    populate: { 
      path: 'ssrCommercialGroupId',
      populate: {
        path: 'ssrCommercialIds', // Assuming 'ssrCommercialIds' needs to be populated from another collection.
        model: 'SSRCommercial' // This should be the name of the model you're populating from.
      }
    }
  });
console.log("pppppppppppppppppppppp",ssrCommercialGroup)
}
const ssrCommercialData = async (TypeOfTrip,DepartureDate,FlightName) => {
  let airlineCodeId = await airlineCodeModel.findOne({airlineCode : FlightName });
  airlineCodeId = airlineCodeId._id;
 let ssrCommercialsData = await ssrCommercialModel.find({
  travelType: TypeOfTrip,
  airlineCodeId: airlineCodeId,
  validDateFrom: { $lte: new Date(DepartureDate) },
  validDateTo: { $gte: new Date(DepartureDate) } 
});
  return ssrCommercialsData;
}

module.exports = {
  specialServiceReq 
}