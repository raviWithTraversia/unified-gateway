const varifyOtpServices = require("./verifyOtp.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  ADMIN_USER_TYPE,
  CrudMessage,
} = require("../../utils/constants");

const sendEmailOtp = async (req, res) => {
  try {
    const result = await varifyOtpServices.sendEmailOtp(req, res);
    if (result.response === "Otp sent sucessfully to your email") {
      apiSucessRes(
        res,
        CrudMessage.OTP_EMAIL,
        result.response,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response === "Try Again to sent otp") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.PRECONDITION_FAILED,
        true
      );
    } else {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.PRECONDITION_FAILED,
        true
      );
    }
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.PRECONDITION_FAILED, true);
  }
};

const varifyOtpEmailOtp = async (req, res) => {
  try {
    const result = await varifyOtpServices.varifyOtpEmailOtp(req, res);
    if (result.response === "OTP has expired") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.PRECONDITION_FAILED,
        true
      );
    } else if (result.response == "Email and Phone OTP verified successfully") {
      apiSucessRes(
        res,
        CrudMessage.OTP_VARIFIED,
        result.response,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response === "Invalid OTP") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.PRECONDITION_FAILED,
        true
      );
    }
    else if(result.response === "Please send otp again"){
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    }
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.PRECONDITION_FAILED, true);
  }
};

const sendPhoneOtp = async (req, res) => {
  try {
    const result = await varifyOtpServices.sendPhoneOtp(req, res);
    if (result.response === "Otp sent sucessfully to your Mobile") {
      apiSucessRes(
        res,
        CrudMessage.OTP_EMAIL,
        result.response,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response === "Try Again to sent otp") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.PRECONDITION_FAILED,
        true
      );
    } else {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.PRECONDITION_FAILED,
        true
      );
    }
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.PRECONDITION_FAILED, true);
  }
};
module.exports = {
  sendEmailOtp,
  varifyOtpEmailOtp,
  sendPhoneOtp
};
