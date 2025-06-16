const varifyOtpModel = require("../../models/VerifyOtp");
const FUNC = require("../commonFunctions/common.function");
const smtpConfig = require("../../models/Smtp");
const moment = require('moment');
const company = require('../../models/Company');
const registration = require("../../models/Registration");
const Smtp = require("../../models/Smtp");
const configCred = require("../../models/ConfigCredential");

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


const commonRegistrationOTPVerfication = async (req, res) => {
  try {
    const { otp, typeName, type } = req?.body?.verifyOTPData;
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
     response: "OTP verified successfully",
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
const afterVerifyAddRegistration = async (req, res) => {
  try {
   

       let {
      companyId,
      companyName,
      panNumber,
      panName,
      firstName,
      lastName,
      saleInChargeId,
      email,
      mobile,
      street,
      pincode,
      country,
      state,
      city,
      remark,
      roleId,
      gstNumber,
      gstName,
      gstAddress_1,
      isIATA,
      gstAddress_2,
      gstState,
      gstPinCode,
      gstCity,
      agencyGroupId,
      parent,
      adharDetail,
      adharNumber
    } = req?.body?.registrationData;
    const fieldNames = [
      "companyId",
      "companyName",
      // "panNumber",
      // "panName",
      "firstName",
      "lastName",
      "email",
      "mobile",
      "street",
      "pincode",
      "country",
      "state",
      // "city",
      "roleId",
    ];
    const missingFields = fieldNames.filter(
      (fieldName) =>
        req?.body?.registrationData[fieldName] === null || req?.body?.registrationData[fieldName] === undefined
    );
    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(", ");
      return {
        response: null,
        isSometingMissing: true,
        data: `Missing or null fields: ${missingFieldsString}`,
      };
    }

    let iscountry = FUNC.checkIsValidId(country);
    let isState = FUNC.checkIsValidId(state);
    let isroleId = FUNC.checkIsValidId(roleId);
    let iscompanyId = FUNC.checkIsValidId(companyId);

    if (saleInChargeId == "" || saleInChargeId == "" || !saleInChargeId) {
      saleInChargeId = null;
    }

    if (iscountry === "Invalid Mongo Object Id") {
      return {
        response: "Country Id is not valid",
        data:null
      };
    }

    if (isState === "Invalid Mongo Object Id" || iscompanyId === "Invalid Mongo Object Id") {
      return {
        response: `${isState || iscompanyId} Id is not valid`,
        data:null
      };
    }

    if (isroleId === "Inavlid Mongo Object Id") {
      return {
        response: "Role Id is not valid",
        data:null
      };
    }
    if (saleInChargeId !== null) {
      let issaleInChargeId = FUNC.checkIsValidId(saleInChargeId);
      if (issaleInChargeId === "Invalid Mongo Object Id") {
        return {
          response: "State Id is not valid",
          data:null
        };
      }
    }
    const existingRegistrationWithEmail = await registration.findOne({ email });
    if (existingRegistrationWithEmail) {
      return {
        response: "Email already exists",
        data:null
      };
    }
    const existingRegistrationWithMobile = await registration.findOne({
      mobile,
    });
    if (existingRegistrationWithMobile) {
      return {
        response: "Mobile number already exists",
        data:null
      };
    }
    let comapnyIds = companyId;
    let mailConfig = await Smtp.findOne({ companyId: comapnyIds });
    if (!mailConfig) {
      let id = Config.MAIL_CONFIG_ID;
      mailConfig = await Smtp.findById(id);
    }
    // let checkCompanyType = await companyModels.findById(companyId);
    // // let parent;
    // if (checkCompanyType.type === "Distributer") {
    //   parent = checkCompanyType?.parent
    // }
    const newRegistration = new registration({
      companyId,
      companyName,
      panNumber,
      panName,
      firstName,
      lastName,
      saleInChargeId,
      email,
      mobile,
      street,
      pincode,
      country,
      state,
      city,
      remark,
      roleId,
      gstName,
      gstNumber,
      isIATA: isIATA || false,
      gstCity: gstCity || null,
      gstAddress_1: gstAddress_1 || null,
      gstAddress_2: gstAddress_2 || null,
      gstState: gstState || null,
      gstPinCode: gstPinCode || null,
      agencyGroupId,
      parent,
      adharDetail,
      adharNumber
    });
    let newRegistrationRes = await newRegistration.save();
    // console.log(newRegistrationRes);
    let mailText = newRegistrationRes;
    let mailSubject = `New registration created successfully`;
    let smsUrl = await configCred.findOne({ companyId: companyId });
    if (!smsUrl) {
      smsUrl = await configCred.find();
    }



 if (newRegistrationRes) {
   return {
     response: "OTP verified & registration successfully",
     data:newRegistrationRes
   };
 } else {
   return {
     response: `Registration Failed!`,
     data:null
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
  SendTicket,
  commonRegistrationOTPVerfication,
  afterVerifyAddRegistration
};
