const varifyOtp = require("../../models/VerifyOtp");
const FUNC = require("../commonFunctions/common.function");
const moment = require('moment');

const sendEmailOtp = async (req, res) => {
  try {
    const { email, typeName } = req.body;
    let generateOtp = Math.floor(100000 + Math.random() * 900000);
    let otpSent = await FUNC.sendOtpOnEmail(email, generateOtp);

    const saveOtpData = new varifyOtp({
      otpFor: "Email",
      typeName: typeName,
      otp: generateOtp,
      otpExpireTime : moment().add(1,'minute'),
      status: true,
    });
    let otpRes = await saveOtpData.save();
    if (otpRes) {
      return {
        response: "Otp sent sucessfully to your email",
      };
    } else {
      return {
        response: "Try Again to sent otp ",
      };
    }
  } catch (error){
    console.log(error, "======================");
    throw error;
  }
};




const varifyOtpEmailOtp = async (req, res) => {
  try {
    const { otp, typeName } = req.body;
    const otpData = await varifyOtp.findOne({
      typeName,
      otpFor: "Email",
      status: true,
    });
    const currentTimestamp = moment();
    if (moment(currentTimestamp).isAfter(moment(otpData.otpExpireTime))) {
      otpData.status = false;
      await otpData.save();
      return {
        response: "OTP has expired",
      };
    } else if (otpData.otp === otp) {
      otpData.status = false;
      await otpData.save();
      return {
        response: "Email OTP verified successfully",
      };
    } else {
      // Invalid OTP
      return {
        response: "Invalid OTP",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  sendEmailOtp,
  varifyOtpEmailOtp,
};
