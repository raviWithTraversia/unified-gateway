const flightcommercial = require("./flight.commercial");
const Company = require("../../models/Company");
const Supplier = require("../../models/Supplier");
const Users = require("../../models/User");
const bookingDetails = require("../../models/BookingDetails");
const CancelationBooking = require("../../models/booking/CancelationBooking");
const passengerPreferenceModel = require("../../models/booking/PassengerPreference");
const agentConfig = require("../../models/AgentConfig");
const ledger = require("../../models/Ledger");
const axios = require("axios");
const Logs = require("../../controllers/logs/PortalApiLogsCommon");
const uuid = require("uuid");
const NodeCache = require("node-cache");
const flightCache = new NodeCache();

const partialCancelation = async (req, res) => {
  const {
    Authentication,
    Provider,
    PNR,
    TravelType,
    BookingId,
    CancelType,
    Reason,
    Sector    
  } = req.body;
  const fieldNames = [
    "Authentication",
    "Provider",
    "PNR",
    "TravelType",
    "BookingId",
    "CancelType",
    "Reason",    
    "Sector"
    
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

  // check user and its role
  let agencyUserId;
const checkUserRole = await Users.findById(UserId).populate("company_ID").populate("roleId");
if (checkUserRole?.roleId.name === "Agency") {
    agencyUserId = checkUserRole._id;
} else {
    const checkAgencyByCompany = await Users.find({
        company_ID: checkUserRole.company_ID        
    }).populate("company_ID").populate("roleId");
    const agencyUser = checkAgencyByCompany.find(user => user.roleId.name === "Agency");
    if (agencyUser) {
      agencyUserId = agencyUser._id;
       
    }    
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
      agencyUserId
      
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
  Sector, 
  Reason,
  agencyUserId  
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
    providerBookingId: BookingId        
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

  
  const responsesApi = await Promise.all(
    supplierCredentials.map(async (supplier) => {
      try {
        switch (supplier.supplierCodeId.supplierCode) {
          case "Kafila":
            return await KafilaFun(
              Authentication,
              supplier,
              Provider,
              PNR,
              TravelType,
              BookingId,
              CancelType,
              Sector,
              Reason,              
              agencyUserId,
              BookingIdDetails             
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
  

  return {
    IsSucess: true,
    response: responsesApi[0],
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
  Sector, 
  Reason,
  agencyUserId,
  BookingIdDetails  
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
    
   // console.log(response.data, 'tokennnn');    
    if (response.data.Status === "success") {
      let getToken = response.data.Result;
      let requestDataForCHarges = {
        P_TYPE: "API",
        R_TYPE: "FLIGHT",
        R_NAME: "CANCEL",
        R_DATA: {
            ACTION: "CANCEL_CHARGE",
            BOOKING_ID: BookingId,
            CANCEL_TYPE: "PARTIAL_CANCELLATION",
            REASON: Reason,
            SECTORS:Sector,
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
        requestDataForCHarges,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ); 
        //console.log(fSearchApiResponse.data, "1API Responce")
      if (fSearchApiResponse.data.Status !==  null) {
        return fSearchApiResponse.data.ErrorMessage + "-" + fSearchApiResponse.data.WarningMessage
       
      }


      let requestDataForCancel= {
        P_TYPE: "API",
        R_TYPE: "FLIGHT",
        R_NAME: "CANCEL",
        R_DATA: {
            ACTION: "CANCEL_COMMIT",
            BOOKING_ID: BookingId,
            CANCEL_TYPE: "PARTIAL_CANCELLATION",
            REASON: Reason,
            SECTORS:Sector,
            TRACE_ID:Authentication?.TraceId,
            Charges:fSearchApiResponse?.data?.Charges,
            Error:fSearchApiResponse?.data?.Error,
            Status:fSearchApiResponse?.data?.Status
        },
        AID: supplier.supplierWsapSesssion,
        MODULE: "B2B",
        IP: "182.73.146.154",
        TOKEN: getToken,
        ENV: credentialType,
        Version: "1.0.0.0.0.0"
    };  
    
    
    let fCancelApiResponse = await axios.post(
      flightCancelUrl,
      requestDataForCancel,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ); 

    if(fCancelApiResponse?.data?.R_DATA?.Error?.Status.toUpperCase() === "PENDING" || fCancelApiResponse?.data?.R_DATA?.Error?.Status.toUpperCase() === "FAILED"){
        try {
          const cancelationBookingInstance = new CancelationBooking({
            calcelationStatus: fCancelApiResponse?.data?.R_DATA?.Error?.Status,
            AirlineCode: fCancelApiResponse?.data?.R_DATA?.Charges?.FlightCode,
            companyId: Authentication?.CompanyId,
            userId: Authentication?.UserId,
            PNR: fCancelApiResponse?.data?.R_DATA?.Charges?.Pnr,
            fare: fCancelApiResponse?.data?.R_DATA?.Charges?.Fare,
            AirlineCancellationFee: fCancelApiResponse?.data?.R_DATA?.Charges?.AirlineCancellationFee,
            AirlineRefund: fCancelApiResponse?.data?.R_DATA?.Charges?.AirlineRefund,
            ServiceFee: fCancelApiResponse?.data?.R_DATA?.Charges?.ServiceFee,
            RefundableAmt: fCancelApiResponse?.data?.R_DATA?.Charges?.RefundableAmt,
            description: fCancelApiResponse?.data?.R_DATA?.Charges?.Description,
            modifyBy: Authentication?.UserId,
            modifyAt: new Date(),
          });
          await cancelationBookingInstance.save();
          return fCancelApiResponse?.data;
        } catch (error) {
          throw new Error("Error saving cancellation data");
        }
      }else{
        try {  
          const getAgentConfig = await agentConfig.findOne({
            userId: agencyUserId,
          });
        
          const maxCreditLimit = getAgentConfig?.maxcreditLimit ?? 0;
                const newBalance = maxCreditLimit - fCancelApiResponse?.data?.R_DATA?.Charges?.RefundableAmt;
                await agentConfig.updateOne(
                  { userId: agencyUserId },
                  { maxcreditLimit: newBalance }
                );
          //console.log(getAgentConfig);
          const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
  
          // Create ledger entry
          await ledger.create({
            userId: agencyUserId,
            companyId: Authentication?.CompanyId,
            ledgerId: ledgerId,
            transactionAmount: fCancelApiResponse?.data?.R_DATA?.Charges?.RefundableAmt,
            currencyType: "INR",
            fop: "CREDIT",
            transactionType: "CREDIT",
            runningAmount: newBalance,
            remarks: "Calcelation Amount Added Into Your Account.",
            transactionBy: Authentication?.UserId          
          });
          
          const passengerPreference = await passengerPreferenceModel.findOne({
              bookingId: BookingIdDetails._id,
            }); 
              for (const flight of Sector) {
                const { PAX,SRC,DES } = flight;  
                for (const passenger of passengerPreference.Passengers) { 
                  for (const paxEntry of PAX) {
                    if (
                        passenger.FNAME === paxEntry.FNAME &&
                        passenger.LNAME === paxEntry.LNAME
                    ) {
                        
                    }
                }
                    // for (const flight of Sector) {
                    //   const { PAX,SRC,DES } = flight;            
                      
                    // }
                } 
            }
        //   await passengerPreferenceModel.updateOne(
        //     { bookingId: BookingIdDetails._id },
        //     {
        //         $set: {
        //             bookingStatus: "CANCELLED",
        //             bookingRemarks: "Cancelled Your Booking Successfully"
        //         }
        //     }
        // );


          const cancelationBookingInstance = new CancelationBooking({
            calcelationStatus: fCancelApiResponse?.data?.R_DATA?.Error?.Status,
            AirlineCode: fCancelApiResponse?.data?.R_DATA?.Charges?.FlightCode,
            companyId: Authentication?.CompanyId,
            userId: Authentication?.UserId,
            PNR: fCancelApiResponse?.data?.R_DATA?.Charges?.Pnr,
            fare: fCancelApiResponse?.data?.R_DATA?.Charges?.Fare,
            AirlineCancellationFee: fCancelApiResponse?.data?.R_DATA?.Charges?.AirlineCancellationFee,
            AirlineRefund: fCancelApiResponse?.data?.R_DATA?.Charges?.AirlineRefund,
            ServiceFee: fCancelApiResponse?.data?.R_DATA?.Charges?.ServiceFee,
            RefundableAmt: fCancelApiResponse?.data?.R_DATA?.Charges?.RefundableAmt,
            description: fCancelApiResponse?.data?.R_DATA?.Charges?.Description,
            modifyBy: Authentication?.UserId,
            modifyAt: new Date(),
          });
          await cancelationBookingInstance.save();
          return fCancelApiResponse?.data;
        } catch (error) {
          throw new Error("Error saving cancellation data");
        }
      }        
      
    } else {
      return response.data.ErrorMessage;
    }
  } catch (error) {
    return error.message
  }
};
module.exports = {
    partialCancelation,
};
