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
const moment=require('moment')
const {holdBookingProcessPayment}=require('../../services/common-pnrTicket-service')
const {RefundedCommonFunction,getPnr1APnedingStatus,getPnrDataCommonMethod,commonProviderMethodDate,updateStatus}=require('../../controllers/commonFunctions/common.function')
const {updateBarcode2DByBookingId}=require('./airBooking.service')

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
        supplier.supplierCodeId.supplierCode="Kafila"
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
    response:responsesApi[0],
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
      console.log(requestDataForCHarges,"requestDataForCHarges requestDataForCHarges")
      let fSearchApiResponse = await axios.post(
        flightCancelUrl,
        requestDataForCHarges,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(fSearchApiResponse.data, "1API Responce")
      if (fSearchApiResponse.data.Status !== null) {
        console.log('sdhf')
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
        TOKEN: supplier.supplierOfficeId,
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
      console.log(fCancelApiResponse?.data,"ded")
      let ResponseData;
      if(R_DATAofCancelApiResponse === undefined){
        ResponseData = fCancelApiResponse?.data;
        console.log(ResponseData,"ddd")
      }else{
        ResponseData = fCancelApiResponse?.data?.R_DATA;
      }
      // console.log(ResponseData,"ResponseData data out");
      // console.log(fCancelApiResponse?.data?.R_DATA, "fCancelApiResponse data R_DATA");
      if (
        ResponseData?.Status == null ||
        ((ResponseData?.Status.toUpperCase() ===
        "PENDING" || ResponseData?.Status.toUpperCase() ===
          "PENDING") ||
          (ResponseData?.Status.toUpperCase() ===
          "FAILED" ||ResponseData?.Status.toUpperCase() ===
          "FAILED"))
      ) {
        // console.log(ResponseData,"fCancelApiResponse In");
        await cancelationDataUpdate(Authentication,fCancelApiResponse,BookingIdDetails)
let booking=null
        if(ResponseData?.Status == null || ResponseData?.Status.toUpperCase() ===
        "PENDING"||ResponseData?.Status.toUpperCase() ===
        "FAILED"){
       booking =   await bookingDetails.findOneAndUpdate(
            { _id: BookingIdDetails._id },
            { $set: { bookingStatus: "CANCELLATION PENDING",
              cancelationDate: Date.now(),
             } },
            { new: true } // To return the updated document
          );
        }
        await updateStatus(booking,"CANCELLATION PENDING")
        await cancelationDataUpdate(Authentication,fCancelApiResponse,BookingIdDetails)
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
            maxCreditLimit +ResponseData?.Charges?.RefundableAmt;
            // (ResponseData?.Charges?.RefundableAmt - tdsAmount || 0);
          pricecheck = ResponseData?.Charges?.RefundableAmt - (tdsAmount || 0);
          console.log(pricecheck,"pricecheck3");
          if(!isNaN(pricecheck)){
            pricecheck = pricecheck;
          }else{
            pricecheck = 0;
          }
        }
        // console.log(ResponseData?.Charges?.RefundableAmt,"refundable amount")
        // console.log(newBalance,"newBalance");
        if (!isNaN(newBalance)) {
          newBalance = newBalance;
        }else{
          newBalance = 0;
        }
        await agentConfig.updateOne(
          { userId: agencyUserId },
        );
        const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation

        // Create ledger entry
        // await ledger.create({
        //   userId: agencyUserId,
        //   companyId: Authentication?.CompanyId,
        //   ledgerId: ledgerId,
        //   cartId: BookingIdDetails?.bookingId,
        //   transactionAmount: ResponseData?.Charges?.RefundableAmt,
        //   currencyType: "INR",
        //   fop: "DEBIT",
        //   transactionType: "CREDIT",
        //   runningAmount:newBalance+ResponseData?.Charges?.RefundableAmt,
        //   remarks: "Cancelation amount added into your account.",
        //   transactionBy: Authentication?.UserId,
        // });
      let booking = await bookingDetails.findOneAndUpdate(
          { _id: BookingIdDetails._id },
          { $set: { bookingStatus: "CANCELLED" } },
          { new: true } // To return the updated document
        );

        const passengerPreference = await passengerPreferenceModel.findOne({
          bookingId: BookingIdDetails.bookingId,
        });

        for (const passenger of passengerPreference?.Passengers) {
          
          if (!passenger?.ticketStatus) {
            passenger.ticketStatus = [];
          }

          if(passenger){
            await updateStatus(booking,"CANCELLED")
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

        

        

        await cancelationDataUpdate(Authentication,fCancelApiResponse,BookingIdDetails)
        // console.log("jksjskj jdjsjdsjkj ")
        return fCancelApiResponse?.data;
      } else {
        await cancelationDataUpdate(Authentication,fCancelApiResponse,BookingIdDetails)
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
  try {
    const { _BookingId, credentialsType, Authentication } = req.body;
    
    // Validation: _BookingId aur credentialsType check karna
    if (!_BookingId || !_BookingId.length) {
      return { response: "_BookingId or companyId or credentialsType does not exist" };
    }
    if (!["LIVE", "TEST"].includes(credentialsType)) {
      return { IsSuccess: false, response: "Credential Type does not exist" };
    }
    
    // Convert _BookingId array ke sabhi id ko ObjectId me convert karo
    const objectIdArray = _BookingId.map(id => new ObjectId(id));
    
    // Aggregate query se booking details fetch karna with supplier details
    const getBookingbyBookingId = await bookingDetails.aggregate([
      { $match: { _id: { $in: objectIdArray } } },
      {
        $lookup: {
          from: "suppliercodes",
          localField: "provider",
          foreignField: "supplierCode",
          as: "supplierData"
        }
      },
      { $unwind: "$supplierData" },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplierData._id",
          foreignField: "supplierCodeId",
          as: "supplyData"
        }
      },
      {
        $project: {
          providerBookingId: 1,
          bookingId: 1,
          provider:1,
          itinerary:1,
          // "itinerary.TraceId": 1,
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
      },
      { $unwind: "$credentialsTypeData" },
      {
        $project: {
          providerBookingId: 1,
          bookingId: 1,
          traceId: "$itinerary.TraceId",
          supplierUserId: "$credentialsTypeData.supplierUserId",
          supplierPassword: "$credentialsTypeData.supplierPassword",
          supplierWsapSesssion: "$credentialsTypeData.supplierWsapSesssion",
          supplierOfficeId:"$credentialsTypeData.supplierOfficeId",
          itinerary:1,
          credentialsTypeData: 1,
          provider: 1,       // Yeh assume kiya gaya hai ki bookingDetails me yeh field hai
          createdAt: 1
        }
      }
    ]);
    
    if (!getBookingbyBookingId || !getBookingbyBookingId.length) {
      return { response: "No booking Found!" };
    }
    
    // Supplier URLs determine karna
    let supplier = getBookingbyBookingId[0].credentialsTypeData;
    let supplierLiveUrl = supplier ? supplier.supplierLiveUrl : "http://fhapip.ksofttechnology.com";
    let supplierTestUrl = supplier ? supplier.supplierTestUrl : "http://stage1.ksofttechnology.com";
    let createTokenUrl;
    let credentialEnv = "D";
    if (credentialsType === "LIVE") {
      credentialEnv = "P";
      createTokenUrl = `${supplierLiveUrl}/api/Freport`; // Live URL
    } else {
      createTokenUrl = `${supplierTestUrl}/api/Freport`; // Test URL
    }
    
    const bulkOps = [];
    
    // Loop har ek booking item par
    for (const item of getBookingbyBookingId) {
      let apiResponse; // response jo common provider se milegi
      if(item.provider.toUpperCase()==="KAFILA") {
        // Common provider flow
        const concatenatedString = (`${item.supplierUserId}|${item.supplierPassword}`).toUpperCase();
        const postData = {
          P_TYPE: "API",
          R_TYPE: "FLIGHT",
          R_NAME: "FlightBookingResponse",
          R_DATA: {
            TYPE: "PNRRES",
            BOOKING_ID: "",
            TRACE_ID: item.traceId
          },
          AID: item.supplierWsapSesssion,
          MODULE: "B2B",
          IP: "182.73.146.154",
          TOKEN:item?.supplierOfficeId,
          ENV: credentialEnv,
          Version: "1.0.0.0.0.0"
        };
        
        // Axios POST call to createTokenUrl (single call)
        const axiosResp = await axios.post(createTokenUrl, postData, {
          headers: { "Content-Type": "application/json" }
        });
        apiResponse = axiosResp.data;
        
        // Update passenger preferences using API response
        const getPassengersPreference = await passengerPreferenceModel.findOne({ bookingId: item.bookingId });
        if (getPassengersPreference && getPassengersPreference.Passengers) {
          await Promise.all(
            getPassengersPreference.Passengers.map(async (passenger) => {
              // Matching passenger based on FName and LName
              const apiPassenger = apiResponse.PaxInfo.Passengers.find(
                p => p.FName === passenger.FName && p.LName === passenger.LName
              );
              if (apiPassenger) {
                // Update ticket details agar available
                if (passenger?.Optional?.ticketDetails?.length > 0 && apiResponse.Param?.Sector) {
                  const sector = apiResponse.Param.Sector[0];
                  const ticketUpdate = passenger.Optional.ticketDetails.find(p => p.src === sector.Src && p.des === sector.Des);
                  if (ticketUpdate) {
                    ticketUpdate.ticketNumber = apiPassenger?.Optional?.TicketNumber;
                    ticketUpdate.status = "CONFIRMED";
                  }
                }
                passenger.Optional.TicketNumber = apiPassenger.Optional.TicketNumber;
                
              }
            })
          );
          await getPassengersPreference.save();
        }
      }
      else{
        // Provider 1A ke liye alag flow
        const PNR = await getPnr1APnedingStatus(item.traceId, credentialsType);
        if (!PNR || !PNR.length) {
          return { IsSuccess: false, response: "Log api is not working..." };
        }
        // Typo fix: item.Provider (na ki item.Proivder)
        const pnrImportData = await getPnrDataCommonMethod(Authentication, PNR, item?.provider);
        if (!pnrImportData) {
          return { IsSuccess: false, response: "PNR Import api Not Working.." };
        }
        // Update booking object with new PNR and providerBookingId
      await bookingDetails.findByIdAndUpdate(item._id,{$set:{GPnr:PNR,providerBookingId:await commonProviderMethodDate(item.createdAt)}},{new:true})
        // Call holdBookingProcessPayment (pending true)
        await holdBookingProcessPayment(pnrImportData?.Result, true);
        await updateBarcode2DByBookingId(item?.bookingId,null,item?.itinerary,PNR)
      }
      
      // Prepare bulk update data
      const updateData = {};
      if (apiResponse && apiResponse.BookingInfo) {
        updateData.bookingStatus = apiResponse.BookingInfo.CurrentStatus;
        updateData.APnr = apiResponse.BookingInfo.APnr;
        updateData.GPnr = apiResponse.BookingInfo.GPnr;
        updateData.PNR = apiResponse.BookingInfo.APnr;
      } else if (item.Provider === "1A") {
        updateData.bookingStatus = "CONFIRMED";
      }
      bulkOps.push({
        updateOne: {
          filter: { _id: item._id },
          update: { $set: updateData }
        }
      });
    } // End for loop
    
    // Bulk write update in bookingDetails
    if (bulkOps.length) {
      await bookingDetails.bulkWrite(bulkOps);
    } else {
      return { response: "Error in updating Status!" };
    }
    
    // Process failed bookings: agar bookingStatus FAILED ho toh refund agent credit
    await Promise.all(
      bulkOps.map(async (element) => {
        const bookingStatus = element.updateOne.update.$set.bookingStatus;
        if (bookingStatus && bookingStatus.toUpperCase() === "FAILED") {
          const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000);
          // Fetch booking data
          const bookingsData = await bookingDetails.findById(element.updateOne.filter._id);
          // Refund agent credit using $inc operator
          const agentData = await agentConfig.findOneAndUpdate(
            { userId: bookingsData.userId },
            { $inc: { maxcreditLimit: bookingsData.bookingTotalAmount } },
            { new: true }
          );
          // Create ledger entry for refund
          await ledger.create({
            userId: bookingsData.userId,
            companyId: bookingsData.AgencyId,
            ledgerId: ledgerId,
            cartId: bookingsData.bookingId,
            transactionAmount: bookingsData.bookingTotalAmount,
            currencyType: "INR",
            fop: "DEBIT",
            transactionType: "CREDIT",
            runningAmount: agentData.maxcreditLimit,
            remarks: "Refund amount failed booking",
            transactionBy: bookingsData.userId,
          });
        }
      })
    );
    
    return { response: "Status updated Successfully!" };
  } catch (error) {
    console.error("Error in updateBookingStatus:", error);
    return { response: "Internal Server Error", error: error.message };
  }
};

const updatePendingBookingStatus = async (req, res) => {
  const { _BookingId, credentialsType,companyId,fromDate,toDate } = req.body;
  if (!_BookingId.length) {
    return { response: "_BookingId or companyId or credentialsType does not exist" }
  }
  if(!companyId){
    return({
      response:"TMC companyID Not Found"
    })
  }
  if (!["LIVE", "TEST"].includes(credentialsType)) {
    return {
      IsSucess: false,
      response: "Credential Type does not exist",
    };
  }
  const initialDate = "2025-01-15";

// Increase the date by one day
const newDate = moment(toDate).add(1, 'days').format('YYYY-MM-DD');
  // const objectIdArray = _BookingId.map(id => new ObjectId(id));
  // const getBookingbyBookingId = await bookingDetails.aggregate([{ $match: { _id: { $in: objectIdArray } } }, {
  //   $lookup: {
  //     from: "suppliercodes",
  //     localField: "provider",
  //     foreignField: "supplierCode",
  //     as: "supplierData",
  //   },
  // }, { $unwind: "$supplierData" }, {
  //   $lookup: {
  //     from: "suppliers",
  //     localField: "supplierData._id",
  //     foreignField: "supplierCodeId",
  //     as: "supplyData",
  //   },
  // }, {
  //   $project: {
  //     providerBookingId: 1,
  //     bookingId: 1,
  //     "itinerary.TraceId": 1,
  //     credentialsTypeData: {
  //       $filter: {
  //         input: "$supplyData",
  //         as: "item",
  //         cond: {
  //           $and: [
  //             { $eq: ["$$item.credentialsType", credentialsType] },
  //             { $eq: ["$$item.status", true] }
  //           ]
  //         }
  //       }
  //     }
  //   }
  // }, { $unwind: "$credentialsTypeData" }, {
  //   $project: {
  //     providerBookingId: 1,
  //     bookingId:1,
  //     traceId: "$itinerary.TraceId",
  //     supplierUserId: "$credentialsTypeData.supplierUserId",
  //     supplierPassword: "$credentialsTypeData.supplierPassword",
  //     supplierWsapSesssion: "$credentialsTypeData.supplierWsapSesssion",
  //     credentialsTypeData:1
  //   }
  // }]);

  
  // let supplier = getBookingbyBookingId[0].credentialsTypeData;
  
    
  var Url=""
  var supplier
      if (
        req.headers.host == "localhost:3111" ||
        req.headers.host == "kafila.traversia.net"
      ) {
      
        supplier=await Supplier.find({$and:[{credentialsType:"TEST"},{companyId:companyId},{status:true}]})
        Url = "http://stage1.ksofttechnology.com/api/Freport";
       apiRequestBody = {
          "P_TYPE": "API",
          "R_TYPE": "FLIGHT",
          "R_NAME": "FlightCancelHistory",
          "R_DATA": {
            "ACTION": "",
            "FROM_DATE": new Date(fromDate + 'T00:00:00.000Z'),
            "TO_DATE": new Date(newDate + 'T23:59:59.999Z')
          },
          "AID": "675923",
          "MODULE": "B2B",
          "IP": "182.73.146.154",
          "TOKEN": "fd58e3d2b1e517f4ee46063ae176eee1",
          "ENV": "D",
          "Version": "1.0.0.0.0.0"
        };
      } else if (req.headers.host == "agentapi.kafilaholidays.in") {
  
        supplier=await Supplier.find({$and:[{credentialsType:"LIVE"},{companyId:companyId},{status:true}]})
        Url = "http://fhapip.ksofttechnology.com/api/Freport";
  
        apiRequestBody = {
          "P_TYPE": "API",
          "R_TYPE": "FLIGHT",
          "R_NAME": "FlightCancelHistory",
          "R_DATA": {
            "ACTION": "",
            "FROM_DATE": new Date(fromDate + 'T00:00:00.000Z'),
            "TO_DATE": new Date(newDate + 'T23:59:59.999Z')
          },
          "AID": supplier[0].supplierWsapSesssion,
          "MODULE": "B2B",
          "IP": "182.73.146.154",
          "TOKEN": supplier[0].supplierOfficeId,
          "ENV": "P",
          "Version": "1.0.0.0.0.0"
        };
       
      } else {
        return {
          response: "url not found",
        };
      }
  
  
    // const response = (await axios.post(createTokenUrl, postData, {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }))?.data;

    let fSearchApiResponse = await axios.post(
      Url,
      apiRequestBody,
      
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

      // const getpassengersPrefrence = await passengerPreferenceModel.findOne({ bookingId: item?.bookingId });
      // if (getpassengersPrefrence && getpassengersPrefrence.Passengers) {
      //   await Promise.all(getpassengersPrefrence.Passengers.map(async (passenger) => {
      //     const apiPassenger = response.PaxInfo.Passengers.find(p => p.FName === passenger.FName && p.LName === passenger.LName);
      //     if (apiPassenger) {
      //     //  console.log(passenger,"apiPassenger");
      //       if(passenger?.Optional?.ticketDetails?.length > 0){
      //         const ticketUpdate = passenger.Optional.ticketDetails.find(p => p.src === fSearchApiResponse.data.Param.Sector[0].Src && p.des === fSearchApiResponse.data.Param.Sector[0].Des);
      //     //    console.log(ticketUpdate,"ticketUpdate");
      //         if(ticketUpdate){
      //           console.log(apiPassenger?.Optional?.TicketNumber,"jdsdsjkdj")
      //           ticketUpdate.ticketNumber = apiPassenger?.Optional?.TicketNumber;
      //         }
      //       }
            
      //       passenger.Optional.TicketNumber = apiPassenger.Optional.TicketNumber;
      //       passenger.Status = "CONFIRMED";
      //     }
      //   }));

      //   await getpassengersPrefrence.save();
      // }



    // return {
    //   response: "Status updated Successfully!",
    //   data:response
    // }
    // console.log(response);

// console.log(response?.BookingInfo?.CurrentStatus,"jidie")
//     bulkOps.push({
//       updateOne: {
//         filter: { _id: item._id },
//         update: { $set: { 
//           bookingStatus: response?.BookingInfo?.CurrentStatus,
//           APnr: response?.BookingInfo?.APnr,
//           GPnr:  response?.BookingInfo?.GPnr,
//           PNR: response?.BookingInfo?.APnr,
//          } }
//       }
//     });
const refundHistory = fSearchApiResponse.data;

    if(!refundHistory){
      return ({
        response:"Kafila API Data Not Found"
      })
    }


// const bookingIdsInHistory = bookingIds.map(item => item);

// const filterData = refundHistory.filter(element => bookingIdsInHistory.includes(element.BookingId));

// const matchIds=filterData.map(item=> item.BookingId)

// console.log(matchIds,"jiejiei")

const cancelationbookignsData=await CancelationBooking.find({bookingId:_BookingId})
if(!cancelationbookignsData.length>0){
  return ({
    response:"Cancellation Data Not Found"
  })
}
let refundProcessed = await RefundedCommonFunction(cancelationbookignsData,refundHistory)
if(refundProcessed.response=="Not Match BookingID"||refundProcessed.response==="Cancellation Data Not Found"){
   return({
      response:"Cancellation is still Pending"
    })
  
  }else if(refundProcessed.response=="Cancelation Proceed refund"){
    return({
      response:refundProcessed.response,
      
    })
  }

else if(refundProcessed.response=="Cancellation status updated successfully."){
  return ({response:"Status updated Successfully!"})
}
  // if (bulkOps.length) {
  //   await bookingDetails.bulkWrite(bulkOps);
  //   return {
  //     response: "Status updated Successfully!"
  //   }
  // } else {
  //   return {
  //     response: "Error in updating Status!"
  //   }
  // }
}

const updateConfirmBookingStatus = async (req, res) => {
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

    const response = (await axios.post(createTokenUrl, postData, {
      headers: {
        'Content-Type': 'application/json'
      }
    }))?.data;

    let fSearchApiResponse = await axios.post(
      createTokenUrl,
      postData,
      
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

      const getpassengersPrefrence = await passengerPreferenceModel.findOne({ bookingId: item?.bookingId });
      if (getpassengersPrefrence && getpassengersPrefrence.Passengers) {
        await Promise.all(getpassengersPrefrence.Passengers.map(async (passenger) => {
          const apiPassenger = response.PaxInfo.Passengers.find(p => p.FName === passenger.FName && p.LName === passenger.LName);
          if (apiPassenger) {
          //  console.log(passenger,"apiPassenger");
            if(passenger?.Optional?.ticketDetails?.length > 0){
              const ticketUpdate = passenger.Optional.ticketDetails.find(p => p.src === fSearchApiResponse.data.Param.Sector[0].Src && p.des === fSearchApiResponse.data.Param.Sector[0].Des);
          //    console.log(ticketUpdate,"ticketUpdate");
              if(ticketUpdate){
                console.log(apiPassenger?.Optional?.TicketNumber,"jdsdsjkdj")
                ticketUpdate.ticketNumber = apiPassenger?.Optional?.TicketNumber;
              }
            }
            
            passenger.Optional.TicketNumber = apiPassenger.Optional.TicketNumber;
            passenger.Status = "CONFIRMED";
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
  bulkOps.forEach(async(element)=>{
    if (element.updateOne.update.$set.bookingStatus.toUpperCase() === "CANCELLED") {
      const bookingsData = await bookingDetails.findById(element.updateOne.filter._id);
      const BookingIdDetails = new CancelationBooking({
        calcelationStatus: "CANCEL" || null ,
        bookingId:BookingIdDetails.providerBookingId,
        providerBookingId:BookingIdDetails.providerBookingId,
        AirlineCode: BookingIdDetails?.itinerary?.Sectors[0]?.AirlineCode || null ,
        companyId: Authentication?.CompanyId || null,
        userId: Authentication?.UserId || null,
        PNR: BookingIdDetails?.PNR || null,
        fare:BookingIdDetails?.itinerary?.TotalPrice || null ,
        AirlineCancellationFee: 0,
        AirlineRefund: 0,
        ServiceFee: 0 || 0,
        RefundableAmt: 0 || 0,
        description:fSearchApiResponse.data.WarningMessage || null,
        modifyBy: Authentication?.UserId || null,
        modifyAt: new Date(),
      });
      // Fetch the booking data
      await cancelationBookingInstance.save();
      
  }
  
  })

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

const cancelationDataUpdate=async(Authentication,fCancelApiResponse,BookingIdDetails)=>{
  const findCancelationBooking = await CancelationBooking.findOne({$or:[{pnr:fCancelApiResponse?.data?.R_DATA?.Charges?.Pnr},{bookingId:BookingIdDetails?.providerBookingId}]
  })

  if(!findCancelationBooking){
    const cancelationBookingInstance = new CancelationBooking({
      calcelationStatus: fCancelApiResponse?.data?.R_DATA?.Error?.Status || null,
      AirlineCode: fCancelApiResponse?.data?.R_DATA?.Charges?.FlightCode || null,
      companyId: Authentication?.CompanyId || null,
      bookingId:BookingIdDetails?.providerBookingId,
      providerBookingId:BookingIdDetails?.providerBookingId,
      userId: Authentication?.UserId || null,
      traceId:fCancelApiResponse?.data?.R_DATA?.TRACE_ID,
      PNR: fCancelApiResponse?.data?.R_DATA?.Charges?.Pnr || null,
      fare: fCancelApiResponse?.data?.R_DATA?.Charges?.Fare || null,
      AirlineCancellationFee: fCancelApiResponse?.data?.R_DATA?.Charges?.AirlineCancellationFee || null,
      AirlineRefund: fCancelApiResponse?.data?.R_DATA?.Charges?.AirlineRefund || null,
      ServiceFee: fCancelApiResponse?.data?.R_DATA?.Charges?.ServiceFee || null,
      RefundableAmt: fCancelApiResponse?.data?.R_DATA?.Charges?.RefundableAmt || null,
      description: fCancelApiResponse?.data?.R_DATA?.Charges?.Description || null,
      modifyBy: Authentication?.UserId || null,
      modifyAt: new Date(),
    });


    await cancelationBookingInstance.save();

  }
  else{
    await CancelationBooking.findByIdAndUpdate(findCancelationBooking._id,{$set:{

    }},{new:true})

  }

}
 
module.exports = {
  fullCancelation, updateBookingStatus,updatePendingBookingStatus,updateConfirmBookingStatus
};
