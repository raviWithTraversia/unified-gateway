const BookingDetail = require("../../models/Irctc/bookingDetailsRail");
var ObjectId = require("mongoose").Types.ObjectId;
const User = require("../../models/User");
const Company = require("../../models/Company");
const axios = require("axios");

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

    let url = `https://stagews.irctc.co.in/eticketing/webservices/tatktservices/paymentsubmit`;
    const auth = "Basic V0tBRkwwMDAwMDpUZXN0aW5nMQ==";
    if (Authentication.CredentialType === "LIVE") {
      url = `https://stagews.irctc.co.in/eticketing/webservices/tatktservices/paymentsubmit`;
    }

    let queryParams = {
      wsUserLogin: "WKAFL00001",
      clientTransactionId: clientTransactionId,
      paymentMode: paymentMode,
      paramMap: paramMap,
    };
    console.log(queryParams, "queryParams");
    const response = (
      await axios.post(url, queryParams, { headers: { Authorization: auth } })
    )?.data;
    console.log(response, "response");
    if (!response) {
      return {
        response: "Error in fetching data",
      };
    } else {
      return {
        response: "Fetch Data Successfully",
        data: response,
      };
    }
  } catch (error) {
    console.log(error, "error");
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
    let url = `https://stagews.irctc.co.in/eticketing/webservices/taenqservices/boardingstationenq/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${frmStation}/${toStation}/${jrnClass}`;
    const auth = "Basic V0tBRkwwMDAwMDpUZXN0aW5nMQ==";
    if (Authentication.CredentialType === "LIVE") {
      url = `https://stagews.irctc.co.in/eticketing/webservices/taenqservices/boardingstationenq/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${frmStation}/${toStation}/${jrnClass}`;
    }

    const response = (
      await axios.get(url, { headers: { Authorization: auth } })
    )?.data;
    console.log(response, "response");
    if (!response) {
      return {
        response: "Error in fetching data",
      };
    } else {
      return {
        response: "Fetch Data Successfully",
        data: response,
      };
    }
  } catch (error) {
    console.log(error, "error");
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
    //     response: "Error in fetching data",
    //   };
    // } else {
    //   return {
    //     response: "Fetch Data Successfully",
    //     data: response,
    //   };
    // }
  } catch (error) {
    console.log(error, "error");
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

module.exports = {
  createIrctcBooking,
  irctcPaymentSubmit,
  boardingstationenq,
  irctcAmountDeduction,
};
