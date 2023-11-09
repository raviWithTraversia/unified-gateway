const varifyOtp = require("../../models/VerifyOtp");
const FUNC = require("../commonFunctions/common.function");
const smtpConfig = require("../../models/smtp");
const moment = require('moment');
const company = require('../../models/Company');

const sendEmailOtp = async (req, res) => {
  try {
    const { type, typeName , companyId} = req.body;
    let generateOtp = Math.floor(100000 + Math.random() * 900000);
    //host,port,user,pass
    let smtpDetails;
    if(companyId){
     smtpDetails = await smtpConfig.findOne({companyId :companyId});
    }else{
      let companyId = await company.findOne({type : "Host"});
      companyId = companyId._id
      smtpDetails = await smtpConfig.findOne({companyId :companyId})
    }

    if(!smtpDetails){
      return {
        response : "No Smtp details found for this company id"
      }
    }
   
    const currentTime = new Date();
    let deletePreviousResult  = await varifyOtp.deleteMany({otpExpireTime: { $lt: currentTime } ,otpFor : type, typeName : typeName, status : true });
    let otpSent = await FUNC.sendOtpOnEmail(typeName, generateOtp, smtpDetails);
   // console.log(otpSent , "===========================")
    const saveOtpData = new varifyOtp({
      otpFor: type,
      typeName: typeName,
      otp: generateOtp,
      otpExpireTime : moment().add(2,'minute'),
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
    const { otp, typeName,type } = req.body;
    const otpData = await varifyOtp.findOne({
      typeName,
      otpFor: type,
      status: true,
    });
    console.log(otpData, "<<<================>>>")
    if(!otpData){
      return {
        response : 'Please send otp again'
      }
    }
    const currentTimestamp = moment();
    if (moment(currentTimestamp).isAfter(moment(otpData?.otpExpireTime))) {
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
