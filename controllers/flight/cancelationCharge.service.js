const flightcommercial = require("./flight.commercial");
const Company = require("../../models/Company");
const Users = require("../../models/User");
const Supplier = require("../../models/Supplier");
const agentConfig = require("../../models/AgentConfig");
const bookingDetails = require("../../models/booking/BookingDetails");
const CancelationBooking = require("../../models/booking/CancelationBooking");
const Logs = require("../../controllers/logs/PortalApiLogsCommon");
const axios = require("axios");
const uuid = require("uuid");
const passengerPreferenceModel = require("../../models/booking/PassengerPreference");
const NodeCache = require("node-cache");
const {
  commonAirBookingCancellation,
} = require("../../services/common-air-cancellation");
const BookingDetails = require("../../models/booking/BookingDetails");
const PassengerPreference = require("../../models/booking/PassengerPreference");
const flightCache = new NodeCache();
const {calculateDealAmount}=require("./partialCalcelationCharge.service")

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
  if(Provider.toLowerCase() === "kafila"){
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
    }
  } else {
    try {
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
        
        
        const booking = await BookingDetails.findOneAndUpdate(
          {
            providerBookingId: req.body.BookingId,
          },
          { $set:{bookingStatus: "CANCELLED" }},
          {new:true}
        );
        let calculateFareAmount=0
        for(let passengers of req.body.passengarList){
          calculateFareAmount+=calculateDealAmount(booking,passengers.PAX_TYPE)
          await passengerPreferenceModel.findOneAndUpdate(
                     {
                      bid:booking?._id,
                       "Passengers.FName": passengers.FNAME,
                       "Passengers.LName": passengers.LNAME
                     },
                     {
                       $set: { "Passengers.$.Status": "CANCELLED" }
                     },
                     {new:true}
                   );
       }
          const cancelationBookingInstance = new CancelationBooking({
            calcelationStatus: "CANCEL",
            bookingId: booking?.providerBookingId,
            providerBookingId: booking?.providerBookingId,
            AirlineCode:
              booking?.itinerary?.Sectors[0]?.AirlineCode || null,
            companyId: Authentication?.CompanyId || null,
            userId: Authentication?.UserId || null,
            traceId:null,
            PNR: booking?.PNR || null,
            fare: calculateFareAmount || 0,
            AirlineCancellationFee: 0,
            AirlineRefund: 0,
            ServiceFee: 0 || 0,
            RefundableAmt: 0 || 0,
            description: null,
            modifyBy: Authentication?.UserId || null,
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
  })
    .populate({
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

        supplier.supplierCodeId.supplierCode = "Kafila";
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
              Reason,
              Sector,
              agencyUserId,
              BookingIdDetails
            );
          default:
            throw new Error(
              `Unsupported supplier: ${supplier.supplierCodeId.supplierCode}`
            );
        }
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
    let response = await axios.post(createTokenUrl, tokenData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.Status === "success") {
      let getToken = response.data.Result;
      let requestDataForCHarges = {
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

      let fSearchApiResponse = await axios.post(
        flightCancelUrl,
        requestDataForCHarges,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(fSearchApiResponse, "fSearchApiResponse");
      if (
        (fSearchApiResponse?.data?.Status !== null &&
          fSearchApiResponse?.data?.Status === "PENDING") ||
        fSearchApiResponse?.data?.Status === "Failed" ||
        fSearchApiResponse?.data?.Status === "ERROR" ||
        fSearchApiResponse?.data?.Status === "failed"
      ) {
        if (
          fSearchApiResponse?.data?.Status != null &&
          fSearchApiResponse?.data?.Status === "PENDING"
        ) {
          const cancelationBookingInstance = new CancelationBooking({
            calcelationStatus: fSearchApiResponse.data.Status || null,
            bookingId: BookingId,
            providerBookingId: BookingId,
            AirlineCode:
              BookingIdDetails?.itinerary?.Sectors[0]?.AirlineCode || null,
            companyId: Authentication?.CompanyId || null,
            userId: Authentication?.UserId || null,
            traceId:
              fSearchApiResponse.data.R_DATA?.TRACE_ID ||
              fSearchApiResponse.data.TRACE_ID ||
              null,
            PNR: BookingIdDetails?.PNR || null,
            fare: BookingIdDetails?.itinerary?.TotalPrice || null,
            AirlineCancellationFee: 0,
            AirlineRefund: 0,
            ServiceFee: 0 || 0,
            RefundableAmt: 0 || 0,
            description: fSearchApiResponse.data.WarningMessage || null,
            modifyBy: Authentication?.UserId || null,
            modifyAt: new Date(),
          });

          await cancelationBookingInstance.save();
          await bookingDetails.findOneAndUpdate(
            { _id: BookingIdDetails._id },
            { $set: { bookingStatus: "CANCELLATION PENDING" } },
            { new: true } // To return the updated document
          );
          await passengerPreferenceModel.updateOne(
            { bookingId: BookingIdDetails.bookingId },
            {
              $set: { "Passengers.$[].Status": "CANCELLATION PENDING" },
            }
          );
        }
        return (
          fSearchApiResponse?.data?.ErrorMessage +
          " " +
          fSearchApiResponse?.data?.WarningMessage
        );
      }

      const getAgentConfig = await agentConfig.findOne({
        userId: agencyUserId,
      });

      const maxCreditLimit = getAgentConfig?.maxcreditLimit ?? 0;
      let newBalance = 0;
      let pricecheck = 0;
      if (
        BookingIdDetails &&
        BookingIdDetails?.fareRules &&
        BookingIdDetails?.fareRules != null
      ) {
        if (BookingIdDetails?.itinerary?.Sectors[0]?.Departure?.Date) {
          // Convert createdAt to milliseconds
          const createdAtTime = new Date(
            BookingIdDetails?.itinerary?.Sectors[0]?.Departure?.Date
          ).getTime();
          // Current time in milliseconds
          const currentTime = new Date().getTime();
          // Difference in milliseconds between current time and createdAt time
          const timeDifference = currentTime - createdAtTime;
          // Convert 62 hours to milliseconds
          const sixtyTwoHoursInMilliseconds = 96 * 60 * 60 * 1000;

          // Checking if the difference is less than 62 hours
          if (timeDifference <= sixtyTwoHoursInMilliseconds) {
            let tdsAmount = 0;
            BookingIdDetails.itinerary.PriceBreakup.forEach((item) => {
              if (item) {
                const tdsItems = item.CommercialBreakup.filter(
                  (commercial) => commercial.CommercialType === "TDS"
                );
                tdsAmount += tdsItems.reduce(
                  (total, commercial) => total + commercial.Amount,
                  0
                );
              }
            });
            //pricecheck = BookingIdDetails?.fareRules?.CWBHA === 0 ?
            // fCancelApiResponse?.data?.R_DATA?.Charges?.RefundableAmt : (BookingIdDetails?.fareRules?.CWBHA + BookingIdDetails?.fareRules?.SF) ;
            //  newBalance = maxCreditLimit + pricecheck;\
            fSearchApiResponse.data = fSearchApiResponse.data || {};
            fSearchApiResponse.data.Charges =
              fSearchApiResponse.data.Charges || {};

            fSearchApiResponse.data.Charges.RefundableAmt =
              fSearchApiResponse.data.Charges?.RefundableAmt || 0;
            fSearchApiResponse.data.Charges.ServiceFee =
              fSearchApiResponse.data.Charges?.ServiceFee || 0;
            fSearchApiResponse.data.Charges.AirlineRefund =
              fSearchApiResponse.data.Charges?.AirlineRefund || 0;
            fSearchApiResponse.data.Charges.AirlineCancellationFee =
              fSearchApiResponse.data.Charges?.AirlineCancellationFee || 0;
            //fSearchApiResponse.data.Charges.Fare = 0;
            return fSearchApiResponse.data;
          } else {
            let tdsAmount = 0;
            BookingIdDetails.itinerary.PriceBreakup.forEach((item) => {
              if (item) {
                const tdsItems = item.CommercialBreakup.filter(
                  (commercial) => commercial.CommercialType === "TDS"
                );
                tdsAmount += tdsItems.reduce(
                  (total, commercial) => total + commercial.Amount,
                  0
                );
              }
            });
            fSearchApiResponse.data = fSearchApiResponse.data || {};
            fSearchApiResponse.data.Charges =
              fSearchApiResponse.data.Charges || {};

            fSearchApiResponse.data.Charges.RefundableAmt =
              fSearchApiResponse.data.Charges?.RefundableAmt || 0;
            fSearchApiResponse.data.Charges.ServiceFee =
              fSearchApiResponse.data.Charges?.ServiceFee || 0;
            fSearchApiResponse.data.Charges.AirlineRefund =
              fSearchApiResponse.data.Charges?.AirlineRefund || 0;
            fSearchApiResponse.data.Charges.AirlineCancellationFee =
              fSearchApiResponse.data.Charges?.AirlineCancellationFee || 0;
            //fSearchApiResponse.data.Charges.Fare = 0;
            return fSearchApiResponse.data;

            //  pricecheck = BookingIdDetails?.fareRules?.CBHA === 0 ?
            // fCancelApiResponse?.data?.R_DATA?.Charges?.RefundableAmt : (BookingIdDetails?.fareRules?.CBHA +  BookingIdDetails?.fareRules?.SF);
            // newBalance = maxCreditLimit + pricecheck;
          }
        }
      } else {
        let tdsAmount = 0;
        BookingIdDetails.itinerary.PriceBreakup.forEach((item) => {
          if (item) {
            const tdsItems = item.CommercialBreakup.filter(
              (commercial) => commercial.CommercialType === "TDS"
            );
            tdsAmount += tdsItems.reduce(
              (total, commercial) => total + commercial.Amount,
              0
            );
          }
        });

        fSearchApiResponse.data = fSearchApiResponse.data || {};
        fSearchApiResponse.data.Charges = fSearchApiResponse.data.Charges || {};
        fSearchApiResponse.data.Charges.RefundableAmt =
          (fSearchApiResponse.data.Charges.RefundableAmt || 0) - tdsAmount;
        return fSearchApiResponse.data;
        // newBalance =
        // maxCreditLimit +
        // fCancelApiResponse?.data?.R_DATA?.Charges?.RefundableAmt;
        // pricecheck = fCancelApiResponse?.data?.R_DATA?.Charges?.RefundableAmt;
      }
    } else {
      return response.data.ErrorMessage;
    }
  } catch (error) {
    return error.message;
  }
};
module.exports = {
  fullCancelationCharge,

};
