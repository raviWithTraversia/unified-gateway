const bcryptjs = require("bcryptjs");
const { Config } = require("../../configs/config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const EventLog = require("../../models/Logs/EventLogs");
const PortalLog = require("../../models/Logs/PortalApiLogs");
const fs = require('fs');
const smsConfigCred = require('../../models/ConfigCredential');

const createToken = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, Config.SECRET_JWT);
    return token;
  } catch (error) {
    return error.message;
  }
};
const securePassword = async (password) => {
  try {
    const passwordhash = await bcryptjs.hash(password, 10);
    return passwordhash;
  } catch (error) {
    return error.message;
  }
};
// Function to send a password reset email
const sendPasswordResetEmail = async (recipientEmail,resetToken,mailConfig , user, baseUrl) => {
  // Create a Nodemailer transporter using your email service provider's SMTP settings
  const transporter = nodemailer.createTransport({
    host: mailConfig.host, 
    port: mailConfig.port, 
    secure: false, 
    auth: {
      user: mailConfig.userName,
      pass: mailConfig.password, 
    },
  });

  // Email content
  const mailOptions = {
    from:  mailConfig.emailFrom,
    to: recipientEmail,
    subject: "Password Reset Request",
    text: `Click the following link to reset your password:
             ${baseUrl}/auth/verifyToken?token=${resetToken}&userId=${user._id}`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    return {
      response : `Password reset email sent `,
      data : true
    }
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return {
      response : "Error sending password reset email:",
       data : error
    }
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

const checkIsValidId =  (Id) => {
  let validId = mongoose.isValidObjectId(Id);
  if (validId) {
    return "Valid Mongo Object Id";
  } else {
    return "Invalid Mongo Object Id";
  }
};


const removeWWWAndProtocol = async (url) => {
  // Remove "www" from the beginning (if it exists)
  const withoutWWW = url.replace(/^(https?:\/\/)?(www\.)?/, "");

  // Remove "http://" or "https://" from the beginning (if it exists)
  const withoutProtocol = withoutWWW.replace(/^(https?:\/\/)/, "");

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
const eventLogFunction = async (
  eventName,
  doerId,
  doerName,
  ipAddress,
  companyId,
  description
) => {
  try {
    const newEventLog = new EventLog({
      eventName,
      doerId,
      doerName,
      ipAddress,
      companyId,
      description
    });
    const storeLogs = await newEventLog.save();
    return "Event Log added successfully";
  } catch (error) {
    throw error;
  }
};

// Portal Log event save when trigger any action related to portal log....
const protalLogFunction = async (
  traceId,
  companyId,
  source,
  product,
  request,
  responce
) => {
  try {
    const newPortalLog = new PortalLog({
      traceId,
      companyId,
      source,
      product,
      request,
      responce,
    });
    const storeLogs = await newPortalLog.save();
    return "Portal Log added successfully";
  } catch (error) {
    throw error;
  }
};

const sendOtpOnEmail = async (recipientEmail, otp, smtpDetails) => {
  const transporter = nodemailer.createTransport({
    host: smtpDetails.host, // SMTP server hostname or IP address
    port: smtpDetails.port, // Port number for SMTP with STARTTLS
    secure: false, // Set to false when using STARTTLS
    auth: {
      user: smtpDetails.userName,
      pass: smtpDetails.password, // Verify the password for leading/trailing spaces
    },
  });

  // Email content
  const mailOptions = {
    from: smtpDetails.emailFrom,
    to: recipientEmail,
    subject: "OTP for New User Registration",
    text: `Your OTP for New Registartion: ${otp}`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${recipientEmail}`);
    return {
      responce: "OTP sent",
    };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

const accountSid = "your_account_sid";
const authToken = "your_auth_token";

//const client = new twilio(accountSid, authToken);

const sendOtpOnPhone = async (recipientPhone, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP for password reset is: ${otp}`,
      to: recipientPhone,
      from: "your_twilio_phone_number",
    });

    console.log(
      `OTP sent to ${recipientPhone} with message SID: ${message.sid}`
    );
  } catch (error) {
    console.error("Error sending OTP via SMS:", error);
    throw error;
  }
};

const commonEmailFunction = async (recipientEmail, smtpDetails, mailText,mailSubject) => {
  const { companyName,firstName, lastName, mobile, email, name } = mailText;
  console.log("================>>>>>>>>>>>>>>>>>>>",mailText, "====================================");
  const htmlTemplate = fs.readFileSync('./view/Account_Registration.html', 'utf8');
  const htmlContent = htmlTemplate.replace(/\${companyName}/g, companyName.companyName)
  .replace(/\${firstName}/g, firstName)
  .replace(/\${lastName}/g, lastName)
  .replace(/\${mobile}/g, mobile)
  .replace(/\${email}/g, email);
  const transporter = nodemailer.createTransport({
    host: smtpDetails.host, // SMTP server hostname or IP address
    port: smtpDetails.port, // Port number for SMTP with STARTTLS
    secure: false, // Set to false when using STARTTLS
    auth: {
      user: smtpDetails.userName,
      pass: smtpDetails.password, // Verify the password for leading/trailing spaces
    },
  });

  // Email content
  const mailOptions = {
    from: smtpDetails.emailFrom,
    to: recipientEmail,
    subject: `${mailSubject}`,
    html: htmlContent
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Mail sent to ${recipientEmail}`);
    return {
      responce: " Mail sent",
    };
  } catch (error) {
    console.error("Error sending Mail:", error);
    throw error;
  }
};

const commonEmailFunctionOnRegistrationUpdate = async (recipientEmail, smtpDetails, mailText,mailSubject) => {
  //console.log(mailText, "<<<<<<<<<<???????????????????????????????",recipientEmail);
  let  { companyName, firstName, lastName, email, mobile, statusName : [{name}] } = mailText[0];
  const htmlTemplate = fs.readFileSync('./view/Account_Registration.html', 'utf8');
  const htmlContent = htmlTemplate.replace(/\${companyName}/g, companyName)
  .replace(/\${firstName}/g, firstName)
  .replace(/\${lastName}/g, lastName)
  .replace(/\${mobile}/g, mobile)
  .replace(/\${email}/g, email);
  const transporter = nodemailer.createTransport({
    host: smtpDetails.host, 
    port: smtpDetails.port, 
    secure: false, 
    auth: {
      user: smtpDetails.userName,
      pass: smtpDetails.password, // Verify the password for leading/trailing spaces
    },
  });

  // Email content
  const mailOptions = {
    from: smtpDetails.emailFrom,
    to: recipientEmail,
    subject: `${mailSubject}`,
    html: htmlContent
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Mail sent to ${recipientEmail}`);
    return {
      responce: " Mail sent",
    };
  } catch (error) {
    console.error("Error sending Mail:", error);
    throw error;
  }
};

const sendSMS = async (mobileno, otp) => {
  try {
    let message = `Your OTP for authentication is:${otp} Kafila Hospitality & Travels Pvt. Ltd`;
    let url = `http://www.smsintegra.com/api/smsapi.aspx?uid=kafilatravels&pwd=19890&mobile=${encodeURIComponent(mobileno)}&msg=${encodeURIComponent(message)}&sid=KAFILA&type=0&entityid=1701157909411808398&tempid=1707170089574543263&dtNow=${encodeURIComponent(new Date().toLocaleString())}`;

      const response = await fetch(url);
      const strSMSResponseString = await response.text();

      if (strSMSResponseString.startsWith("100")) {
          return {
            response : `Sms sent to ${mobileno}`
          };
      } else {
          return false;
      }
  } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
  }
};

const sendPasswordResetEmailLink = async (recipientEmail,resetToken,mailConfig , user, password,baseUrl) => {
  // Create a Nodemailer transporter using your email service provider's SMTP settings
  const transporter = nodemailer.createTransport({
    host: mailConfig.host, 
    port: mailConfig.port, 
    secure: false, 
    auth: {
      user: mailConfig.userName,
      pass: mailConfig.password, 
    },
  });
  const htmlContent = `
  <p>Click the following link to reset your password: <a href="${baseUrl}/auth/verifyToken?token=${resetToken}&userId=${user._id}">${baseUrl}/auth/verifyToken?token=${resetToken}&userId=${user._id}</a></p>
    <p>Temporary Password :${password} </p> `;
  const mailOptions = {
    from: mailConfig.emailFrom,
    to: recipientEmail,
    subject: "Password Reset Request",
    text: `Click the following link to reset your password: ${baseUrl}/auth/verifyToken?token=${resetToken}&userId=${user._id}`,
    html: htmlContent, 
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    return {
      response : `Password reset email sent `,
      data : true
    }
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return {
      response : "Error sending password reset email:",
       data : error
    }
  }
};
const generateRandomPassword = (length)  => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
};



const sendNotificationByEmail=(mailConfig,DATA)=>{

  const data=DATA
  const html=`<br/><br/>

  <table style="border-top: 1px solid #c0c0c0; border-bottom: 1px solid #c0c0c0; background-color: #f0f0f0;" border="0" width="100%" cellpadding="4">
      <tbody>
          <tr>
              <td>&nbsp;</td>
          </tr>
          <tr>
              <td>&nbsp;</td>
              <td>
                  <table style="font-size: 13px; border: 1px solid #000000; background-color: #ffffff;" width="100%">
                      <tbody>
                          <tr>
                              <td colspan="3">
                                  <h1 style="text-align: center; font-size: 16px; font-weight: bold; background-color: #084886;
                                  color: #ffffff; padding: 2px; margin: 0px;">${data.subject}</h1>
                              </td>
                          </tr>
                          <tr>
                              <th style="text-align: left; font-size: 14px; font-weight: bold; background-color: #d7ebff; color: #004cba; padding: 2px; margin: 0px; border: 1px solid #e0e0e0;">Email Sender</th>
                              <td>:</td>
                              <td>${mailConfig[0].companyId.companyName}</td>
                          </tr>
                          <tr>
                              <td colspan="3">&nbsp;</td>
                          </tr>
                          <tr valign="top">
                              <th style="text-align: left; font-size: 14px; font-weight: bold; background-color: #d7ebff; color: #004cba; padding: 2px; margin: 0px; border: 1px solid #e0e0e0;">Itinerary</th>
                              <td>:</td>
                              <td>${data.options[0].Sectors[0].Departure.CityName} - ${data.options[0].Sectors[0].Arrival.CityName} <span>:</span>${data.options[0].Sectors[0].Departure.Date }</td>
                          </tr>
                          <tr>
                              <th style="text-align: left; font-size: 14px; font-weight: bold; background-color: #d7ebff; color: #004cba; padding: 2px; margin: 0px; border: 1px solid #e0e0e0;">Passenger(s)</th>
                              <td>:</td>
                              <td>
                              ${data.options[0].PriceBreakup[0].NoOfPassenger}       ${data.options[0].PriceBreakup[0].PassengerType}(s)  
                              </td>
                          </tr>
  
  
                          <tr>
                              <td colspan="3">&nbsp;</td>
                          </tr>
  
                              <tr>
                                  <td colspan="3">
                                      <h1 style="text-align: center; font-size: 16px; font-weight: bold; background-color: #084886;
                                      color: #ffffff; padding: 2px; margin: 0px;">${data.options[0].Sectors[0].Departure.CityName} - ${data.options[0].Sectors[0].Arrival.CityName} Options</h1>
                                  </td>
                              </tr>
                              <tr>
                                  <td colspan="3">
                                      <table style="font-size: 13px; border: 1px solid #a0a0a0;" width="100%">
                                          <tbody>
                                              <tr>
                                                  <th style="text-align: left; font-size: 13px; font-weight: bold; background-color: #d7ebff; color: #004cba; padding: 2px; margin: 0px; border: 1px solid #e0e0e0;" colspan="2">Flight</th>
                                                  <th style="text-align: left; font-size: 13px; font-weight: bold; background-color: #d7ebff; color: #004cba; padding: 2px; margin: 0px; border: 1px solid #e0e0e0;">Departure</th>
                                                  <th style="text-align: left; font-size: 13px; font-weight: bold; background-color: #d7ebff; color: #004cba; padding: 2px; margin: 0px; border: 1px solid #e0e0e0;">Arrival</th>
                                                  <th style="text-align: left; font-size: 13px; font-weight: bold; background-color: #d7ebff; color: #004cba; padding: 2px; margin: 0px; border: 1px solid #e0e0e0;">Duration</th>
                                                  <th style="text-align: left; font-size: 13px; font-weight: bold; background-color: #d7ebff; color: #004cba; padding: 2px; margin: 0px; border: 1px solid #e0e0e0;">Time between Flights</th>
                                                  <th style="text-align: right; font-size: 13px; font-weight: bold; background-color: #d7ebff; color: #004cba; padding: 2px; margin: 0px; border: 1px solid #e0e0e0;">Total Price</th>
                                                  <th style="text-align: right; font-size: 13px; font-weight: bold; background-color: #d7ebff; color: #004cba; padding: 2px; margin: 0px; border: 1px solid #e0e0e0;">Remarks</th>
                                                  <th style="text-align: left; font-size: 13px; font-weight: bold; background-color: #d7ebff; color: #004cba; padding: 2px; margin: 0px; border: 1px solid #e0e0e0;">Baggage Info</th>
                                                  <th style="text-align: left; font-size: 13px; font-weight: bold; background-color: #d7ebff; color: #004cba; padding: 2px; margin: 0px; border: 1px solid #e0e0e0;">HandBaggage</th>
                                              </tr>
                                                  <tr valign="top">
  
  
  
                                                      <tr>
  
                                                              <td rowspan="2">
                                                                  <img class="x_CToWUd" style="width: 80px;" alt="" border="0" data-imagetype="External"
                                                       src="https://www.digitravel.co.in/images/airlogos/6E.png" />
                                                              </td>
                                                              <td>${data.options[0].Sectors[0].AirlineName }</td>
  
                                                          <td><span class="x_aBn" tabindex="0"><span class="x_aQJ">${data.options[0].Sectors[0].Departure.Time }</span>   </span>${data.options[0].Sectors[0].Departure.Date }</td>
                                                          <td><span class="x_aBn" tabindex="0"><span class="x_aQJ">${data.options[0].Sectors[0].Arrival.Time }</span></span>  ${data.options[0].Sectors[0].Arrival.Date }</td>
                                                          <td>${data.options[0].Sectors[0].FlyingTime}</td>
                                                              <td>&nbsp;</td>
                                                              <td align="right">${data.options[0].TotalPrice} ${data.options[0].Currency}</td>
                                                              <td>&nbsp;<span style="padding: 1px; font-weight: bold;" title="Non-Refundable"><strong>Non-Refundable</strong></span></td>
                                                              
                                                      </tr>
                                                      <tr valign="top">
                                                          <td rowspan="2"><img class="x_CToWUd" style="width: 100px;" alt="" border="0" data-imagetype="External" /></td>
                                                          <td style="text-align: left; font-size: 12px; font-weight: normal; text-decoration: none; color: #084886;">${data.options[0].Sectors[0].FltNum }</td>
                                                          <td style="text-align: left; font-size: 12px; font-weight: normal; text-decoration: none; color: #084886;">${data.options[0].Sectors[0].Departure.CityName} (${data.options[0].Sectors[0].Departure.CityCode})<br />Terminal:${data.options[0].Sectors[0].Departure.Terminal}</td>
                                                          <td style="text-align: left; font-size: 12px; font-weight: normal; text-decoration: none; color: #084886;">${data.options[0].Sectors[0].Arrival.CityName} (${data.options[0].Sectors[0].Arrival.CityCode})<br />Terminal::${data.options[0].Sectors[0].Arrival.Terminal}</td>
                                                          <td>&nbsp;</td>
                                                          <td>&nbsp;</td>
                                                          <td>&nbsp;</td>
                                                          <td style="text-align: right; font-size: 12px; font-weight: normal; text-decoration: none; color: #084886;" rowspan="1"><strong>BaggageInfo : ${data.options[0].Sectors[0].BaggageInfo} </strong></td>
                                                           <td style="text-align: right; font-size: 12px; font-weight: normal; text-decoration: none; color: #084886;" rowspan="1"><strong>HandBaggage : ${data.options[0].Sectors[0].HandBaggage} </strong></td>

                                                      </tr>
                                                      <tr>
                                                          <th colspan="9"><hr /></th>
                                                      </tr>
                                                      <tr>
  
                                                              <td rowspan="2">
                                                                  <img class="x_CToWUd" style="width: 80px;" alt="" border="0" data-imagetype="External"
                                                       src="https://www.digitravel.co.in/images/airlogos/6E.png" />
                                                              </td>
                                                              <td>${data.options[0].Sectors[1].AirlineName }</td>
  
                                                          <td><span class="x_aBn" tabindex="0"><span class="x_aQJ">${data.options[0].Sectors[1].Departure.Time }  </span></span>${data.options[0].Sectors[1].Departure.Date }</td>
                                                          <td><span class="x_aBn" tabindex="0"><span class="x_aQJ">${data.options[0].Sectors[1].Arrival.Time }</span>   </span>${data.options[0].Sectors[1].Arrival.Date }</td>
                                                          <td>${data.options[0].Sectors[1].FlyingTime}</td>
                                                              <td>&nbsp;</td>
                                                              <td align="right"></td>
                                                              <td>&nbsp;<span style="padding: 1px; font-weight: bold;" title="Non-Refundable"><strong>&nbsp;</strong></span></td>
                                                      </tr>
                                                      <tr valign="top">
                                                          <td rowspan="2"><img class="x_CToWUd" style="width: 100px;" alt="" border="0" data-imagetype="External" /></td>
                                                          <td style="text-align: left; font-size: 12px; font-weight: normal; text-decoration: none; color: #084886;">${data.options[0].Sectors[1].FltNum }</td>
                                                          <td style="text-align: left; font-size: 12px; font-weight: normal; text-decoration: none; color: #084886;">${data.options[0].Sectors[1].Departure.CityName} (${data.options[0].Sectors[1].Departure.CityCode})<br />Terminal:${data.options[0].Sectors[1].Departure.Terminal}</td>
                                                          <td style="text-align: left; font-size: 12px; font-weight: normal; text-decoration: none; color: #084886;">${data.options[0].Sectors[1].Arrival.CityName} (${data.options[0].Sectors[1].Departure.CityCode})<br />Terminal:${data.options[0].Sectors[1].Arrival.Terminal}</td>
                                                          <td>&nbsp;</td>
                                                          <td>&nbsp;</td>
                                                          <td>&nbsp;</td>
                                                          <td style="text-align: right; font-size: 12px; font-weight: normal; text-decoration: none; color: #084886;" rowspan="1"><strong>BaggageInfo : ${data.options[0].Sectors[1].BaggageInfo} </strong></td>
                                                           <td style="text-align: right; font-size: 12px; font-weight: normal; text-decoration: none; color: #084886;" rowspan="1"><strong>HandBaggage : ${data.options[0].Sectors[1].HandBaggage} </strong></td>

                                                      </tr>
                                                      <tr>
                                                          <th colspan="9"><hr /></th>
                                                      </tr>
                                  </tr>
                              <!--//loop close-->
                          </tbody>
                      </table>
                  </td>
              </tr>
              <tr>
                  <td colspan="3">&nbsp;</td>
              </tr>
  
  
      </tbody>
  </table>
  <br />
  <br />Best Regards - Team Traversia Dev
  <br />
              </td>
  <td>&nbsp;</td>
          </tr>
      </tbody>
  </table>
  
  
  `

  const transporter = nodemailer.createTransport({
    host: mailConfig[0].host, 
    port: mailConfig[0].port, 
    secure: false, 
    auth: {
      user: mailConfig[0].userName,
      pass: mailConfig[0].password, 
    },
  });

  const mailOptions = {
    from:  mailConfig[0].emailFrom,
    to: data.to,
    subject:data.subject,
    cc: data.cc, // Add CC recipient
    bcc: data.bcc ,
    html: html
    
  };

  try{
    transporter.sendMail(mailOptions);
    return {
      response : `Send Email succefully `,
      data : true
    }

  }catch(error){
    return {
      response : "Error Sending Notification Email:",
       data : error
    }
  }

}



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
  sendOtpOnPhone,
  commonEmailFunction,
  commonEmailFunctionOnRegistrationUpdate,
  sendSMS,
  sendPasswordResetEmailLink,
  generateRandomPassword,
  sendNotificationByEmail
};
