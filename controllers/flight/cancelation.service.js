const flightcommercial = require("./flight.commercial");
const Company = require("../../models/Company");
const Users = require("../../models/User");
const Supplier = require("../../models/Supplier");
const bookingDetails = require("../../models/booking/BookingDetails");
const CancelationBooking = require("../../models/booking/CancelationBooking");
const passengerPreferenceModel = require("../../models/booking/PassengerPreference");
const agentConfig = require("../../models/AgentConfig");
const Logs = require("../../controllers/logs/PortalApiLogsCommon");
const ledger = require("../../models/Ledger");
const axios = require("axios");
const uuid = require("uuid");
const NodeCache = require("node-cache");
const { ObjectId } = require("mongodb");
const crypto = require('crypto');

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
    providerBookingId
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
    "providerBookingId"
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
      agencyUserId,
      providerBookingId
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
  agencyUserId,
  providerBookingId
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

  const BookingIdDetails = await bookingDetails.findOne({
    providerBookingId: providerBookingId,
  });

  if (!BookingIdDetails) {
    return {
      IsSucess: false,
      response: "Booking Id does not exist",
    };
  }

  // if (!TraceId) {
  //   return {
  //     IsSucess: false,
  //     response: "Trace Id Required",
  //   };
  // }

  const responsesApi = await Promise.all(
    supplierCredentials.map(async (supplier) => {
      // console.log(supplier,"supplier11")
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
              BookingIdDetails,
              providerBookingId
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
  BookingIdDetails,
  providerBookingId
) => {
  let createTokenUrl;
  let flightCancelUrl;

  let credentialType = "D";
  // console.log(supplier,"supplier22");
  if (Authentication.CredentialType === "LIVE") {
    // Live Url here
    credentialType = "P";
    createTokenUrl = `${supplier.supplierLiveUrl}/api/Freport`;
    flightCancelUrl = `${supplier.supplierLiveUrl}/api/FCancel`;
  } else {
    // Test Url here
    createTokenUrl = `${supplier.supplierTestUrl}/api/Freport`;
    flightCancelUrl = `${supplier.supplierTestUrl}/api/FCancel`;
  }
  // console.log(flightCancelUrl,"flightCancelUrl1");
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

    console.log(response.data, 'tokennnn');
    if (response.data.Status === "success") {
      let getToken = response.data.Result;
      let requestDataForCHarges = {
        P_TYPE: "API",
        R_TYPE: "FLIGHT",
        R_NAME: "CANCEL",
        R_DATA: {
          ACTION: "CANCEL_CHARGE",
          BOOKING_ID: providerBookingId,
          CANCEL_TYPE: "FULL_CANCELLATION",
          REASON: Reason,
          TRACE_ID: "",
        },
        AID: supplier.supplierWsapSesssion,
        MODULE: "B2B",
        IP: "182.73.146.154",
        TOKEN: getToken,
        ENV: credentialType,
        Version: "1.0.0.0.0.0",
      };
      // console.log(requestDataForCHarges,"requestDataForCHarges requestDataForCHarges")
      let fSearchApiResponse = await axios.post(
        flightCancelUrl,
        requestDataForCHarges,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(fSearchApiResponse.data, "1API Responce")
      if (fSearchApiResponse.data.Status !== null) {
        return fSearchApiResponse.data.ErrorMessage + "-" + fSearchApiResponse.data.WarningMessage;
      }

      let requestDataForCancel = {
        P_TYPE: "API",
        R_TYPE: "FLIGHT",
        R_NAME: "CANCEL",
        R_DATA: {
          ACTION: "CANCEL_COMMIT",
          BOOKING_ID: providerBookingId,
          CANCEL_TYPE: "FULL_CANCELLATION",
          REASON: Reason,
          TRACE_ID: fSearchApiResponse?.data?.Req?.R_DATA?.TRACE_ID,
          Charges: fSearchApiResponse?.data?.Charges,
          Error: fSearchApiResponse?.data?.Error,
          Status: fSearchApiResponse?.data?.Status
        },
        AID: supplier.supplierWsapSesssion,
        MODULE: "B2B",
        IP: "182.73.146.154",
        TOKEN: getToken,
        ENV: credentialType,
        Version: "1.0.0.0.0.0"
      };
      // console.log(requestDataForCancel,"requestDataForCancel");
      let fCancelApiResponse = await axios.post(
        flightCancelUrl,
        requestDataForCancel,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(fCancelApiResponse?.data,"fCancelApiResponse data");
      let R_DATAofCancelApiResponse = fCancelApiResponse?.data?.R_DATA;
      let ResponseData;
      if(R_DATAofCancelApiResponse === undefined){
        ResponseData = fCancelApiResponse?.data;
      }else{
        ResponseData = fCancelApiResponse?.data?.R_DATA;
      }
      // console.log(ResponseData,"ResponseData data out");
      // console.log(fCancelApiResponse?.data?.R_DATA, "fCancelApiResponse data R_DATA");
      if (
        (ResponseData?.Status != null || ResponseData?.Status != null) &&
        ((ResponseData?.Status.toUpperCase() ===
        "PENDING" || ResponseData?.Status.toUpperCase() ===
          "PENDING") ||
          (ResponseData?.Status.toUpperCase() ===
          "FAILED" ||ResponseData?.Status.toUpperCase() ===
          "FAILED"))
      ) {
        // console.log(ResponseData,"fCancelApiResponse In");
        const cancelationBookingInstance = new CancelationBooking({
          calcelationStatus: ResponseData?.Status || null ,
          bookingId:BookingId,
          providerBookingId:providerBookingId,
          AirlineCode: requestDataForCancel.R_DATA?.Charges?.FlightCode || null ,
          companyId: Authentication?.CompanyId || null,
          userId: Authentication?.UserId || null,
          PNR: requestDataForCancel.R_DATA?.Charges?.Pnr || null,
          fare: requestDataForCancel.R_DATA?.Charges?.Fare || null ,
          AirlineCancellationFee:requestDataForCancel.R_DATA?.Charges
          ?.AirlineCancellationFee ? requestDataForCancel.R_DATA?.Charges
          ?.AirlineCancellationFee : 0,
          AirlineRefund: requestDataForCancel.R_DATA?.Charges?.AirlineRefund ? requestDataForCancel.R_DATA?.Charges?.AirlineRefund : 0,
          ServiceFee: requestDataForCancel.R_DATA?.Charges?.ServiceFee || null,
          RefundableAmt: requestDataForCancel.R_DATA?.Charges?.RefundableAmt || null,
          description:requestDataForCancel.R_DATA?.Charges?.Description || null,
          modifyBy: Authentication?.UserId || null,
          modifyAt: new Date(),
        });

        await cancelationBookingInstance.save();

        if(ResponseData?.Status != null && ResponseData?.Status.toUpperCase() ===
        "PENDING"){
          await bookingDetails.findOneAndUpdate(
            { _id: BookingIdDetails._id },
            { $set: { bookingStatus: "CANCELLATION PENDING" } },
            { new: true } // To return the updated document
          );
        }
        return fCancelApiResponse?.data;
      } else if (
        ResponseData?.Status === null &&
        ResponseData?.Charges?.IsCanceled === true
      ) {
        console.log(agencyUserId,"agencyUserId agencyUserId")
        const getAgentConfig = await agentConfig.findOne({
          userId: agencyUserId,
        });
        // console.log(getAgentConfig,"getAgentConfig12");
        // console.log(getAgentConfig?.maxcreditLimit,"getAgentConfigmaxcreditLimit");
        let maxCreditLimit = 0;
        if(getAgentConfig?.maxcreditLimit){
          maxCreditLimit = Math.floor(getAgentConfig?.maxcreditLimit) ?? 0;
        }
        // console.log(ResponseData,"fCancelApiResponse else if");
        // console.log(maxCreditLimit,"maxCreditLimit");
        // console.log(BookingIdDetails,"BookingIdDetails BookingIdDetails");
        let newBalance = 0;
        let pricecheck = 0;
        if (BookingIdDetails && BookingIdDetails?.fareRules && BookingIdDetails?.fareRules != null) {
          if (BookingIdDetails?.itinerary?.Sectors[0]?.Departure?.Date) {
            // Convert createdAt to milliseconds
            const createdAtTime = new Date(BookingIdDetails?.itinerary?.Sectors[0]?.Departure?.Date).getTime();
            // Current time in milliseconds
            const currentTime = new Date().getTime();
            // Difference in milliseconds between current time and createdAt time
            const timeDifference = currentTime - createdAtTime;
            // Convert 62 hours to milliseconds
            const sixtyTwoHoursInMilliseconds = 96 * 60 * 60 * 1000;

            // Checking if the difference is less than 62 hours
            if (timeDifference <= sixtyTwoHoursInMilliseconds) {
              let tdsAmount = 0;
              BookingIdDetails.itinerary.PriceBreakup.forEach(item => {
                if (item) {
                  const tdsItems = item.CommercialBreakup.filter(commercial => commercial.CommercialType === "TDS");
                  tdsAmount += tdsItems.reduce((total, commercial) => total + commercial.Amount, 0);
                }
              });
              pricecheck = BookingIdDetails?.fareRules?.CBHA === 0 || BookingIdDetails?.fareRules == null ?
              ResponseData?.Charges?.RefundableAmt : ((BookingIdDetails.bookingTotalAmount || 0) - (BookingIdDetails?.fareRules !=null ? BookingIdDetails?.fareRules?.CBHA : 0 + BookingIdDetails?.fareRules !=null ? BookingIdDetails?.fareRules?.SF : 0 + (tdsAmount || 0)));
              // console.log(pricecheck,"pricecheck1");
              if(!isNaN(pricecheck)){
                pricecheck = pricecheck;
              }else{
                pricecheck = 0;
              }
              newBalance = maxCreditLimit + pricecheck;
            } else {
              let tdsAmount = 0;
              BookingIdDetails.itinerary.PriceBreakup.forEach(item => {
                if (item) {
                  const tdsItems = item.CommercialBreakup.filter(commercial => commercial.CommercialType === "TDS");
                  tdsAmount += tdsItems.reduce((total, commercial) => total + commercial.Amount, 0);
                }
              });
              pricecheck = BookingIdDetails?.fareRules?.CBHA === 0 || BookingIdDetails?.fareRules == null ?
              ResponseData?.Charges?.RefundableAmt : ((BookingIdDetails.bookingTotalAmount || 0) - (BookingIdDetails?.fareRules !=null ? BookingIdDetails?.fareRules?.CBHA : 0 + BookingIdDetails?.fareRules !=null ? BookingIdDetails?.fareRules?.SF : 0 + (tdsAmount || 0)));
              // pricecheck = BookingIdDetails?.fareRules?.CWBHA === 0 ?
              // ResponseData?.Charges?.RefundableAmt : ((BookingIdDetails.bookingTotalAmount || 0) - (BookingIdDetails?.fareRules?.CWBHA + BookingIdDetails?.fareRules?.SF + (tdsAmount || 0)));
              // console.log(pricecheck,"pricecheck2");
              if(!isNaN(pricecheck)){
                pricecheck = pricecheck;
              }else{
                pricecheck = 0;
              }
              newBalance = maxCreditLimit + pricecheck;
            }
          }
        } else {
          let tdsAmount = 0;
          BookingIdDetails.itinerary.PriceBreakup.forEach(item => {
            if (item) {
              const tdsItems = item.CommercialBreakup.filter(commercial => commercial.CommercialType === "TDS");
              tdsAmount += tdsItems.reduce((total, commercial) => total + commercial.Amount, 0);
            }
          });
          // console.log(tdsAmount,"tdsAmount1");
          newBalance =
            maxCreditLimit +
            (ResponseData?.Charges?.RefundableAmt - tdsAmount || 0);
          pricecheck = ResponseData?.Charges?.RefundableAmt - (tdsAmount || 0);
          // console.log(pricecheck,"pricecheck3");
          if(!isNaN(pricecheck)){
            pricecheck = pricecheck;
          }else{
            pricecheck = 0;
          }
        }
        console.log(newBalance,"newBalance");
        if (!isNaN(newBalance)) {
          newBalance = newBalance;
        }else{
          newBalance = 0;
        }
        await agentConfig.updateOne(
          { userId: agencyUserId },
          { maxcreditLimit: newBalance }
        );
        const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation

        // Create ledger entry
        await ledger.create({
          userId: agencyUserId,
          companyId: Authentication?.CompanyId,
          ledgerId: ledgerId,
          cartId: BookingIdDetails?.bookingId,
          transactionAmount: pricecheck,
          currencyType: "INR",
          fop: "DEBIT",
          transactionType: "DEBIT",
          runningAmount: newBalance,
          remarks: "Calcelation Amount Added Into Your Account.",
          transactionBy: Authentication?.UserId,
        });

        const passengerPreference = await passengerPreferenceModel.findOne({
          bookingId: BookingIdDetails.bookingId,
        });

        for (const passenger of passengerPreference?.Passengers) {
          if (!passenger?.ticketStatus) {
            passenger.ticketStatus = [];
          }
          const existingTicketStatusIndex =
            passenger?.ticketStatus?.findIndex(
              (status) => status.status != "CANCELLED"
            );
          if (existingTicketStatusIndex !== -1) {
            // If object already exists, update its status
            passenger.ticketStatus[existingTicketStatusIndex].status =
              "CANCELLED";
          } else {
            // If object does not exist, push a new object into the array
            passenger?.ticketStatus?.push({
              Src: "",
              Des: "",
              status: "CANCELLED",
            });
          }
        }
        await passengerPreference.save();

        await bookingDetails.findOneAndUpdate(
          { _id: BookingIdDetails._id },
          { $set: { bookingStatus: "CANCELLED" } },
          { new: true } // To return the updated document
        );


        const cancelationBookingInstance = new CancelationBooking({
          calcelationStatus:ResponseData?.Status == null && ResponseData?.Charges?.IsCanceled == true ? "CANCEL":  ResponseData?.Status,
          bookingId:BookingId,
          providerBookingId:providerBookingId,
          AirlineCode:
          ResponseData?.Charges?.FlightCode || null,
          companyId: Authentication?.CompanyId || null,
          userId: Authentication?.UserId || null,
          PNR: ResponseData?.Charges?.Pnr || null,
          fare: ResponseData?.Charges?.Fare || null,
          AirlineCancellationFee:
          ResponseData?.Charges
              ?.AirlineCancellationFee || null,
          AirlineRefund:
          ResponseData?.Charges?.AirlineRefund || null,
          ServiceFee:
          ResponseData?.Charges?.ServiceFee || null,
          RefundableAmt:
            pricecheck || null,
          description:
          ResponseData?.Charges?.Description || null,
          modifyBy: Authentication?.UserId || null,
          modifyAt: new Date(),
        });
        await cancelationBookingInstance.save();
        // console.log("jksjskj jdjsjdsjkj ")
        return fCancelApiResponse?.data;
      } else {
        const cancelationBookingInstance = new CancelationBooking({
          calcelationStatus:
          ResponseData?.Error?.Status ? ResponseData?.Error?.Status : requestDataForCancel.R_DATA.Error.Status ?  requestDataForCancel.R_DATA.Error.Status : null ,
          bookingId:BookingId,
          providerBookingId:providerBookingId,
          AirlineCode:
          ResponseData?.Charges?.FlightCode ? ResponseData?.Charges?.FlightCode : requestDataForCancel.R_DATA?.Charges?.FlightCode ? requestDataForCancel.R_DATA?.Charges?.FlightCode : null ,
          companyId: Authentication?.CompanyId || null,
          userId: Authentication?.UserId || null,
          PNR: ResponseData?.Charges?.Pnr ? ResponseData?.Charges?.Pnr : requestDataForCancel.R_DATA?.Charges?.Pnr ? requestDataForCancel.R_DATA?.Charges?.Pnr : null,
          fare: ResponseData?.Charges?.Fare ? ResponseData?.Charges?.Fare : requestDataForCancel.R_DATA?.Charges?.Fare ,
          AirlineCancellationFee:ResponseData?.Charges?.AirlineCancellationFee ? ResponseData?.Charges
          ?.AirlineCancellationFee: requestDataForCancel.R_DATA?.Charges
          ?.AirlineCancellationFee,
          AirlineRefund: ResponseData?.Charges?.AirlineRefund ? ResponseData?.Charges?.AirlineRefund : requestDataForCancel.R_DATA?.Charges?.AirlineRefund,
          ServiceFee: ResponseData?.Charges?.ServiceFee ? ResponseData?.Charges?.ServiceFee : requestDataForCancel.R_DATA?.Charges?.ServiceFee,
          RefundableAmt:ResponseData?.Charges?.RefundableAmt ? ResponseData?.Charges?.RefundableAmt : requestDataForCancel.R_DATA?.Charges?.RefundableAmt,
          description:ResponseData?.Charges?.Description ? ResponseData?.Charges?.Description : requestDataForCancel.R_DATA?.Charges?.Description,
          modifyBy: Authentication?.UserId || null,
          modifyAt: new Date(),
        });
        await cancelationBookingInstance.save();
        return fCancelApiResponse?.data;
      }

    } else {
      return response.data.ErrorMessage;
    }
  } catch (error) {
    return error.message;
  }
};

const updateBookingStatus = async (req, res) => {
  const { _BookingId, credentialsType } = req.body;
  if (!_BookingId.length) {
    return { response: "_BookingId or companyId or credentialsType does not exist" }
  }
  if (!["LIVE", "TEST"].includes(credentialsType)) {
    return {
      IsSucess: false,
      response: "Credential Type does not exist",
    };
  }
  const objectIdArray = _BookingId.map(id => new ObjectId(id));
  const getBookingbyBookingId = await bookingDetails.aggregate([{ $match: { _id: { $in: objectIdArray } } }, {
    $lookup: {
      from: "suppliercodes",
      localField: "provider",
      foreignField: "supplierCode",
      as: "supplierData",
    },
  }, { $unwind: "$supplierData" }, {
    $lookup: {
      from: "suppliers",
      localField: "supplierData._id",
      foreignField: "supplierCodeId",
      as: "supplyData",
    },
  }, {
    $project: {
      providerBookingId: 1,
      bookingId: 1,
      "itinerary.TraceId": 1,
      credentialsTypeData: {
        $filter: {
          input: "$supplyData",
          as: "item",
          cond: {
            $and: [
              { $eq: ["$$item.credentialsType", credentialsType] },
              { $eq: ["$$item.status", true] }
            ]
          }
        }
      }
    }
  }, { $unwind: "$credentialsTypeData" }, {
    $project: {
      providerBookingId: 1,
      bookingId:1,
      traceId: "$itinerary.TraceId",
      supplierUserId: "$credentialsTypeData.supplierUserId",
      supplierPassword: "$credentialsTypeData.supplierPassword",
      supplierWsapSesssion: "$credentialsTypeData.supplierWsapSesssion",
      credentialsTypeData:1
    }
  }]);

  if (!getBookingbyBookingId.length) {
    return {
      response: "No booking Found!"
    }
  }
  let supplier = getBookingbyBookingId[0].credentialsTypeData;
  let supplierLiveUrl =  "";
  let supplierTestUrl = "";
  if(supplier){
    supplierLiveUrl = supplier.supplierLiveUrl;
    supplierTestUrl = supplier.supplierTestUrl;
  }else{
    supplierLiveUrl = "http://fhapip.ksofttechnology.com";
    supplierTestUrl = "http://stage1.ksofttechnology.com";
  }
  let createTokenUrl;
  let credentialEnv = "D";
  if (credentialsType === "LIVE") {
    credentialEnv = "P";
    createTokenUrl = `${supplierLiveUrl}/api/Freport`; // Live Url here
  } else {
    createTokenUrl = `${supplierTestUrl}/api/Freport`; // Test Url here
  }

  const bulkOps = [];
  for (const item of getBookingbyBookingId) {
    const concatenatedString = ((`${item.supplierUserId}|${item.supplierPassword}`).toUpperCase());
    let postData = {
      P_TYPE: "API",
      R_TYPE: "FLIGHT",
      R_NAME: "FlightBookingResponse",
      R_DATA: {
        TYPE: "PNRRES",
        BOOKING_ID: item.providerBookingId,
        TRACE_ID: item.traceId
      },
      AID: item.supplierWsapSesssion,
      MODULE: "B2B",
      IP: "182.73.146.154",
      TOKEN: crypto.createHash('md5').update(concatenatedString).digest('hex'),
      ENV: credentialEnv,
      Version: "1.0.0.0.0.0"
    };
    // console.log(createTokenUrl,"createTokenUrl");
    // console.log(postData,"postDatapostData");
    const response = (await axios.post(createTokenUrl, postData, {
      headers: {
        'Content-Type': 'application/json'
      }
    }))?.data;

      const getpassengersPrefrence = await passengerPreferenceModel.findOne({ bookingId: item?.bookingId });
      // console.log(response,"responseresponseresponse");
      if (getpassengersPrefrence && getpassengersPrefrence.Passengers) {
        await Promise.all(getpassengersPrefrence.Passengers.map(async (passenger) => {
          const apiPassenger = response.PaxInfo.Passengers.find(p => p.FName === passenger.FName && p.LName === passenger.LName);
          if (apiPassenger) {
            const ticketUpdate = passenger.Optional.ticketDetails.find(p => p.src === fSearchApiResponse.data.Param.Sector[0].Src && p.des === fSearchApiResponse.data.Param.Sector[0].Des);
                      if(ticketUpdate){
                        ticketUpdate.ticketNumber = apiPassenger?.Optional?.TicketNumber;
                      }
            //passenger.Optional.TicketNumber = apiPassenger.Optional.TicketNumber;
            // passenger.Status = "CONFIRMED";
          }
        }));

        await getpassengersPrefrence.save();
      }



    // return {
    //   response: "Status updated Successfully!",
    //   data:response
    // }
    // console.log(response);


    bulkOps.push({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { 
          bookingStatus: response?.BookingInfo?.CurrentStatus,
          APnr: response?.BookingInfo?.APnr,
          GPnr:  response?.BookingInfo?.GPnr,
          PNR: response?.BookingInfo?.APnr,
         } }
      }
    });
  }
  if (bulkOps.length) {
    await bookingDetails.bulkWrite(bulkOps);
    return {
      response: "Status updated Successfully!"
    }
  } else {
    return {
      response: "Error in updating Status!"
    }
  }
}

module.exports = {
  fullCancelation, updateBookingStatus
};
