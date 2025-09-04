const BookingDetail = require("../../models/Irctc/bookingDetailsRail");
var ObjectId = require("mongoose").Types.ObjectId;
const User = require("../../models/User");
const Company = require("../../models/Company");
const axios = require("axios");
const { Config } = require("../../configs/config");
const { commonFunctionsRailLogs, createLeadger } = require("../../controllers/commonFunctions/common.function");
const { updateBookingWithCartId } = require("./railSearch.services");
const RailCancellation = require("../../models/Irctc/rail-cancellation");
const Railleadger=require('../../models/Irctc/ledgerRail')
const agentConfig=require('../../models/AgentConfig')
const StationMaster=require('../../models/TrainStation')


const createIrctcBooking = async (req, res) => {};

const irctcPaymentSubmit = async (req, res) => {
  try {
    const { Authentication, clientTransactionId, paymentMode, paramMap } =
      req.body;
    if (!Authentication || !clientTransactionId || !paymentMode || !paramMap) {
      return { response: "Provide required fields" };
    }
    if (!["LIVE", "TEST"].includes(Authentication.CredentialType)) {
      return {
        IsSucess: false,
        response: "Credential Type does not exist",
      };
    }
    const checkUser = await User.findById(Authentication.UserId).populate(
      "roleId"
    );
    const checkCompany = await Company.findById(Authentication.CompanyId);
    if (!checkUser || !checkCompany) {
      return { response: "Either User or Company must exist" };
    }
    if (checkUser?.roleId?.name !== "Agency") {
      return { response: "User role must be Agency" };
    }
    if (checkCompany?.type !== "TMC") {
      return { response: "companyId must be TMC" };
    }

    let url = `${Config.TEST.IRCTC_BASE_URL}/eticketing/webservices/tatktservices/paymentsubmit`;
    const auth = Authentication.CredentialType==="LIVE"?Config.LIVE.IRCTC_AUTH:Config.TEST.IRCTC_AUTH;
    if (Authentication.CredentialType === "LIVE") {
      url = `${Config.LIVE.IRCTC_BASE_URL}/eticketing/webservices/tatktservices/paymentsubmit`;
    }

    let queryParams = {
      wsUserLogin: Authentication.CredentialType === "LIVE"?Config.LIVE.IRCTC_MASTER_ID:Config.TEST.IRCTC_MASTER_ID ,
      clientTransactionId: clientTransactionId,
      paymentMode: paymentMode,
      paramMap: paramMap,
    };
    // console.log(queryParams, "queryParams");
    const response = (
      await axios.post(url, queryParams, { headers: { Authorization: auth } })
    )?.data;
    // console.log(response, "response");
    if (!response) {
      return {
        response: "No Response from Irctc",
      };
    } else {
      return {
        response: "Fetch Data Successfully",
        data: response,
      };
    }
  } catch (error) {
    // console.log(error, "error");
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const boardingstationenq = async (req, res) => {
  try {
    const {
      Authentication,
      trainNo,
      jrnyDate,
      frmStation,
      toStation,
      jrnClass,
    } = req.body;
    if (
      !Authentication ||
      !trainNo ||
      !jrnyDate ||
      !frmStation ||
      !toStation ||
      !jrnClass
    ) {
      return { response: "Provide required fields" };
    }
    if (!["LIVE", "TEST"].includes(Authentication.CredentialType)) {
      return {
        IsSucess: false,
        response: "Credential Type does not exist",
      };
    }
    const checkUser = await User.findById(Authentication.UserId).populate(
      "roleId"
    );
    const checkCompany = await Company.findById(Authentication.CompanyId);
    if (!checkUser || !checkCompany) {
      return { response: "Either User or Company must exist" };
    }
    if (checkUser?.roleId?.name !== "Agency") {
      return { response: "User role must be Agency" };
    }
    if (checkCompany?.type !== "TMC") {
      return { response: "companyId must be TMC" };
    }
    let renewDate = jrnyDate.split("-");
    let url = `${Config.TEST.IRCTC_BASE_URL}/eticketing/webservices/taenqservices/boardingstationenq/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${frmStation}/${toStation}/${jrnClass}`;
    const auth = Authentication.CredentialType==="LIVE"?Config.LIVE.IRCTC_AUTH:Config.TEST.IRCTC_AUTH;
    if (Authentication.CredentialType === "LIVE") {
      url = `${Config.LIVE.IRCTC_BASE_URL}/eticketing/webservices/taenqservices/boardingstationenq/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${frmStation}/${toStation}/${jrnClass}`;
    }

    const response = (
      await axios.get(url, { headers: { Authorization: auth } })
    )?.data;
    // console.log(response, "response");
    if (!response) {
      return {
        response: "No Response from Irctc",
      };
    } else {
      return {
        response: "Fetch Data Successfully",
        data: response,
      };
    }
  } catch (error) {
    // console.log(error, "error");
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const irctcAmountDeduction = async (req, res) => {
  try {
    const { Authentication, paymentMode, companyId, amount } = req.body;
    if (!Authentication || !paymentMode || !companyId || !amount) {
      return { response: "Provide required fields" };
    }
    if (!["LIVE", "TEST"].includes(Authentication.CredentialType)) {
      return {
        IsSucess: false,
        response: "Credential Type does not exist",
      };
    }
    const checkUser = await User.findById(Authentication.UserId).populate(
      "roleId"
    );
    const checkCompany = await Company.findById(Authentication.CompanyId);
    if (!checkUser || !checkCompany) {
      return { response: "Either User or Company must exist" };
    }
    if (checkUser?.roleId?.name !== "Agency") {
      return { response: "User role must be Agency" };
    }
    if (checkCompany?.type !== "TMC") {
      return { response: "companyId must be TMC" };
    }

    // if (!response) {
    //   return {
    //     response: "No Response from Irctc",
    //   };
    // } else {
    //   return {
    //     response: "Fetch Data Successfully",
    //     data: response,
    //   };
    // }
  } catch (error) {
    // console.log(error, "error");
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const checkBookingWithCartId=async(cartId,traceId,Authentication,booking)=>{
    
    try{
      if(booking?.bookingStatus==="FAILED"){
        return 
 }
      let url = `${Config.TEST.IRCTC_BASE_URL}/eticketing/webservices/tatktservices/bookingdetails/${cartId}`;
    const auth = Authentication.CredentialType==="LIVE"?Config.LIVE.IRCTC_AUTH:Config.TEST.IRCTC_AUTH;
    if (Authentication.CredentialType === "LIVE") {
      url = `${Config.LIVE.IRCTC_BASE_URL}/eticketing/webservices/tatktservices/bookingdetails/${cartId}`;
    }
    const response = (
      await axios.get(url, { headers: { Authorization: auth } })
    )?.data;
    commonFunctionsRailLogs(Authentication?.CompanyId, Authentication?.UserId, traceId, "BookDetail", url, {}, response)
    // console.log(response, "response");
    if (!response||!response?.pnrNumber) {
      
      // createRailLedger(Authentication?.UserId,booking)
     await Promise.all([
       createRailLedgerCredit(Authentication?.UserId,booking),
      //  booking.save()
     ])
    
      return 
    }
    return  await updateBookingWithCartId(response,cartId)

    }catch(error){
        // console.log(error,"error");
        throw error
    }
}

const createRailLedgerCredit = async (userId, booking) => {
  try {
    // console.log(booking, "booking");

    // Run independent queries in parallel
    const [getAgentConfig, getTicketBalance,getTrainStation] = await Promise.all([
      agentConfig.findOne({ userId: userId }),
      Railleadger.findOne({
        cartId: booking.cartId,
        transactionType: "DEBIT"
      }).sort({ createdAt: -1 }),
      StationMaster.findOne({StationCode:booking?.fromStn})
      

    ]);

    if (!getAgentConfig) throw new Error("Agent config not found");

    // Example: Calculate new balance
    booking.fromStnName= getTrainStation?.StationName;
    booking.boardingStn=getTrainStation?.StationCode
    booking.bookingStatus="FAILED"
      booking.message="Booking Failed"
      // booking.resvnUptoStnName= await provideStationName(jsonData?.resvnUptoStn)
     booking.boardingStnName= getTrainStation?.StationName;
    const ticketAmount = getTicketBalance?.transactionAmount || 0;
    const currentBalance = getAgentConfig.railCashBalance || 0;
    const newBalance = Math.round(currentBalance +ticketAmount);

    // Update balance
    const ledgerId = `LG${Math.floor(100000 + Math.random() * 900000)}`;

    const [updatedAgentConfig,railBalance,bookingData]=await Promise.all([
      agentConfig.findOneAndUpdate(
      { userId: userId },
      { $set: { railCashBalance: newBalance } },
      { new: true }
    ),
    Railleadger.create({
      userId,
      companyId: getAgentConfig.companyId,
      ledgerId,
      transactionAmount: ticketAmount,
      agentCharges: 0,
      currencyType: "INR",
      fop: "CREDIT",
      transactionType: "CREDIT",
      runningAmount: newBalance,
      remarks: "AUTO REFUND",
      transactionBy: userId,
      cartId: booking.cartId,
    }),
    booking.save()
    ])
    // const updatedAgentConfig = await agentConfig.findOneAndUpdate(
    //   { userId: userId },
    //   { $set: { railCashBalance: newBalance } },
    //   { new: true }
    // );

    if (!updatedAgentConfig) {
      throw new Error("Failed to update agent balance.");
    }

    // Create ledger entry
  

    return 
  } catch (error) {
    throw error;
  }
};


const gernateCancelCard=async(Authentication,booking,traceId)=>{
  try{

    const irctcMatsterId=Authentication.CredentialType==="LIVE"?Config.LIVE.IRCTC_MASTER_ID:Config.TEST.IRCTC_MASTER_ID;

    let url = `${Config.TEST.IRCTC_BASE_URL}/eticketing/webservices/tabkhservices/historySearchByTxnId/${irctcMatsterId}/${booking?.reservationId}`;
    const auth = Authentication.CredentialType==="LIVE"?Config.LIVE.IRCTC_AUTH:Config.TEST.IRCTC_AUTH;

    if (Authentication.CredentialType === "LIVE") {
      url = `${Config.LIVE.IRCTC_BASE_URL}/eticketing/webservices/tabkhservices/historySearchByTxnId/${irctcMatsterId}/${booking?.reservationId}`;
    }
    const response = (
      await axios.get(url, { headers: { Authorization: auth } })
    )?.data;

if(response?.bookingResponseList?.length===0){
  return
  
}
const bookingData=response?.bookingResponseList[0]?.cancellationDetails[0]||[]
    commonFunctionsRailLogs(Authentication?.CompanyId, Authentication?.UserId, traceId, "cancelDetail", url, {}, response)
    // console.log(response, "response");
    // if (bookingData.length === 0) {
    //   return 
    // }
    let passgerslist=booking?.psgnDtlList;
    let token = "";
    for (let i = 0; i <6; i++) {  // <= ki jagah < use karo
    if (passgerslist[i]?.currentStatus === "CAN") {  // yahan true ya false check hoga
      token+= "Y";
    } else {
      token += "N";
    }
}

    const railCancellation = await RailCancellation.create({
          ...bookingData,
          userId: booking?.userId,
          companyId: booking?.companyId,
          agencyId: booking?.AgencyId,
          reservationId:booking?.reservationId,
          passengerToken:token,
          txnId:booking?.cartId,
          pnrNo:booking?.pnrNumber,
         isSuccess: !!bookingData.success,
          travelInsuranceRefundAmount: Number(bookingData.travelinsuranceRefundAmount),
          amountCollected: Number(bookingData.canPsgnFare),
          cashDeducted: Number(bookingData.prsCancelCharge),
          cancelledDate: Date(bookingData.cancellationDate),
          gstFlag: !!bookingData.gstFlag||false,
          timeStamp: Date(bookingData.timeStamp),
          cancellationId: bookingData?.cancellationId,
          noOfPsgn: Number(bookingData.noOfPsgn),
          currentStatus: ["CAN"],
          remark:  "AUTO CANCELLED",
          staff:  "",
        });
    
        // const isFullCancelled=booking.psgnDtlList.some((element)=>element.currentStatus!='CAN')
        //  const bookingStatus = isFullCancelled ? "PARTIALLY CANCELLED" : "CANCELLED";
    
        // booking.bookingStatus = bookingStatus;

        const tokenList = token.split("");
        const filterRailPaxList=booking.psgnDtlList.filter((element)=>element.currentStatus!='CAN')
        const isFullCancelled =
          token === "YYYYYY" ||
          tokenList.filter((t) => t === "Y").length === filterRailPaxList.length;
    
        const bookingStatus =  "CANCELLED";
    
        booking.bookingStatus = bookingStatus;
        booking.psgnDtlList = booking.psgnDtlList.map((passenger, idx) => {
          if (tokenList[idx] == "Y") {
            return {
              ...passenger,
              currentStatus: "CAN",
              cancellationId: bookingData?.cancellationId,
              cancelTime:bookingData.cancellationDate? new Date(bookingData.cancellationDate): new Date(),
              isRefundOTPVerified: false,
            };
          }
          return passenger;
        });
          await booking.save();
  }
  catch (error) {
    throw error
  }
}
module.exports = {
  createIrctcBooking,
  irctcPaymentSubmit,
  boardingstationenq,
  irctcAmountDeduction,
  checkBookingWithCartId,
  gernateCancelCard
};
