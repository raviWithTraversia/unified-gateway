const BookingDetail = require("../../models/Irctc/bookingDetailsRail");
var ObjectId = require("mongoose").Types.ObjectId;
const User = require("../../models/User");
const Company = require("../../models/Company");
const axios = require("axios");
const { Config } = require("../../configs/config");
const { commonFunctionsRailLogs } = require("../../controllers/commonFunctions/common.function");
const { updateBookingWithCartId } = require("./railSearch.services");


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

const checkBookingWithCartId=async(cartId,traceId,Authentication)=>{
    
    try{
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
      return 
    }
    return  await updateBookingWithCartId(response,cartId)

    }catch(error){
        // console.log(error,"error");
        throw error
    }
}

module.exports = {
  createIrctcBooking,
  irctcPaymentSubmit,
  boardingstationenq,
  irctcAmountDeduction,
  checkBookingWithCartId
};
