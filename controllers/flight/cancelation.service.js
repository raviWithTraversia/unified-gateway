const flightcommercial = require("./flight.commercial");
const Company = require("../../models/Company");
const Supplier = require("../../models/Supplier");
const bookingDetails = require("../../models/BookingDetails");
const axios = require("axios");
const uuid = require("uuid");
const NodeCache = require("node-cache");
const flightCache = new NodeCache();

const fullCancelation = async (req, res) => {
  const {
    Authentication,
    Provider,
    PNR,
    TravelType,
    BookingId,
    CancelType,
    Reason,
    Sector,
    AdultCount,
    ChildCount,
  } = req.body;
  const fieldNames = [
    "Authentication",
    "Provider",
    "PNR",
    "TravelType",
    "BookingId",
    "CancelType",
    "Reason",    
    "Sector",
    "AdultCount",
    "ChildCount",
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

  let result;
  if (TravelType !== "International" && TravelType !== "Domestic") {
    return {
      response: "Travel Type Not Valid",
    };
  } else {
    result = await handleflight(
      Authentication,
      Provider,
      PNR,
      TravelType,
      BookingId,
      CancelType,      
      Sector,
      Reason,
      AdultCount,
      ChildCount
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
      apiReq: result.apiReq,
    };
  }
};

async function handleflight(
  Authentication,
  Provider,
  PNR,
  TravelType,
  BookingId,
  CancelType, 
  Reason, 
  Sector,
  AdultCount,
  ChildCount
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

  const BookingIdDetails = await bookingDetails.find({
    bookingId: BookingId        
  });
    
  if (!BookingIdDetails || !BookingIdDetails.length) {
    return {
      IsSucess: false,
      response: "Booking Id does not exist",
    };
  }  
  if (!TraceId) {
    return {
      IsSucess: false,
      response: "Trace Id Required",
    };
  }

  
    const responsesApi = supplierCredentials.map(async (supplier) => {
      try {
        switch (supplier.supplierCodeId.supplierCode) {
          case "Kafila":
            // check here airline promoCode if active periority first agent level then group level
            return await KafilaFun(
              Authentication,
              supplier,
              Provider,
              PNR,
              TravelType,
              BookingId,
              CancelType, 
              Reason,             
              Sector,
              AdultCount,
              ChildCount
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
  

  return {
    IsSucess: true,
    response: responsesApi,
  };
}

const KafilaFun = async (
  Authentication,
  supplier,
  Provider,
  PNR,
  TravelType,
  BookingId,
  CancelType, 
  Reason, 
  Sector,
  AdultCount,
  ChildCount
) => {
  let createTokenUrl;
  let flightCancelUrl;

  let credentialType = "D";
  if (Authentication.CredentialType === "LIVE") {
    // Live Url here
    credentialType = "P";
    createTokenUrl = `http://fhapip.ksofttechnology.com/api/Freport`;
    flightCancelUrl = `http://fhapip.ksofttechnology.com/api/FCancel`;
  } else {
    // Test Url here
    createTokenUrl = `http://stage1.ksofttechnology.com/api/Freport`;
    flightCancelUrl = `http://stage1.ksofttechnology.com/api/FCancel`;
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
      let requestDataFSearch = {
        P_TYPE: "API",
        R_TYPE: "FLIGHT",
        R_NAME: "CANCEL",
        R_DATA: {
            ACTION: "CANCEL_CHARGE",
            BOOKING_ID: "B2B1602241706PM229808359c3",
            CANCEL_TYPE: "FULL_CANCELLATION",
            REASON: Reason,
            TRACE_ID:Authentication.TraceId
        },
        AID: supplier.supplierWsapSesssion,
        MODULE: "B2B",
        IP: "182.73.146.154",
        TOKEN: getToken,
        ENV: credentialType,
        Version: "1.0.0.0.0.0"
    };    
       
      let fSearchApiResponse = await axios.post(
        flightCancelUrl,
        requestDataFSearch,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ); 
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
      console.log('apiData',fSearchApiResponse.data);
     
    //   return {
    //     IsSucess: true,
    //     response: apiResponseCommon,
    //     apiReq: fSearchApiResponse.data,
    //   };
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
  fullCancelation,
};
