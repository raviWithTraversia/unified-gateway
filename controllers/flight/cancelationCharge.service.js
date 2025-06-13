const flightcommercial = require("./flight.commercial");
const Company = require("../../models/Company");
const Users = require("../../models/User");
const Supplier = require("../../models/Supplier");
const agentConfig = require("../../models/AgentConfig");
const bookingDetails = require("../../models/booking/BookingDetails");
const CancelationBooking = require("../../models/booking/CancelationBooking");
// const Logs = require("../../controllers/logs/PortalApiLogsCommon");
const axios = require("axios");
const uuid = require("uuid");
const passengerPreferenceModel = require("../../models/booking/PassengerPreference");
const NodeCache = require("node-cache");
const {
  commonAirBookingCancellation,commonAirBookingCancellationCharge
} = require("../../services/common-air-cancellation");
const BookingDetails = require("../../models/booking/BookingDetails");
const PassengerPreference = require("../../models/booking/PassengerPreference");
const flightCache = new NodeCache();
const { calculateDealAmount } = require("./partialCalcelationCharge.service");
const Logs = require("../../controllers/logs/PortalApiLogsCommon");

const {
  updateStatus,
  updatePassengerStatus,
} = require("../commonFunctions/common.function");
const fullCancelationCharge = async (req, res) => {
  const {
    Authentication,
    Provider,
    PNR,
    TravelType,
    BookingId,
    CancelType,
    Reason,
    Sector,
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
  const checkUserRole = await Users.findById(UserId)
    .populate("company_ID")
    .populate("roleId");
  if (checkUserRole?.roleId.name === "Agency") {
    agencyUserId = checkUserRole._id;
  } else {
    const checkAgencyByCompany = await Users.find({
      company_ID: checkUserRole.company_ID,
    })
      .populate("company_ID")
      .populate("roleId");
    const agencyUser = checkAgencyByCompany.find(
      (user) => user.roleId.name === "Agency"
    );
    if (agencyUser) {
      agencyUserId = agencyUser._id;
    }
  }
  // if (Provider.toLowerCase() === "kafila") {
    let result;
    if(Provider === "Kafila"){
    if (TravelType !== "International" && TravelType !== "Domestic") {
      return {
        response: "Travel Type Not Valid",
      };
    } else {
      result = await handleflight(
        req,
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
      // console.log(Reason,'0')
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
    // }
  // } else {
  //   try {
  //     // return false;
  //     const { result, error } = await commonAirBookingCancellation(req.body);
  //     if (error)
  //       return {
  //         response: "Cancellation Failed",
  //         data: {
  //           Status: "CANCELLATION FAILED",
  //           Error:
  //             typeof error === "string"
  //               ? error
  //               : error?.message || "Internal Server Error",
  //         },
  //       };

  //     const status = result?.journey?.[0]?.status || "CANCELLATION FAILED";
  //     if (status === "CANCELLED") {
  //       const booking = await BookingDetails.findOneAndUpdate(
  //         {
  //           providerBookingId: req.body.BookingId,
  //         },
  //         { $set: { bookingStatus: "CANCELLATION PENDING" } },
  //         { new: true }
  //       );

  //       let calculateFareAmount = 0;

  //       for (let passenger of req.body.passengarList) {
  //         calculateFareAmount += calculateDealAmount(
  //           booking,
  //           passenger.PAX_TYPE
  //         );
  //         await updatePassengerStatus(booking, passenger, "CANCELLATION PENDING");
  //       }
  //       const cancelationBookingInstance = new CancelationBooking({
  //         calcelationStatus: "PENDING",
  //         bookingId: booking?.providerBookingId,
  //         providerBookingId: booking?.providerBookingId,
  //         AirlineCode: booking?.itinerary?.Sectors[0]?.AirlineCode || null,
  //         companyId: Authentication?.CompanyId || null,
  //         userId: Authentication?.UserId || null,
  //         traceId: null,
  //         PNR: booking?.PNR || null,
  //         fare: calculateFareAmount || 0,
  //         AirlineCancellationFee: 0,
  //         AirlineRefund: 0,
  //         ServiceFee: 0 || 0,
  //         RefundableAmt: 0 || 0,
  //         description: null,
  //         modifyBy: Authentication?.UserId || null,
  //         passenger:req.body.passengarList,
  //         modifyAt: new Date(),
  //       });

  //       await cancelationBookingInstance.save();
  //     }

  //     return {
  //       response: "Fetch Data Successfully",
  //       data: {
  //         BookingId: req.body.BookingId,
  //         CancelType: req.body.CancelType,
  //         PNR: req.body.PNR,
  //         Provider: req.body.Provider,
  //         Status: status,
  //       },
  //     };
  //   } catch (commonCancellationError) {
  //     return {
  //       response: commonCancellationError?.message || "Error in Cancellations",
  //       data: commonCancellationError,
  //     };
  //   }
  }
}
else{
  
        try {
          // return false;
        // const {Fare,AirlineCancellationFee,AirlineRefund,ServiceFee,RefundableAmt}=req.body.charge;

          const { result, error } = await commonAirBookingCancellation(req.body);
          if (error)
            return {
              response: "Cancellation Failed",
              data: {
                Status: "CANCELLATION FAILED",
                Error:
                  typeof error === "string"
                    ? error
                    : error?.message || "Internal Server Error",
              },
            };
    
          const status = result?.journey?.[0]?.status || "CANCELLATION FAILED";
          if (status === "CANCELLED") {
            const booking = await bookingDetails.findOneAndUpdate(
              {
                providerBookingId: req.body.BookingId,
              },
              { $set: { bookingStatus: "CANCELLATION PENDING" } },
              { new: true }
            );
    
            let calculateFareAmount = 0;
    
            for (let passenger of req.body.passengarList) {
              calculateFareAmount += calculateDealAmount(
                booking,
                passenger.PAX_TYPE
              );
              await updatePassengerStatus(booking, passenger, "CANCELLATION PENDING");
            }
            const cancelationBookingInstance = new CancelationBooking({
              calcelationStatus: "PENDING",
              bookingId: booking?.providerBookingId,
              providerBookingId: booking?.providerBookingId,
              AirlineCode: booking?.itinerary?.Sectors[0]?.AirlineCode || null,
              companyId: Authentication?.CompanyId || null,
              userId: Authentication?.UserId || null,
              traceId: null,
              PNR: booking?.PNR || null,
              fare:  booking?.bookingTotalAmount || 0,
              AirlineCancellationFee: 0,
              AirlineRefund: 0,
              ServiceFee:  0,
              RefundableAmt: 0,
              description: null,
              modifyBy: Authentication?.UserId || null,
              passenger:req.body.passengarList,
              modifyAt: new Date(),
            });
    
            await cancelationBookingInstance.save();
          }
    
          return {
            response: "Fetch Data Successfully",
            data: {
              BookingId: req.body.BookingId,
              CancelType: req.body.CancelType,
              PNR: req.body.PNR,
              Provider: req.body.Provider,
              Status: status,
            },
          };
        } catch (commonCancellationError) {
          return {
            response: commonCancellationError?.message || "Error in Cancellations",
            data: commonCancellationError,
          };
        }
  }
};

async function handleflight(
  req,
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
  const supplierData = await Supplier.find({
    companyId: CompanyId,
    credentialsType: CredentialType,
    status: true,
  }).populate({
    path: "supplierCodeId",
    select: "supplierCode",
  });

  const supplierCredentials = supplierData.filter(
    (supplier) => supplier.supplierCodeId?.supplierCode === Provider
  );
  if (!supplierCredentials || !supplierCredentials.length) {
    return {
      IsSucess: false,
      response: "Supplier credentials does not exist",
    };
  }

  const BookingIdDetails = await bookingDetails.findOne({
    providerBookingId: BookingId,
  });

  if (!BookingIdDetails) {
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
    supplierCredentials.map(async (supplier, index) => {
      try {
        if (!supplier?.supplierCodeId?.supplierCode) {
          throw new Error(`Invalid supplier structure at index ${index}`);
        }

        return await KafilaFun(
          req,
          Authentication,
          supplier,
          Provider,
          PNR,
          TravelType,
          BookingId,
          CancelType,
          Reason,
          Sector,
          agencyUserId,
          BookingIdDetails
        );
      } catch (error) {
        console.error(`Error for supplier at index ${index}:`, error.message);
      }
    })
  );

  return {
    IsSucess: true,
    response: responsesApi[0],
  };
}

const KafilaFun = async (
  req,
  Authentication,
  supplier,
  Provider,
  PNR,
  TravelType,
  BookingId,
  CancelType,
  Reason,
  Sector,
  agencyUserId,
  BookingIdDetails
) => {
  let createTokenUrl;
  let flightCancelUrl;

  let credentialType = "D";
  if (Authentication.CredentialType === "LIVE") {
    // Live Url here
    credentialType = "P";
    createTokenUrl = `${supplier.supplierLiveUrl}/api/Freport`;
    flightCancelUrl = `${supplier.supplierLiveUrl}/api/FCancel`;
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
    let response = null;
    let requestDataForCHarges = null;
    let fSearchApiResponse = null;
  
    // Step 1: Get token or prepare response based on provider
    if (Provider === "Kafila") {
      response = await axios.post(createTokenUrl, tokenData, {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      response = { data: { Status: "success" } };
      try{

      fSearchApiResponse = await commonAirBookingCancellationCharge(req.body, "FULL_CANCELLATION");
      }
      catch(e){
        throw e
      }
    }
  
    // Step 2: Check success and prepare cancel charge request if Kafila
    if (response.data.Status === "success") {
      if (Provider === "Kafila") {
        const getToken = response.data.Result;
  
        requestDataForCHarges = {
          P_TYPE: "API",
          R_TYPE: "FLIGHT",
          R_NAME: "CANCEL",
          R_DATA: {
            ACTION: "CANCEL_CHARGE",
            BOOKING_ID: BookingId,
            CANCEL_TYPE: "FULL_CANCELLATION",
            REASON: Reason,
            TRACE_ID: "",
          },
          AID: supplier.supplierWsapSesssion,
          MODULE: "B2B",
          IP: "182.73.146.154",
          TOKEN: supplier.supplierOfficeId,
          ENV: credentialType,
          Version: "1.0.0.0.0.0",
        };
  
        Logs({
          traceId: Authentication.TraceId,
          companyId: Authentication.CompanyId,
          userId: Authentication.UserId,
          source: "Kafila",
          type: "Portal log",
          BookingId,
          product: "Flight",
          logName: "CANCEL_CHARGE",
          request: requestDataForCHarges,
          responce: {},
        });
  
        fSearchApiResponse = await axios.post(flightCancelUrl, requestDataForCHarges, {
          headers: { "Content-Type": "application/json" },
        });
      }
  
      Logs({
        traceId: Authentication.TraceId,
        companyId: Authentication.CompanyId,
        userId: Authentication.UserId,
        source: "Kafila",
        type: "Portal log",
        BookingId,
        product: "Flight",
        logName: "CANCEL_CHARGE",
        request: requestDataForCHarges,
        responce: fSearchApiResponse?.data,
      });
  
      const status = fSearchApiResponse?.data?.Status;
      const isPending = status === "PENDING";
      const isFailed = ["Failed", "ERROR", "failed"].includes(status);
  
      // Step 3: Handle pending or failed status
      if (isPending || isFailed) {
        if (isPending) {
          const traceId =
            fSearchApiResponse?.data?.R_DATA?.TRACE_ID ||
            fSearchApiResponse?.data?.TRACE_ID || null;
  
          const cancelationBookingInstance = new CancelationBooking({
            calcelationStatus: status || null,
            bookingId: BookingId,
            providerBookingId: BookingId,
            AirlineCode: BookingIdDetails?.itinerary?.Sectors?.[0]?.AirlineCode || null,
            companyId: Authentication?.CompanyId || null,
            userId: Authentication?.UserId || null,
            traceId,
            PNR: BookingIdDetails?.PNR || null,
            fare: BookingIdDetails?.itinerary?.TotalPrice || null,
            AirlineCancellationFee: 0,
            AirlineRefund: 0,
            ServiceFee: 0,
            RefundableAmt: 0,
            description: fSearchApiResponse?.data?.WarningMessage || null,
            modifyBy: Authentication?.UserId,
            modifyAt: new Date(),
          });
  
          await cancelationBookingInstance.save();
  
          const bookingDeatails = await bookingDetails.findOneAndUpdate(
            { _id: BookingIdDetails._id },
            {
              $set: {
                bookingStatus: "CANCELLATION PENDING",
                cancelationDate: new Date(),
              },
            },
            { new: true }
          );
  
          await updateStatus(bookingDeatails, "CANCELLATION PENDING");
        }
  
        return `${fSearchApiResponse?.data?.ErrorMessage || ""} ${fSearchApiResponse?.data?.WarningMessage || ""}`;
      }
  
      // Step 4: Handle success scenario
      const getAgentConfig = await agentConfig.findOne({ userId: agencyUserId });
      const maxCreditLimit = getAgentConfig?.maxcreditLimit ?? 0;
  
      const tdsAmount = BookingIdDetails?.itinerary?.PriceBreakup?.reduce((total, item) => {
        const tds = item?.CommercialBreakup?.filter(c => c.CommercialType === "TDS") || [];
        return total + tds.reduce((sum, c) => sum + c.Amount, 0);
      }, 0) || 0;
  
      const departureTime = BookingIdDetails?.itinerary?.Sectors?.[0]?.Departure?.Date;
      const sixtyTwoHours = 96 * 60 * 60 * 1000;
      const currentTime = Date.now();
      const isWithinTime = departureTime && (currentTime - new Date(departureTime).getTime() <= sixtyTwoHours);
  
      // Ensure Charges object exists
      fSearchApiResponse.data.Charges = fSearchApiResponse.data.Charges || {};
      fSearchApiResponse.data.Charges.RefundableAmt =
        (fSearchApiResponse.data.Charges?.RefundableAmt || 0) - (!isWithinTime ? tdsAmount : 0);
      fSearchApiResponse.data.Charges.ServiceFee =
        fSearchApiResponse.data.Charges?.ServiceFee || 0;
      fSearchApiResponse.data.Charges.AirlineRefund =
        fSearchApiResponse.data.Charges?.AirlineRefund || 0;
      fSearchApiResponse.data.Charges.AirlineCancellationFee =
        fSearchApiResponse.data.Charges?.AirlineCancellationFee || 0;
  
      return fSearchApiResponse.data;
    } else {
      return response.data.ErrorMessage;
    }
  } catch (error) {
    Logs({
      traceId: Authentication.TraceId,
      companyId: Authentication.CompanyId,
      userId: Authentication.UserId,
      source: "Kafila",
      type: "Portal log",
      BookingId,
      product: "Flight",
      logName: "CANCEL_CHARGE",
      request: "catch error",
      responce: error,
    });
    return error.message;
  }
  
};
module.exports = {
  fullCancelationCharge,
};
