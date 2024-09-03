const varifyOtpModel = require("../../models/VerifyOtp");
const FUNC = require("../commonFunctions/common.function");
const smtpConfig = require("../../models/Smtp");
const moment = require('moment');
const company = require('../../models/Company');

const sendEmailOtp = async (req, res) => {
  try {
    const { type, typeName , companyId} = req.body;
    let otp = Math.floor(100000 + Math.random() * 900000);
    let generateOtp = otp
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
   let deletePreviousResult  = await varifyOtpModel.deleteMany({otpExpireTime: { $lt: currentTime } ,otpFor : type, typeName : typeName, status : true });
   let otpSent = await FUNC.sendOtpOnEmail(typeName, generateOtp, smtpDetails);
   //console.log(otpSent , "===========================")
    const saveOtpData = new varifyOtpModel({
      otpFor: type,
      typeName: typeName,
      otp: generateOtp,
      otpExpireTime : moment().add(10,'minute'),
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
    const { otp, typeName, type } = req.body;

    const otpData = await varifyOtpModel.find({
      typeName,
      otpFor: type,
      status: true,
    }).sort({ _id: -1 });

    if (otpData.length === 0) {
      return {
        response: 'Please send otp again',
      };
    }

    console.log(otpData);
    const currentTimestamp = moment();

    if (moment(currentTimestamp).isAfter(moment(otpData[0]?.otpExpireTime))) {
      otpData[0].status = false;
      await otpData[0].save(); 
      return {
        response: "OTP has expired",
      };
    } else if (otpData[0].otp == otp) {
      otpData[0].status = false;
      await otpData[0].save(); 
      return {
        response: "Email and Phone OTP verified successfully",
      };
    } else {
      return {
        response: "Invalid OTP",
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const sendPhoneOtp = async (req, res) => {
  try {
    const { type, typeName , companyId} = req.body;
    let otp = Math.floor(100000 + Math.random() * 900000);
    let generateOtp = otp
    //host,port,user,pass
   console.log(typeName,'sj')
    const currentTime = new Date();
   let deletePreviousResult  = await varifyOtpModel.deleteMany({otpExpireTime: { $lt: currentTime } ,otpFor : type, typeName : typeName, status : true });
   let otpSent = await FUNC.sendSMS(typeName,otp);
    console.log(otpSent , "===========================")
    const saveOtpData = new varifyOtpModel({
      otpFor: type,
      typeName: typeName,
      otp: generateOtp,
      otpExpireTime : moment().add(2,'minute'),
      status: true,
    });
    let otpRes = await saveOtpData.save();
    if (otpRes) {
      return {
        response: "Otp sent sucessfully to your Mobile",
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


const SendTicket = async (req, res) => {
  try {
    const { Phone, options , companyId} = req.body;
//     console.log(options[0]?.apiItinerary?.Sector)
// console.log(options[0]?.apiItinerary?.FName)
// console.log(options[0]?.apiItinerary?.FNo)
// console.log(options[0]?.apiItinerary?.Sector)
// console.log(options[0]?.apiItinerary?.Dur)
// console.log(options[0]?.apiItinerary?.Stop)
   let otpSent = await FUNC.sendTicketSms(Phone,options[0]?.apiItinerary?.Sector,options[0]?.apiItinerary?.FName,options[0]?.apiItinerary?.FNo,options[0]?.apiItinerary?.Dur,options[0]?.apiItinerary?.DDate);
   
    if (otpSent) {
      return {
        response: "Otp sent sucessfully to your Mobile",
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
module.exports = {
  sendEmailOtp,
  varifyOtpEmailOtp,
  sendPhoneOtp,
  SendTicket
};
