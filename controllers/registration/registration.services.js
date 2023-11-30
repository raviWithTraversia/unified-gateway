const registration = require("../../models/Registration");
const FUNC = require("../../controllers/commonFunctions/common.function");
const status = require("../../models/status");
const Company = require("../../models/Company");
const Smtp = require("../../models/smtp");
const { ObjectId } = require("mongodb");
const configCred = require('../../models/ConfigCredential')
const { Config } = require("../../configs/config");
const verifyOtpServices = require('../verifyOtp/verifyOtp.services');
const constants = require('../../utils/constants')
const axios = require('axios');

const addRegistration = async (req, res) => {
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
    } = req.body;

    const fieldNames = [
      "companyId",
      "companyName",
      "panNumber",
      "panName",
      "firstName",
      "lastName",
      "email",
      "mobile",
      "street",
      "pincode",
      "country",
      "state",
      "city",
      "roleId",
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

    let iscountry = FUNC.checkIsValidId(country);
    let isState = FUNC.checkIsValidId(state);
    let isroleId = FUNC.checkIsValidId(roleId);

    if (saleInChargeId == "" || saleInChargeId == "" || !saleInChargeId) {
      saleInChargeId = null;
    }

    if (iscountry === "Invalid Mongo Object Id") {
      return {
        response: "Country Id is not valid",
      };
    }

    if (isState === "Invalid Mongo Object Id") {
      return {
        response: "State Id is not valid",
      };
    }

    if (isroleId === "Inavlid Mongo Object Id") {
      return {
        response: "Role Id is not valid",
      };
    }
    if (saleInChargeId !== null) {
      let issaleInChargeId = FUNC.checkIsValidId(saleInChargeId);
      if (issaleInChargeId === "Invalid Mongo Object Id") {
        return {
          response: "State Id is not valid",
        };
      }
    }
    const existingRegistrationWithEmail = await registration.findOne({ email });
    if (existingRegistrationWithEmail) {
      return {
        response: "Email already exists",
      };
    }
    const existingRegistrationWithMobile = await registration.findOne({
      mobile,
    });
    if (existingRegistrationWithMobile) {
      return {
        response: "Mobile number already exists",
      };
    };
    let comapnyIds = companyId;
    let mailConfig = await Smtp.findOne({ companyId: comapnyIds });
    if(!mailConfig){
      let id = Config.MAIL_CONFIG_ID ;
      mailConfig = await Smtp.findById(id);
    }
    let otpPhone = Math.floor(100000 + Math.random() * 900000);
    let otpEmail = Math.floor(100000 + Math.random() * 900000);
    let sendSmsOtp = await  FUNC.sendSMS(mobile,otpPhone);
    let sendEmailOtp = await FUNC.sendOtpOnEmail(email,otpEmail,mailConfig);
    console.log(sendSmsOtp,sendEmailOtp, "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
     // { type, typeName , companyId, otp}

     let request = {
    body :{  
      type:constants.OTP_FOR.Mail ,
      typeName: constants.OTP_TYPE.Reg,
      companyId,
      otp :otpEmail
    }
     }
    let saveOtpDataForEmail = await verifyOtpServices.sendEmailOtp(request);
    request = {
     body: 
      {
      type : constants.OTP_FOR.Phone,
      typeName : constants.OTP_TYPE.Reg,
      companyId,
      otp: otpPhone
    }
     }

    let saveOtpDataForPhone = await verifyOtpServices.sendEmailOtp(request);

    
    console.log("SMS Sent", saveOtpDataForEmail, "ppppppppppppppp", saveOtpDataForPhone, "llllllllllllllllllllll");
    // let mailOtpVarify = await axios.post(`${Config.BASE_URL}otp/verify-otp`, {
    //   otp :otpEmail,
    //   type:constants.OTP_FOR.Mail ,
    //   typeName: constants.OTP_TYPE.Reg,
    // });
    // let phoneOtpVarify = await axios.post(`${Config.BASE_URL}otp/verify-otp`, {
    //   otp :otpPhone,
    //   type:constants.OTP_FOR.Phone,
    //   typeName: constants.OTP_TYPE.Reg,
    // });
    // console.log(mailOtpVarify.data ,phoneOtpVarify.data);
  
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
    });
    let newRegistrationRes = await newRegistration.save();
    console.log(newRegistrationRes);
    let mailText = newRegistrationRes;
    let mailSubject = `New registration created successfully`;
    let smsUrl = await configCred.findOne({companyId : companyId});
    if(!smsUrl){
      smsUrl = await configCred.find();
    }
     if (newRegistrationRes) {
    //   let mailRes = await FUNC.commonEmailFunction(
    //     email,
    //     mailConfig,
    //     mailText,
    //     mailSubject
    //   );
      //console.log(mailRes, "==============================");
      return {
        response: `${mailSubject}`,
        data: newRegistration,
      };
    } else {
      return {
        response: `Registration Failed!`,
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllRegistration = async (req, res) => {
  try {
    // let getAllRegistartion = await registration.find();

    let getAllRegistartion = await registration.find()
     .populate('statusId', 'name')
     .populate('roleId', 'name')
     .exec();
    return {
      response: "All registrationData fetch",
      data: getAllRegistartion,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllRegistrationByCompany = async (req, res) => {
  try {
    const comapnyId = req.params.companyId;
    if (!comapnyId) {
      return {
        response: null,
        message: "Company Id not true",
      };
    }
    // const registrationData = await registration.find({companyId : comapnyId});

    let aggregrationRes = await registration.find({comapnyId : comapnyId})
    .populate('statusId', 'name')
    .populate('roleId', 'name')
    .exec();

    if (!aggregrationRes) {
      return {
        response: null,
        message: "Registration Data not found by this companyId",
      };
    } else {
      return {
        response: "Registration data found sucessfully",
        data: aggregrationRes,
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateRegistration = async (req, res) => {
  try {
    const { registrationId, statusId, remark , roleId } = req.body;
    let checkIsValidregistrationId = FUNC.checkIsValidId(registrationId);
    let checkIsValidstatusId = FUNC.checkIsValidId(statusId);
    let checkIsValidRoleId = FUNC.checkIsValidId(roleId);

    if (!checkIsValidregistrationId || !checkIsValidstatusId || !checkIsValidRoleId) {
      return {
        response: "Please pass valid registrationId or statusId or roleId",
      };
    };
    const updateRegistration = await registration.findOneAndUpdate(
      { _id: registrationId },
      {
        $set: {
          statusId: statusId,
          remark: remark,
          roleId : roleId
        },
      },
      { new: true }
    );
   
    
    console.log(updateRegistration , "<<<<<<<<<<<+++++++++>>>>>>>>>>>>>>>>>>>>>>>>")
    if (updateRegistration) {
      let registrationIds = new ObjectId(registrationId);
      let comapnyId = updateRegistration.companyId;
      let mailSubject = `Registration status change successfully`;
      let mailConfig = await Smtp.findOne({ companyId: comapnyId });
      let mailText = await registration.aggregate([
        {
          $match: {
            _id: registrationIds,
          },
        },
        {
          $lookup: {
            from: "status",
            localField: "statusId",
            foreignField: "_id",
            as: "statusName",
          },
        },
        {
          $project: {
            companyName: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            mobile: 1,
            street: 1,
            pincode: 1,
            statusName: { name: { $arrayElemAt: ["$statusName.name", 0] } }, // Projection for the 'name' field
          },
        },
      ]);
      ///console.log(regData[0].statusName, "?????????????????????????????????????????????","==========>>>>>>>>>>>>>>>>>>>");
      // let  { companyName, firstName, lastName, email, mobile, statusName : [{name}] } = regData[0];
      // console.log("companyName",companyName, "firstName", firstName, "lastName",lastName,"email", email, "mobile",mobile, "statusName",name)
      let mailSent = FUNC.commonEmailFunctionOnRegistrationUpdate(
        mailText[0].email,
        mailConfig,
        mailText,
        mailSubject
      );
      // console.log(statusData , "<<<===========" ,comapnyId )
      if (mailSent.responce) {
        console.log("Mail Sent ");
      }
      return {
        response: "Registration data updated sucessfully",
        data: updateRegistration
      };
    } else {
      return {
        response: "Registration data is not updated",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  addRegistration,
  getAllRegistration,
  getAllRegistrationByCompany,
  updateRegistration,
};
