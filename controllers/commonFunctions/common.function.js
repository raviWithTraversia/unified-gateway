const bcryptjs = require("bcryptjs");
const { Config } = require("../../configs/config");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const EventLog = require('../../models/Logs/EventLogs');
const PortalLog = require('../../models/Logs/PortalApiLogs');

const createToken = async (id) => {
    try {
       const token = await jwt.sign({_id:id},Config.SECRET_JWT);
       return token;
    } catch (error) {
        return error.message;
    }
 }
const securePassword = async (password) => {
    try {
        const passwordhash = await bcryptjs.hash(password, 10);
        return passwordhash;
    } catch (error) {
        return error.message;
    }
}


// Function to send a password reset email
const sendPasswordResetEmail = async (recipientEmail, resetToken) => {
    // Create a Nodemailer transporter using your email service provider's SMTP settings
    const transporter = nodemailer.createTransport({
      host: Config.HOST , // SMTP server hostname or IP address
      port: 587, // Port number for SMTP with STARTTLS
      secure: false, // Set to false when using STARTTLS
      auth: {
        user: Config.USER,
        pass: Config.PASS, // Verify the password for leading/trailing spaces
      },
    });
 
    // Email content
    const mailOptions = {
      from: Config.USER,
      to: recipientEmail,
      subject: 'Password Reset Request',
      text: `Click the following link to reset your password:
             http://your-app-url/reset-password?token=${resetToken}`,
    };

    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${recipientEmail}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };


  const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? (page - 1) * limit : 0;
    return { limit, offset };
  };
  const getPagingData = (Data, page, limit) => {
    const { count: totalItems, rows: data } = Data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, data, totalPages, currentPage };
  };
  const getPagingDataOfSp = async (Data, page, limit) => {
    let total = Data.length ? Data[0].Total : 0;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(total / limit);
    return { totalItems: total, data: Data, totalPages, currentPage };
  };

  const checkIsValidId = async(Id) => {
    let validId = mongoose.isValidObjectId(Id);
    if(validId){
      return "Valid Mongo Object Id"
    }else{
      return "Invalid Mongo Object Id"
    }
  }
 
  const  removeWWWAndProtocol = async(url) => {
    // Remove "www" from the beginning (if it exists)
    const withoutWWW = url.replace(/^(https?:\/\/)?(www\.)?/, '');

    // Remove "http://" or "https://" from the beginning (if it exists)
    const withoutProtocol = withoutWWW.replace(/^(https?:\/\/)/, '');

    return withoutProtocol;
};

const comparePassword = async (plainTextPassword, hashedPassword) => {
  try {
    return await bcryptjs.compare(plainTextPassword, hashedPassword);
  } catch (error) {
    throw error;
  }
};

// event Log  save when trigger any action related to event log....
const eventLogFunction = async(eventName , doerId , doerName , ipAddress , companyId) => {
  try {
    const newEventLog = new EventLog({
      eventName,
      doerId,
      doerName,
      ipAddress,
      companyId
  });
  const storeLogs = await newEventLog.save();
    return "Event Log added successfully";
  } catch (error) {
    throw error;
  }
}

// Portal Log event save when trigger any action related to portal log....
const protalLogFunction = async(traceId , companyId , source , product , request , responce) => {
  try {
    const newPortalLog = new PortalLog({
      traceId,
      companyId,
      source,
      product,
      request,
      responce
  });
  const storeLogs = await newPortalLog.save();
  return  "Portal Log added successfully";
  } catch (error) {
    throw error;
  }
}

const sendOtpOnEmail = async (recipientEmail, otp) => {

  const transporter = nodemailer.createTransport({
    host: Config.HOST, // SMTP server hostname or IP address
    port: 587, // Port number for SMTP with STARTTLS
    secure: false, // Set to false when using STARTTLS
    auth: {
      user: Config.USER,
      pass: Config.PASS, // Verify the password for leading/trailing spaces
    },
  });

  // Email content
  const mailOptions = {
    from: Config.USER,
    to: recipientEmail,
    subject: 'OTP for New User Registration',
    text: `Your OTP for New Registartion: ${otp}`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${recipientEmail}`);
    return {
      responce  : "OTP sent"
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}

const accountSid = 'your_account_sid';
const authToken = 'your_auth_token';

//const client = new twilio(accountSid, authToken);

const sendOtpOnPhone = async (recipientPhone, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP for password reset is: ${otp}`,
      to: recipientPhone, 
      from: 'your_twilio_phone_number', 
    });

    console.log(`OTP sent to ${recipientPhone} with message SID: ${message.sid}`);
  } catch (error) {
    console.error('Error sending OTP via SMS:', error);
    throw error;
  }
};


module.exports = {
    createToken,
    securePassword,
    sendPasswordResetEmail,
    getPagination,
    getPagingData,
    getPagingDataOfSp,
    checkIsValidId,
    removeWWWAndProtocol,
    comparePassword,
    eventLogFunction,
    protalLogFunction,
    sendOtpOnEmail,
    sendOtpOnPhone,
    sendOtpOnPhone
}