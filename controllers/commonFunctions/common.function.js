const bcryptjs = require("bcryptjs");
const { Config } = require("../../configs/config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const EventLog = require("../../models/Logs/EventLogs");
const PortalLog = require("../../models/Logs/PortalApiLogs");
const fs = require("fs");
const smsConfigCred = require("../../models/ConfigCredential");
const ledger = require("../../models/Ledger");
const AgentDiRecieve = require("../../models/AgentDiRecieve");
const Pdf = require("html-pdf");
const agentConfig = require("../../models/AgentConfig");
const CancelationBooking = require("../../models/booking/CancelationBooking");
const PassengerPreference = require("../../models/booking/PassengerPreference");
const BookingDetails = require("../../models/booking/BookingDetails");
const Railledger = require("../../models/Irctc/ledgerRail");
const RailBookingSchema = require("../../models/Irctc/bookingDetailsRail");
const moment = require("moment");
const {
  UserBindingInstance,
} = require("twilio/lib/rest/chat/v2/service/user/userBinding");
const {
  UserDefinedMessageInstance,
} = require("twilio/lib/rest/api/v2010/account/call/userDefinedMessage");
const transaction = require("../../models/transaction");
const railLogs = require("../../models/Irctc/railLogs");
const { ObjectId } = require("mongodb");
const { totalmem } = require("os");
const axios = require("axios");

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
const sendPasswordResetEmail = async (
  recipientEmail,
  resetToken,
  mailConfig,
  user,
  baseUrl
) => {
  // Create a Nodemailer transporter using your email service provider's SMTP settings
  const transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: false,
    auth: {
      user: mailConfig.userName,
      pass: mailConfig.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
    logger: true, // Enable logger
    debug: true, // Enable debug
  });

  // Email content
  const mailOptions = {
    from: mailConfig.emailFrom,
    to: recipientEmail,
    subject: "Password Reset Request",
    text: `Click the following link to reset your password:
             ${baseUrl}/auth/verifyToken?token=${resetToken}&userId=${user._id}`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    return {
      response: `Password reset email sent `,
      data: true,
    };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return {
      response: "Error sending password reset email:",
      data: error,
    };
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

const checkIsValidId = (Id) => {
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
      description,
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
    tls: {
      rejectUnauthorized: false,
    },
    logger: true, // Enable logger
    debug: true, // Enable debug
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

const commonEmailFunction = async (
  recipientEmail,
  smtpDetails,
  mailText,
  mailSubject
) => {
  const { companyName, firstName, lastName, mobile, email, name } = mailText;
  const htmlTemplate = fs.readFileSync(
    "./view/Account_Registration.html",
    "utf8"
  );
  const htmlContent = htmlTemplate
    .replace(/\${companyName}/g, companyName.companyName)
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
    tls: {
      rejectUnauthorized: false,
    },
    logger: true, // Enable logger
    debug: true, // Enable debug
  });

  // Email content
  const mailOptions = {
    from: smtpDetails.emailFrom,
    to: recipientEmail,
    subject: `${mailSubject}`,
    html: htmlContent,
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

const commonEmailFunctionOnRegistrationUpdate = async (
  recipientEmail,
  smtpDetails,
  mailText,
  mailSubject
) => {
  //console.log(mailText, "<<<<<<<<<<???????????????????????????????",recipientEmail);
  let {
    companyName,
    firstName,
    lastName,
    email,
    mobile,
    statusName: [{ name }],
  } = mailText[0];
  const htmlTemplate = fs.readFileSync(
    "./view/Account_Registration.html",
    "utf8"
  );
  const htmlContent = htmlTemplate
    .replace(/\${companyName}/g, companyName)
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
    tls: {
      rejectUnauthorized: false,
    },
    logger: true, // Enable logger
    debug: true, // Enable debug
  });

  // Email content
  const mailOptions = {
    from: smtpDetails.emailFrom,
    to: recipientEmail,
    subject: `${mailSubject}`,
    html: htmlContent,
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
    let url = `http://www.smsintegra.com/api/smsapi.aspx?uid=kafilatravels&pwd=19890&mobile=${encodeURIComponent(
      mobileno
    )}&msg=${encodeURIComponent(
      message
    )}&sid=KAFILA&type=0&entityid=1701157909411808398&tempid=1707170089574543263&dtNow=${encodeURIComponent(
      new Date().toLocaleString()
    )}`;

    const response = await fetch(url);
    const strSMSResponseString = await response.text();

    if (strSMSResponseString.startsWith("100")) {
      return {
        response: `Sms sent to ${mobileno}`,
      };
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
    return false;
  }
};
const sendTicketSms = async (mobileno, Sector, FName, FNo, Dur, Ddate) => {
  try {
    let message = `Flight option : Sector : ${Sector}, Airline: ${
      (FName, FNo)
    }, Departure Date: ${Ddate}, Travel Time: ${Dur} `;
    let url = `http://www.smsintegra.com/api/smsapi.aspx?uid=kafilatravels&pwd=19890&mobile=${encodeURIComponent(
      mobileno
    )}&msg=${encodeURIComponent(
      message
    )}&sid=KAFILA&type=0&entityid=1701157909411808398&tempid=1707170089574543263&dtNow=${encodeURIComponent(
      new Date().toLocaleString()
    )}`;

    const response = await fetch(url);
    const strSMSResponseString = await response.text();

    if (strSMSResponseString.startsWith("100")) {
      return {
        response: `Sms sent to ${mobileno}`,
      };
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
    return false;
  }
};

const sendPasswordResetEmailLink = async (
  recipientEmail,
  resetToken,
  mailConfig,
  user,
  password,
  baseUrl
) => {
  // Create a Nodemailer transporter using your email service provider's SMTP settings
  const transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: false,
    auth: {
      user: mailConfig.userName,
      pass: mailConfig.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
    logger: true, // Enable logger
    debug: true, // Enable debug
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
      response: `Password reset email sent `,
      data: true,
    };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return {
      response: "Error sending password reset email:",
      data: error,
    };
  }
};
const generateRandomPassword = (length) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
};

const sendNotificationByEmail = (mailConfig, DATA) => {
  const data1 = DATA;

  const html = data1.options
    .map(
      (data) =>
        `<br/><br/>

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
                                  color: #ffffff; padding: 2px; margin: 0px;">${data1.subject}</h1>
                              </td>
                          </tr>
                          <tr>
                              <th style="text-align: left; font-size: 14px; font-weight: bold; background-color: #d7ebff; color: #004cba; padding: 2px; margin: 0px; border: 1px solid #e0e0e0;">Email Sender</th>
                              <td>:</td>
                              <td>${mailConfig[0]?.companyId?.companyName}</td>
                          </tr>
                          <tr>
                              <td colspan="3">&nbsp;</td>
                          </tr>
                          <tr valign="top">
                              <th style="text-align: left; font-size: 14px; font-weight: bold; background-color: #d7ebff; color: #004cba; padding: 2px; margin: 0px; border: 1px solid #e0e0e0;">Itinerary</th>
                              <td>:</td>
                              <td>${data.Sectors[0].Departure.CityName} - ${data.Sectors[0].Arrival.CityName} <span>:</span>${data.Sectors[0].Departure.Date}</td>
                          </tr>
                          <tr>
                              <th style="text-align: left; font-size: 14px; font-weight: bold; background-color: #d7ebff; color: #004cba; padding: 2px; margin: 0px; border: 1px solid #e0e0e0;">Passenger(s)</th>
                              <td>:</td>
                              <td>
                              ${data.PriceBreakup[0].NoOfPassenger}       ${data.PriceBreakup[0].PassengerType}(s)  
                              </td>
                          </tr>
  
  
                          <tr>
                              <td colspan="3">&nbsp;</td>
                          </tr>
  
                              <tr>
                                  <td colspan="3">
                                      <h1 style="text-align: center; font-size: 16px; font-weight: bold; background-color: #084886;
                                      color: #ffffff; padding: 2px; margin: 0px;">${data.Sectors[0].Departure.CityName} - ${data.Sectors[0].Arrival.CityName} Options</h1>
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
                                                       src="${data?.Sectors[0]?.airlineLogo}" />
                                                              </td>
                                                              <td>${data.Sectors[0].AirlineName}</td>
  
                                                          <td><span class="x_aBn" tabindex="0"><span class="x_aQJ">${data.Sectors[0].Departure.Time}</span>   </span>${data.Sectors[0].Departure.Date}</td>
                                                          <td><span class="x_aBn" tabindex="0"><span class="x_aQJ">${data.Sectors[0].Arrival.Time}</span></span>  ${data.Sectors[0].Arrival.Date}</td>
                                                          <td>${data.Sectors[0].FlyingTime}</td>
                                                              <td>&nbsp;</td>
                                                              <td align="right">${data.TotalPrice} ${data.Currency}</td>
                                                              <td>&nbsp;<span style="padding: 1px; font-weight: bold;" title="Non-Refundable"><strong>Non-Refundable</strong></span></td>
                                                              
                                                      </tr>
                                                      <tr valign="top">
                                                          <td rowspan="2"><img class="x_CToWUd" style="width: 100px;" alt="" border="0" data-imagetype="External" /></td>
                                                          <td style="text-align: left; font-size: 12px; font-weight: normal; text-decoration: none; color: #084886;">${data.Sectors[0].FltNum}</td>
                                                          <td style="text-align: left; font-size: 12px; font-weight: normal; text-decoration: none; color: #084886;">${data.Sectors[0].Departure.CityName} (${data.Sectors[0].Departure.CityCode})<br />Terminal:${data.Sectors[0].Departure.Terminal}</td>
                                                          <td style="text-align: left; font-size: 12px; font-weight: normal; text-decoration: none; color: #084886;">${data.Sectors[0].Arrival.CityName} (${data.Sectors[0].Arrival.CityCode})<br />Terminal::${data.Sectors[0].Arrival.Terminal}</td>
                                                          <td>&nbsp;</td>
                                                          <td>&nbsp;</td>
                                                          <td>&nbsp;</td>
                                                          <td style="text-align: right; font-size: 12px; font-weight: normal; text-decoration: none; color: #084886;" rowspan="1"><strong>BaggageInfo : ${data.Sectors[0].BaggageInfo} </strong></td>
                                                           <td style="text-align: right; font-size: 12px; font-weight: normal; text-decoration: none; color: #084886;" rowspan="1"><strong>HandBaggage : ${data.Sectors[0].HandBaggage} </strong></td>

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
  <br />Best Regards - Team Kafila  
  <br />
              </td>
  <td>&nbsp;</td>
          </tr>
      </tbody>
  </table>
  
  
  `
    )
    .join("");

  const transporter = nodemailer.createTransport({
    host: mailConfig[0].host,
    port: mailConfig[0].port,
    secure: false,
    auth: {
      user: mailConfig[0].userName,
      pass: mailConfig[0].password,
    },
    tls: {
      rejectUnauthorized: false,
    },
    logger: true, // Enable logger
    debug: true, // Enable debug
  });

  const mailOptions = {
    from: mailConfig[0].emailFrom,
    to: data1.to,
    subject: data1.subject,
    cc: data1.cc, // Add CC recipient
    bcc: data1.bcc,
    html: html,
  };

  try {
    transporter.sendMail(mailOptions);
    return {
      response: `Send Email succefully `,
      data: true,
    };
  } catch (error) {
    return {
      response: "Error Sending Notification Email:",
      data: error,
    };
  }
};

const sendCardDetailOnMail = async (
  mailConfig,
  htmlData,
  email,
  subject,
  cartId,
  status,
  prdouctInfo
) => {
  const axios = require("axios"); // You need axios to fetch the external CSS
  const pdf = require("html-pdf");
  var style =
    prdouctInfo == "Rail"
      ? ` <style>
  /* General Resets */
  * {
    box-sizing: border-box;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  /* Table Styling */
  .rail-cart-common-table {
    width: 100%;
    margin-bottom: 20px;
    border: 1px solid #dee2e6;
  }

  .rail-cart-common-table td,
  .rail-cart-common-table th {
    padding: 5px;
    text-align: left;
    border: 1px solid #dee2e6;
    color: #222;
  }

  /* Typography */
  .font-size-10Pixel {
    font-size: 10px;
  }

  .font-size-12Pixel {
    font-size: 12px;
  }

  .fw-semibold {
    font-weight: 600;
  }

  /* Spacing */
  .mb-1 {
    margin-bottom: 0.25rem;
  }

  .mb-2 {
    margin-bottom: 0.5rem;
  }

  .pl-0 {
    padding-left: 0 !important;
  }

  .pr-0 {
    padding-right: 0 !important;
  }

  /* Layout */
  .d-flex {
    display: flex;
  }

  .justify-content-end {
    justify-content: flex-end;
  }

  /* Custom Cards */
  .customized-card-header {
    background-color: #f8f9fa;
    padding: 10px;
    font-weight: bold;
    color: #6c757d;
  }

  /* Responsive Adjustments */
  @media screen and (max-width: 768px) {
    .rail-cart-common-table td,
    .rail-cart-common-table th {
      font-size: 10px;
    }

    .font-size-12Pixel {
      font-size: 10px;
    }
  }
    .row {
    display: flex;
    flex-wrap: wrap; /* Ensure content wraps if needed */
    align-items: center;
    justify-content: space-between; /* Distribute space evenly */
    width: 100%;
  }

  .col-lg-5,
  .col-lg-2 {
    flex: 1; /* Allow each column to take equal space */
    max-width: 33%; /* Ensure no column exceeds 33% width */
    text-align: center; /* Center align content */
  }

  .d-flex {
    display: flex;
    align-items: center;
  }

  .justify-content-end {
    justify-content: flex-end;
  }

  .fw-semibold {
    font-weight: 600;
  }

  .text-decoration-underline {
    text-decoration: underline;
  }

  .my-auto {
    margin: auto 0;
  }

  .pl-2 {
    padding-left: 0.5rem;
  }

  .mr-3 {
    margin-right: 1rem;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Adjust for smaller screens */
  @media (max-width: 768px) {
    .col-lg-5,
    .col-lg-2 {
      flex: 1 0 100%; /* Each column takes full width */
      max-width: 100%; /* Ensure no column exceeds 100% width */
      text-align: left; /* Align text to the left for smaller screens */
    }

    .row {
      flex-direction: column; /* Stack elements on smaller screens */
    }

    .justify-content-end {
      justify-content: center; /* Center align for smaller screens */
    }

    .text-center {
      text-align: center;
    }
  }
</style>`
      : ` <style>
        #export-cart-pdf .px-0 {
            padding-left: 0;
            padding-right: 0
        }

        #export-cart-pdf .mat-mdc-card {
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2)
        }

        #export-cart-pdf .card {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            margin-bottom: 1rem
        }

        #export-cart-pdf .card-header {
            margin-bottom: 0;
        }

        #export-cart-pdf .customized-card-header {
            background-color: #c0c0c085;
            padding: 0px 0 1px px;
            margin-bottom: 10px;
        }

        #export-cart-pdf .font-size-15Pixel {
            font-size: 15px
        }

        #export-cart-pdf .font-weight-bold {
            font-weight: 700
        }

        #export-cart-pdf .mb-0 {
            margin-bottom: 0
        }

        #export-cart-pdf .mb-1 {
            margin-bottom: 0.25rem
        }

        #export-cart-pdf .mt-2 {
            margin-top: 0.5rem
        }

        #export-cart-pdf .mt-3 {
            margin-top: 1rem
        }

        #export-cart-pdf .d-flex {
            display: flex !important
        }

        #export-cart-pdf .d-block {
            display: block !important
        }

        #export-cart-pdf .text-right {
            text-align: right !important
        }

        #export-cart-pdf .text-center {
            text-align: center !important
        }

        #export-cart-pdf .pl-0 {
            padding-left: 0 !important
        }

        #export-cart-pdf .pr-1 {
            padding-right: 0.25rem !important
        }

        #export-cart-pdf .px-1 {
            padding-left: 0.25rem !important;
            padding-right: 0.25rem !important
        }

        #export-cart-pdf .table {
            width: 100%;
            margin-bottom: 1rem;
            color: #212529;
            border-collapse: collapse
        }

        #export-cart-pdf .table-bordered {
            border: 1px solid #dee2e6
        }

        #export-cart-pdf .table-striped tbody tr:nth-of-type(odd) {
            background-color: rgba(0, 0, 0, .05)
        }

        #export-cart-pdf .rounded {
            border-radius: 0.25rem
        }

        #export-cart-pdf .shadow-lg {
            box-shadow: 0 1rem 3rem rgba(0, 0, 0, .175) !important
        }

        #export-cart-pdf .custom-vertical-line {
            border-left: 2px solid #dee2e6;
            height: 100%;
            margin: 0 0.5rem
        }

        #export-cart-pdf .custom-hr-line {
            border-top: 2px solid #dee2e6;
            width: 100%;
            margin: 0.5rem 0
        }

        #export-cart-pdf .customized-grey-color {
            color: #6c757d
        }

        .customized-card-header {
            color:#0e0d0dde; /* Custom text color */
            padding: 15px; /* Custom padding */
        }

        .customized-card-header h6 {
            font-size: 1rem; /* Custom font size */
            margin: 0; /* Remove default margin */
        }

        /* Additional custom styles */
        .card-header {
            border-radius: 0.25rem 0.25rem 0 0; /* Custom border radius */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Custom box shadow */
        }

        /* Style for h6 if necessary */
        .card-header h6 {
            font-family: 'Arial', sans-serif; /* Custom font family */
            color:#0e0d0dde; /* Custom text color */
        }
            .airlineLogo{
    height: 50px;
}


    </style>`;
  try {
    // Fetch the Bootstrap CSS

    // Create the HTML content with inline Bootstrap CSS
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  
${style}
         </head>
<body>
  <div class="container">
  ${htmlData}
  </div>
</body>
</html>`;

    // Create the PDF from the HTML content
    const emailPdfBuffer = await new Promise((resolve, reject) => {
      pdf.create(html).toBuffer((err, buffer) => {
        if (err) return reject(err);
        resolve(buffer);
      });
    });

    const transporter = nodemailer.createTransport({
      host: mailConfig[0].host,
      port: mailConfig[0].port,
      secure: false,
      auth: {
        user: mailConfig[0].userName,
        pass: mailConfig[0].password,
      },
      tls: {
        rejectUnauthorized: false,
      },
      logger: true, // Enable logger
      debug: true, // Enable debug
    });

    const mailOptions = {
      from: mailConfig[0].emailFrom,
      to: email,
      subject: `Booking Detail-${cartId} ${status}`,
      cc: "", // Add CC recipient
      bcc: "",
      html: html,
      attachments: [
        {
          filename: `${cartId}.pdf`,
          content: emailPdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return {
      response: "Email sent successfully",
      data: true,
    };
  } catch (error) {
    return {
      response: "Error Sending Notification Email",
      data: error.message,
    };
  }
};

// Don't forget to import necessary modules

const recieveDI = async (
  configData,
  findUser,
  product,
  amount,
  transactionBy,
  txnid
) => {
  try {
    console.log(configData.diSetupIds, "jksds");
    configData.diSetupIds.diSetupIds =
      await configData.diSetupIds.diSetupIds.filter(
        (diSetup) =>
          diSetup.status === true &&
          // diSetup.companyId.toString() === findUser.company_ID.toString() &&
          new Date() >= new Date(diSetup.validFromDate) &&
          new Date() <= new Date(diSetup.validToDate)
      );
    // console.log(configData?.diSetupIds?.diSetupIds,"hjshsah");
    let slabOptions = configData?.diSetupIds?.diSetupIds;
    let bonusAmount = 0;
    let isMultipleSlab = false;
    let slabBreakups = [];
    const minAmount = Number(slabOptions[slabOptions.length - 1]?.minAmount);
    const amountNumber = Number(amount);
    // console.log(minAmount < amountNumber, "sjkjks");
    // console.log(slabOptions, minAmount, amountNumber, "slabOptions111");
    if (minAmount < amountNumber) {
      bonusAmount =
        (parseInt(slabOptions[slabOptions.length - 1]?.diPersentage) / 100) *
        amount;
      bonusAmount = await priceRoundOffNumberValues(bonusAmount);
      slabBreakups.push(slabOptions[slabOptions.length - 1]);
      // console.log(bonusAmount, "bonusAmount1");
    } else {
      for (let i = 0; i < slabOptions.length; i++) {
        if (!isMultipleSlab) {
          if (slabOptions[i].minAmount == amount) {
            bonusAmount =
              (parseInt(slabOptions[i].diPersentage) / 100) * amount;
            slabBreakups.push(slabOptions[i]);
            break;
          }
        }
        if (slabOptions[i].minAmount > amount) {
          isMultipleSlab = true;
          let mainAmountBonus =
            ((parseInt(slabOptions[i - 1]?.diPersentage) || 0) / 100) *
            parseInt(slabOptions[i - 1]?.minAmount || 0);
          let restAmount = amount - slabOptions[i - 1]?.minAmount || 0;
          let restAmountBonus =
            ((parseInt(slabOptions[i]?.diPersentage) || 0) / 100) * restAmount;
          bonusAmount = mainAmountBonus + restAmountBonus;

          console.log(
            bonusAmount,
            mainAmountBonus,
            restAmountBonus,
            "bonusAmount2"
          );
          if (bonusAmount > 0) {
            if (!slabOptions[i - 1]) {
              slabBreakups.push(slabOptions[i]);
            } else {
              slabBreakups.push(slabOptions[i - 1], slabOptions[i]);
            }
          }
          break;
        }
      }
    }
    // console.log(bonusAmount, "bonusAmount11");
    const ADRdata = new AgentDiRecieve({
      userId: findUser._id,
      companyId: findUser.company_ID,
      amountDeposit: amount,
      diAmount: bonusAmount,
      slabBreakups: slabBreakups,
    });
    // console.log(slabBreakups, "slabBreakups1");

    if (slabBreakups.length) {
      await ADRdata.save();
      const ledgerIds = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
      if (product === "Rail") {
        configData.maxRailCredit += parseInt(bonusAmount);
        runningAmount = await priceRoundOffNumberValues(
          configData.maxRailCredit
        );
      }
      if (product === "Flight") {
        configData.maxcreditLimit += parseInt(bonusAmount);
        runningAmount = await priceRoundOffNumberValues(
          configData.maxcreditLimit
        );
      }
      await configData.save();
      // console.log({
      //   userId: findUser._id,
      //   companyId: findUser.company_ID,
      //   ledgerId: ledgerIds,
      //   transactionAmount: bonusAmount,
      //   currencyType: "INR",
      //   fop: "CREDIT",
      //   transactionType: "CREDIT",
      //   runningAmount,
      //   remarks: `DI against ${amount} deposit.`,
      //   transactionBy,
      //   product,
      // });
      // return false;

      await ledger.create({
        userId: findUser._id,
        companyId: findUser.company_ID,
        ledgerId: ledgerIds,
        transactionId: txnid ?? null,
        transactionAmount: parseInt(bonusAmount),
        currencyType: "INR",
        fop: "CREDIT",
        transactionType: "CREDIT",
        runningAmount,
        remarks: `DI against ${amount} deposit.`,
        transactionBy,
        product,
      });
    }
    // console.log(bonusAmount, "bonusAmount112");
    return bonusAmount;
  } catch (error) {
    return null;
  }
};

const createLeadger = async (
  getuserDetails,
  item,
  currencyType,
  fop,
  transactionType,
  runningAmount,
  remarks
) => {
  try {
    await ledger.create({
      userId: getuserDetails._id,
      companyId: getuserDetails.company_ID._id,
      ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
      transactionAmount:
        item?.offeredPrice +
        item?.totalMealPrice +
        item?.totalBaggagePrice +
        item?.totalSeatPrice,
      currencyType: currencyType,
      fop: fop,
      transactionType: transactionType,
      runningAmount: runningAmount,
      remarks: remarks,
      transactionBy: getuserDetails._id,
      cartId: item?.BookingId,
    });
  } catch (error) {
    return {
      IsSucess: false,
      response: "Error creating leadger:",
      error,
    };
  }
};

const getTdsAndDsicount = async (ItineraryPriceCheckResponses) => {
  let ldgrtds = 0;
  let ldgrdiscount = 0;
  for (let ipb of ItineraryPriceCheckResponses) {
    let pricebrkup = ipb.PriceBreakup;
    if (pricebrkup) {
      for (let pb of pricebrkup) {
        let totalPassenger = pb.NoOfPassenger;
        let ComBreakup = pb.CommercialBreakup;
        if (ComBreakup) {
          for (let cbp of ComBreakup) {
            if (cbp.CommercialType == "Discount") {
              let tdp = Math.round(cbp.Amount) * totalPassenger;
              ldgrdiscount += tdp;
            }
            // if (cbp.CommercialType == "TDS") {
            //   let ttdsp = Math.round(cbp.Amount) * totalPassenger;
            //   ldgrtds += ttdsp;
            // }
          }
        }
      }
    }
  }
  ldgrtds = Math.round(ldgrdiscount * 0.02);
  return { ldgrtds, ldgrdiscount };
};

const calculateOfferedPricePaxWise = async (iternayObj) => {
  let returnCalculatedOfferedPrice = 0;
  offerPricePlusInAmount = (plusKeyName) => {
    let returnBoolean = false;
    switch (plusKeyName) {
      case "TDS":
        returnBoolean = true;
        break;
      case "BookingFees":
        returnBoolean = true;
        break;
      case "ServiceFees":
        returnBoolean = true;
        break;
      case "GST":
        returnBoolean = true;
        break;
      case "Markup":
        returnBoolean = true;
        break;
      case "otherTax":
        returnBoolean = true;
        break;
      case "FixedBookingFees":
        returnBoolean = true;
        break;
      case "FixedServiceFees":
        returnBoolean = true;
        break;

      default:
        returnBoolean = false;
        break;
    }
    return returnBoolean;
  };
  offerPriceMinusInAmount = (plusKeyName) => {
    let returnBoolean = false;
    switch (plusKeyName) {
      case "Discount":
        returnBoolean = true;
        break;
      case "SegmentKickback":
        returnBoolean = true;
        break;
      case "Incentive":
        returnBoolean = true;
        break;
      case "PLB":
        returnBoolean = true;
        break;

      default:
        returnBoolean = false;
        break;
    }
    return returnBoolean;
  };

  iternayObj.getCommercialArray?.forEach((priceBreakupElement) => {
    let {
      PassengerType,
      NoOfPassenger,
      CommercialBreakup,
      BaseFare,
      Tax,
      TaxBreakup,
    } = priceBreakupElement;
    if (PassengerType == iternayObj.PaxType) {
      returnCalculatedOfferedPrice += Number(BaseFare);
      returnCalculatedOfferedPrice += Number(Tax); //* NoOfPassenger;
      // TaxBreakup?.forEach((taxBreakup) => {
      //   let { TaxType, Amount } = taxBreakup;
      //   if (TaxType) returnCalculatedOfferedPrice += Number(Amount); // * NoOfPassenger;
      // });
      CommercialBreakup?.forEach((commercialBreakup) => {
        let { CommercialType, Amount } = commercialBreakup;
        if (offerPriceMinusInAmount(CommercialType))
          returnCalculatedOfferedPrice -= Number(Amount); //* NoOfPassenger;
        else if (offerPricePlusInAmount(CommercialType))
          returnCalculatedOfferedPrice += Number(Amount); //* NoOfPassenger;
      });
    }
  });
  return returnCalculatedOfferedPrice;
};

const getTicketNumberBySector = async (ticketDetails, sector) => {
  const [sectorSrc, sectorDes] = sector.split(" ");
  console.log(sectorSrc, sectorDes, "sectorSrc sectorDes");
  const matchingTickets = ticketDetails.filter(
    (ticket) => ticket.src === sectorSrc && ticket.des === sectorDes
  );
  return matchingTickets.map((ticket) => ticket.ticketNumber);
};

const priceRoundOffNumberValues = async (numberValue) => {
  if (isNaN(numberValue)) numberValue = 0;
  const integerPart = Math.floor(numberValue);
  const fractionalPart = numberValue - integerPart;
  const result =
    fractionalPart >= 0.5 ? Math.ceil(numberValue) : Math.floor(numberValue);

  return Number(result.toFixed(2));
};

const RefundedCommonFunction = async (
  cancelationBookingsData,
  refundHistory
) => {
  try {
    let responseMessage = "Cancellation Data Not Found";

    for (const refund of refundHistory) {
      const matchingBooking = cancelationBookingsData.find(
        (booking) => booking.bookingId === refund.BookingId
      );
      if (!matchingBooking) continue;

      const bookingDetails = await BookingDetails.findOne({
        providerBookingId: matchingBooking.bookingId,
      });

      if (!bookingDetails) continue;

      // Handle Refund and Update Booking
      // if (!matchingBooking.isRefund && refund.IsRefunded) {
      //   await BookingDetails.findByIdAndUpdate(bookingDetails._id, {
      //     $set: { isRefund: true },
      //   });

      //   if (refund.CType === "PARTIAL") {
      //     for (const cpassenger of refund.CSector[0]?.CPax || []) {
      //       await PassengerPreference.findOneAndUpdate(
      //         {
      //           bookingId: bookingDetails.bookingId,
      //           "Passengers.FName": cpassenger.FName,
      //           "Passengers.LName": cpassenger.lName,
      //         },
      //         { $set: { "Passengers.$.Status": "CANCELLED" } }
      //       );
      //     }
      //   } else {
      //     await PassengerPreference.updateOne(
      //       { bookingId: bookingDetails.bookingId },
      //       { $set: { "Passengers.$[].Status": "CANCELLED" } }
      //     );
      //   }

      //   const agentConfigData = await agentConfig.findOne({
      //     userId: matchingBooking.userId,
      //   });

      //   const ledgerId = `LG${Math.floor(100000 + Math.random() * 900000)}`;
      //   const updatedMaxCredit =
      //     agentConfigData.maxcreditLimit + refund.RefundableAmount;

      //   await ledger.create({
      //     userId: agentConfigData.userId,
      //     companyId: agentConfigData.companyId,
      //     ledgerId,
      //     cartId: matchingBooking.bookingId,
      //     transactionAmount: refund.RefundableAmount,
      //     currencyType: "INR",
      //     fop: "CREDIT",
      //     transactionType: "CREDIT",
      //     runningAmount: updatedMaxCredit,
      //     remarks: "Cancellation Amount Added Into Your Account.",
      //     transactionBy: matchingBooking.userId,
      //   });

      //   await agentConfig.findByIdAndUpdate(agentConfigData._id, {
      //     $set: { maxcreditLimit: updatedMaxCredit },
      //   });

      //   await CancelationBooking.findOneAndUpdate(
      //     { bookingId: refund.BookingId },
      //     {
      //       $set: {
      //         fare: refund.Fare,
      //         AirlineCancellationFee: refund.AirlineCancelFee,
      //         AirlineRefund: refund.RefundableAmount,
      //         ServiceFee: refund.CancelServiceCharge,
      //         RefundableAmt: refund.RefundableAmount,
      //         isRefund: true,
      //         calcelationStatus: "REFUNDED",
      //       },
      //     },
      //     { new: true }
      //   );

      //   responseMessage = "Cancellation processed and refund issued.";

      // }
      // console.log(refund)
      if (!refund?.IsCancelled && !refund.IsRefunded) {
        const isPartialCancellation = refund.CType === "PARTIAL";
        // console.log(isPartialCancellation)

        if (isPartialCancellation) {
          for (const cpassenger of refund.CSector[0]?.CPax || []) {
            await PassengerPreference.findOneAndUpdate(
              {
                bookingId: bookingDetails.bookingId,
                "Passengers.FName": cpassenger.FName,
                "Passengers.LName": cpassenger.lName,
              },
              { $set: { "Passengers.$.Status": "CANCELLED" } },
              { new: true }
            );
          }

          const allCancelled = await PassengerPreference.findOne({
            bookingId: bookingDetails.bookingId,
            "Passengers.Status": "CANCELLATION PENDING",
          });

          const newStatus = allCancelled
            ? "CANCELLATION PENDING"
            : "PARTIALLY CONFIRMED";
          console.log(newStatus, "newStatus");
          await BookingDetails.findOneAndUpdate(
            { providerBookingId: matchingBooking.bookingId },
            { $set: { bookingStatus: newStatus } },
            { new: true }
          );

          const cancelationbookignsData = await CancelationBooking.findOne({
            providerBookingId: matchingBooking.bookingId,
          });
          let filter = {};
          if (cancelationbookignsData.traceId != null) {
            filter = {
              traceId: refund.TransId,
              calcelationStatus: { $nin: ["CANCEL", "REFUNDED"] }, // Corrected $in to $nin
            };
          } else {
            filter = {
              bookingId: matchingBooking.bookingId,
              calcelationStatus: { $nin: ["CANCEL", "REFUNDED"] }, // Corrected $in to $nin
            };
          }

          await CancelationBooking.findOneAndUpdate(
            filter,
            {
              $set: {
                fare: refund.Fare,
                traceId: refund.TransId,
                AirlineCancellationFee: refund.AirlineCancelFee,
                AirlineRefund: refund.RefundableAmount,
                ServiceFee: refund.CancelServiceCharge,
                RefundableAmt: refund.RefundableAmount,
                isRefund: false,
                calcelationStatus: "CANCEL",
              },
            },
            { new: true } // Returns the updated document
          );
        } else {
          // console.log("djdieieie")
          await BookingDetails.findOneAndUpdate(
            { providerBookingId: matchingBooking.bookingId },
            { $set: { bookingStatus: "CANCELLED" } },
            { new: true }
          );

          await PassengerPreference.updateOne(
            { bookingId: bookingDetails.bookingId },
            { $set: { "Passengers.$[].Status": "CANCELLED" } }
          );
          const cancelationbookignsData = await CancelationBooking.findOne({
            providerBookingId: matchingBooking.bookingId,
          });

          let filter = {};
          if (cancelationbookignsData.traceId != null) {
            filter = {
              traceId: refund.TransId,
              calcelationStatus: { $nin: ["CANCEL", "REFUNDED"] }, // Corrected $in to $nin
            };
          } else {
            filter = {
              bookingId: matchingBooking.bookingId,
              calcelationStatus: { $nin: ["CANCEL", "REFUNDED"] }, // Corrected $in to $nin
            };
          }

          await CancelationBooking.findOneAndUpdate(
            filter,
            {
              $set: {
                fare: refund.Fare,
                traceId: refund.TransId,
                AirlineCancellationFee: refund.AirlineCancelFee,
                AirlineRefund: refund.RefundableAmount,
                ServiceFee: refund.CancelServiceCharge,
                RefundableAmt: refund.RefundableAmount,
                isRefund: false,
                calcelationStatus: "CANCEL",
              },
            },
            { new: true } // Returns the updated document
          );
        }

        responseMessage = "Cancellation status updated successfully.";
      }
    }

    return { response: responseMessage };
  } catch (error) {
    console.error("Error in RefundedCommonFunction:", error);
    throw error;
  }
};

const RailBookingCommonMethod = async (
  userId,
  amount,
  companyId,
  bookingId,
  paymentMethodType,
  commercialBreakup,
  jClass
) => {
  try {
    if (
      paymentMethodType !== "Wallet" &&
      paymentMethodType !== "PaymentGateway"
    ) {
      throw new Error("Unsupported payment method.");
    }

    if (paymentMethodType === "PaymentGateway") {
      return { response: "Cart Created Succefully." };
    }

    // Retrieve agent configuration
    const getAgentConfig = await agentConfig
      .findOne({ userId: userId })
      .populate("RailcommercialPlanIds");

    if (!getAgentConfig) {
      throw new Error("Agent configuration not found.");
    }

    let agentCommercialMinus = {};
    if (jClass === "SL" || jClass === "2S") {
      agentCommercialMinus = {
        Agent_service_charge:
          getAgentConfig.RailcommercialPlanIds?.Agent_service_charge?.sleepar ||
          0,
        pgCharges:
          commercialBreakup?.PG_charges || commercialBreakup?.pgCharges,
      };
    } else {
      agentCommercialMinus = {
        Agent_service_charge:
          getAgentConfig.RailcommercialPlanIds?.Agent_service_charge
            ?.acCharge || 0,
        pgCharges:
          commercialBreakup?.PG_charges || commercialBreakup?.pgCharges,
      };
    }

    const total = Object.values(agentCommercialMinus).reduce(
      (sum, value) => sum + (value || 0),
      0
    );

    // Check credit limit
    const currentBalance = getAgentConfig?.railCashBalance || 0;
    const checkCreditLimit = currentBalance - amount;

    // Calculate ticket amount
    const ticketAmount = Math.ceil(amount - total);
    if (currentBalance < ticketAmount) {
      return { response: "Your Balance is not sufficient." };
    }
    const newBalance = Math.round(currentBalance - ticketAmount);

    // Update balance in DB
    const updatedAgentConfig = await agentConfig.findOneAndUpdate(
      { userId: userId },
      { $set: { railCashBalance: newBalance } },
      { new: true }
    );

    if (!updatedAgentConfig) {
      throw new Error("Failed to update agent balance.");
    }

    const ledgerId = `LG${Math.floor(100000 + Math.random() * 900000)}`;

    // Create ledger entry
    await Railledger.create({
      userId,
      companyId: getAgentConfig.companyId,
      ledgerId,
      transactionAmount: ticketAmount,
      agentCharges:
        (commercialBreakup?.Agent_service_charge || 0) -
        (agentCommercialMinus.Agent_service_charge || 0),
      convenceFee: commercialBreakup?.Conveniencefee || 0,
      pgCharges: agentCommercialMinus?.pgCharges || 0,
      currencyType: "INR",
      fop: "CREDIT",
      transactionType: "DEBIT",
      runningAmount: newBalance,
      remarks: "Booking amount deducted from your account.",
      transactionBy: userId,
      cartId: bookingId,
    });

    // Create transaction entry
    await transaction.create({
      userId,
      companyId: getAgentConfig.companyId,
      trnsNo: Math.floor(100000 + Math.random() * 900000),
      trnsType: "DEBIT",
      paymentMode: "CL",
      trnsStatus: "success",
      transactionBy: userId,
      bookingId,
    });

    return {
      response: "Amount transferred successfully.",
      amount: ticketAmount,
    };
  } catch (error) {
    console.error("Error in RailBookingCommonMethod:", error.message);
    return {
      response: "An error occurred. Please try again later.",
      error: error.message,
    };
  }
};

const commonAgentPGCharges = async (amout, index = 1) => {
  const amounts = Number(amout);
  const pgCharges = amounts < 2000 ? amounts * 0.0075 : amounts * 0.01;
  return pgCharges;
};

const commonFunctionsRailLogs = async (
  userId,
  companyId,
  traceId,
  type,
  url,
  req,
  res
) => {
  try {
    console.log(userId, companyId, traceId, type, url, req, res);

    // Ensure `userId` and `companyId` are valid ObjectId instances
    const validUserId = new mongoose.Types.ObjectId(userId);
    const validCompanyId = new mongoose.Types.ObjectId(companyId);

    // Create the document
    const raillog = new railLogs({
      userId: validUserId,
      companyId: validCompanyId,
      traceId,
      type,
      url,
      req: JSON.stringify(req),
      res: JSON.stringify(res),
    });

    // Save the instance
    console.log(railLogs, "djieie");
    await raillog.save();
    console.log("Document created successfully");
  } catch (error) {
    console.error("Error creating document:", error.message);
  }
};

const commonMethodDate = (bookingDate = new Date()) => {
  const date = new Date(bookingDate);

  // Extract components
  const day = String(date.getDate()).padStart(2, "0"); // Ensures 2 digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = String(date.getFullYear()).slice(2); // Get last 2 digits of the year
  const hour = String(date.getHours()).padStart(2, "0"); // Ensures 2 digits
  const minute = String(date.getMinutes()).padStart(2, "0"); // Ensures 2 digits

  // Determine AM/PM
  let timetype = "";
  if (Number(hour + minute) > 1159) {
    timetype = "PM";
  } else {
    timetype = "AM";
  }

  const randomNumber = Math.random()
    .toString(36)
    .substring(2, 2 + 5);
  // Concatenate to desired format
  return {
    bookingId: `RL${day}${month}${year}${hour}${minute}${timetype}${randomNumber}`,
    bookingDate: `${day}-${month}-${year} ${hour}:${minute}:00.0 IST`,
  };
};

const commonProviderMethodDate = (bookingDate = new Date()) => {
  const date = new Date(bookingDate);

  // Extract components
  const day = String(date.getDate()).padStart(2, "0"); // Ensures 2 digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = String(date.getFullYear()).slice(2); // Get last 2 digits of the year
  const hour = String(date.getHours()).padStart(2, "0"); // Ensures 2 digits
  const minute = String(date.getMinutes()).padStart(2, "0"); // Ensures 2 digits

  // Determine AM/PM
  let timetype = "";
  if (Number(hour + minute) > 1159) {
    timetype = "PM";
  } else {
    timetype = "AM";
  }

  const randomNumber = Math.random()
    .toString(36)
    .substring(2, 2 + 5);
  // Concatenate to desired format
  return `B2BKFL${day}${month}${year}${hour}${minute}${timetype}${randomNumber}`;
};

const convertTimeISTtoUTC = (Isodate) => {
  let inputDate = Isodate;
  if (!inputDate.includes("IST")) {
    inputDate = formatDate(inputDate);
  }
  // Step 1: Parse the date
  const [day, month, yearAndTime] = inputDate.split("-");
  console.log({ day, month, yearAndTime });
  const [year, time] = yearAndTime.split(" ");
  const dateString = `${year}-${month}-${day}T${time.replace(".0", "")}`;

  // Step 2: Convert to ISO format
  // India Standard Time (IST) is UTC+5:30
  const localDate = new Date(dateString + "+05:30"); // Add IST offset
  const isoDate = localDate.toISOString();

  return isoDate;
};

function formatDate(inputDate) {
  // Parse the input date
  const date = new Date(inputDate);

  // Extract date components
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  // Extract time components
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = Math.floor(date.getMilliseconds() / 100); // Take only the first digit

  // Format the date and time
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}
const ISTtoUTC = (time) => {
  // Convert the IST time to UTC by subtracting 5.5 hours
  const istDate = new Date(time);
  const utcDate = new Date(istDate.getTime() - 5.5 * 60 * 60 * 1000); // IST to UTC conversion
  return utcDate;
};

const ProivdeIndiaStandardTime = (toDate, fromDate) => {
  // Start of the day in IST
  const startOfDayIST = moment(toDate)
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .toDate();

  // End of the day in IST
  const endOfDayIST = moment(fromDate)
    .set("hour", 23)
    .set("minute", 59)
    .set("second", 59)
    .toDate();

  // Convert the IST dates to UTC for querying
  const startDateUTC = startOfDayIST;
  const endDateUTC = endOfDayIST;

  return {
    startDateUTC, // This will be the UTC start date
    endDateUTC, // This will be the UTC end date
  };
};

const calculateOfferedPrice = async (fareFamiliyElement) => {
  let returnCalculatedOfferedPrice = 0;

  fareFamiliyElement.PriceBreakup?.forEach((priceBreakupElement) => {
    let {
      PassengerType,
      NoOfPassenger,
      CommercialBreakup,
      BaseFare,
      Tax,
      TaxBreakup,
    } = priceBreakupElement;

    if (PassengerType) {
      returnCalculatedOfferedPrice += Number(BaseFare) * NoOfPassenger;
      returnCalculatedOfferedPrice += Number(Tax) * NoOfPassenger;

      // TaxBreakup?.forEach((taxBreakup) => {
      //   let { TaxType, Amount } = taxBreakup;
      //   if (TaxType)
      //     returnCalculatedOfferedPrice += Number(Amount) * NoOfPassenger;
      // });

      CommercialBreakup?.forEach((commercialBreakup) => {
        let { CommercialType, Amount } = commercialBreakup;
        if (offerPricePlusInAmount(CommercialType) && CommercialType != "TDS")
          returnCalculatedOfferedPrice +=
            roundOffNumberValues(Amount) * NoOfPassenger;
        if (offerPriceMinusInAmount(CommercialType))
          returnCalculatedOfferedPrice -=
            roundOffNumberValues(Amount) * NoOfPassenger;
        if (
          CommercialType == "Discount" ||
          CommercialType == "SegmentKickback"
        ) {
          // console.log(PassengerType, "PassengerType");
          const discountOrSegmentValue = roundOffNumberValues(Amount);
          // console.log(CommercialType + "=" + discountOrSegmentValue, "before adding");
          returnCalculatedOfferedPrice +=
            discountOrSegmentValue * 0.02 * NoOfPassenger;
          // console.log(returnCalculatedOfferedPrice, "tdsAmount");
        }
      });
    }
  });
  console.log(returnCalculatedOfferedPrice, "before round off");

  returnCalculatedOfferedPrice = Number(
    roundOffNumberValues(returnCalculatedOfferedPrice)
  );

  console.log(returnCalculatedOfferedPrice, "before round up");

  return returnCalculatedOfferedPrice;
};

function roundOffNumberValues(numberValue) {
  if (isNaN(numberValue)) numberValue = 0;
  const integerPart = Math.floor(numberValue);
  const fractionalPart = numberValue - integerPart;
  const result =
    fractionalPart >= 0.5 ? Math.ceil(numberValue) : Math.floor(numberValue);
  return result.toFixed(2);
}

function offerPricePlusInAmount(plusKeyName) {
  let returnBoolean = false;
  switch (plusKeyName) {
    case "TDS":
      returnBoolean = true;
      break;
    case "BookingFees":
      returnBoolean = true;
      break;
    case "ServiceFees":
      returnBoolean = true;
      break;
    case "GST":
      returnBoolean = true;
      break;
    case "Markup":
      returnBoolean = true;
      break;
    case "otherTax":
      returnBoolean = true;
      break;
    case "FixedBookingFees":
      returnBoolean = true;
      break;
    case "FixedServiceFees":
      returnBoolean = true;
      break;
    default:
      returnBoolean = false;
      break;
  }
  return returnBoolean;
}

function offerPriceMinusInAmount(plusKeyName) {
  let returnBoolean = false;
  switch (plusKeyName) {
    case "Discount":
      returnBoolean = true;
      break;
    case "SegmentKickback":
      returnBoolean = true;
      break;
    case "Incentive":
      returnBoolean = true;
      break;
    case "PLB":
      returnBoolean = true;
      break;

    default:
      returnBoolean = false;
      break;
  }
  return returnBoolean;
}

async function getPnr1APnedingStatus(traceId, credentialsType) {
  try {
    // POST request bhejne ke liye fetch ka use
    // console.log(`${Config[credentialsType]?.additionalFlightsBaseURL}/log/airlog`)
    // const response = await fetch(
    //   `${Config[credentialsType]?.additionalFlightsBaseURL}/log/airlog`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       traceId: traceId,
    //       logType: "vendor", // vendor ya travelOne
    //       serviceName: "", // airBooking ke liye agar zaroori ho
    //       download: true,
    //     }),
    //   }
    // );

    const response = await axios.post(
      `${Config[credentialsType]?.additionalFlightsBaseURL}/log/airlog`,
      {
        traceId: traceId,
        logType: "vendor", // vendor ya travelOne
        serviceName: "airBooking", // airBooking ke liye agar zaroori ho
        download: true,
      }
    );

    const responseText = response.data;

    const pnrSet = new Set();
    // 1A
    const controlNumberRegex = /<controlNumber>(.*?)<\/controlNumber>/g;

    let match;
    while ((match = controlNumberRegex.exec(responseText)) != null) {
      if (match?.[1]) pnrSet.add(match[1]);
    }

    if (!pnrSet.size) {
      // 1AN
      const orderIDRegEx = /<OrderID>(.*?)<\/OrderID>/g;
      while ((match = orderIDRegEx.exec(responseText)) != null) {
        if (match?.[1]) pnrSet.add(match[1]);
      }
    }

    const pnrList = [...pnrSet];
    return pnrList?.[0];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const getPnrDataCommonMethod = async (Authentication, pnr, provider) => {
  const url = `${
    Config[Authentication?.CredentialType]?.baseURLBackend
  }/api/flight/import-pnr`;

  const data = {
    pnr: pnr,
    provider: provider,
    Authentication: Authentication,
  };

  const config = {
    headers: {
      Accept: "application/json, text/plain, */*",
    },
  };
  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (error) {
    console.log("Error:", error.message);
  }
};
// Function call

const sendEmailForSatte = async (
  mailConfig,
  email,
  name,
  loginUrl,
  resetUrl
) => {
  try{

    const html=`
<!DOCTYPE html>
<html>
<head>
    <style>
        .contact-table { 
            width: 100%; 
            border-collapse: collapse;
            margin-top: 20px;
        }
        .contact-table td, .contact-table th {
            padding: 8px;
            border: 1px solid #ddd;
            text-align: left;
        }
        .footer {
            margin-top: 30px;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <p>Dear ${name},</p>
    
    <p>Greetings from Kafila Hospitality and Travels Pvt. Ltd.!</p>

    <p>We had the pleasure of meeting you at SATTE 2025 at Yashobhoomi, New Delhi, and we have your visiting card.</p>

    <p>As per your request, we have registered you on our B2B portal:<br>
    <a href="${loginUrl}">${loginUrl}</a></p>

    <p>Please find below your login details for accessing your account:</p>
    
    <p><strong>Email:</strong> ${email}</p>
    
    <p>For security reasons, we recommend that you reset your password immediately. You can reset your password using the following link:</p>
    
    <p><a href="${resetUrl}" style="font-weight: bold; color: blue;">Reset Password</a></p>

    <p>If you have any questions or need further assistance, please contact our team:</p>

    <table class="contact-table">
        <tr>
            <th><strong>Best regards,</strong></th>
            <th><strong>Contact Numbers</strong></th>
        </tr>
        <tr>
            <td>Biresh Kumar<br>Refund/Support</td>
            <td>011 450 22285 / +919560012813</td>
        </tr>
        <tr>
            <td>Ajay Mishra<br>Package/API</td>
            <td>011 450 22225 / +919873669995</td>
        </tr>
        <tr>
            <td>Aditya<br>Login/API/Distributor Sales</td>
            <td>+919311964030</td>
        </tr>
        <tr>
            <td>Ravi Shankar<br>Ticketing</td>
            <td>011 450 22233 / +919873633888</td>
        </tr>
        <tr>
            <td>Manish<br>Ticketing/Support Head</td>
            <td>011 450 22268 / +919910388355</td>
        </tr>
        <tr>
            <td>Rajat<br>Operation Head</td>
            <td>011 450 22257 / +918587811173</td>
        </tr>
    </table>

    <div class="footer">
        <p>Kafila Hospitality and Travels Pvt. Ltd.<br>
    </div>
</body>
</html>
`

    const transporter = nodemailer.createTransport({
      host: mailConfig[0].host,
      port: mailConfig[0].port,
      secure: false,
      auth: {
        user: mailConfig[0].userName,
        pass: mailConfig[0].password,
      },
      tls: {
        rejectUnauthorized: false,
      },
      logger: true, // Enable logger
      debug: true, // Enable debug
    });

    const mailOptions = {
      from: mailConfig[0].emailFrom,
      to: email,
      subject: `Your B2B Portal Registration Details`,
      cc: "", // Add CC recipient
      bcc: "",
      html: html,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    
  } catch (error) {
    return {
      response: "Error Sending Notification Email",
      data: error.message,
    };
  }
};


const sendSuccessHtml=(URL)=>{
  const successHtmlCode = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Success</title>
    <style>
      .success-txt {
        color: #51a351;
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f2f2f2;
      }
      .success-container {
        max-width: 400px;
        width: 100%;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #fff;
        text-align: center;
      }
      .success-container p {
        margin-top: 10px;
      }
      .redirect-btn {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
      }
      .redirect-btn:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="success-container">
      <h1 class="success-txt">Payment Successful!</h1>
      <p class="success-txt">Your payment has been successfully processed.</p>
      <p>Thank you for your purchase.</p>
      <p id="timer-text">Don't Refresh Redirecting in <span id="countdown">15</span> seconds...</p>
      <a id="redirect-btn" class="redirect-btn" href="${URL}">Go to Merchant...</a>
    </div>
  
    <script>
      let countdown = 15; // Timer in seconds
      const countdownElement = document.getElementById("countdown");
      const redirectBtn = document.getElementById("redirect-btn");
  
      const timerInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
  
        if (countdown <= 0) {
          clearInterval(timerInterval);
          document.getElementById("timer-text").style.display = "none"; // Hide timer text
          redirectBtn.style.display = "inline-block"; // Show button
          redirectBtn.href = "${URL}"; // Set the redirect URL
          window.location.href = "${URL}"; // Auto redirect
        }
      }, 1000);
    </script>
  </body>
  </html>
  `;
            return successHtmlCode;
}

const sendFailedHtml=(URL)=>{
  const successHtmlCode = ` <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Failed</title>
          <style>
            .failed-txt {
              color: #bd362f;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: #f2f2f2;
            }
            .failed-container {
              max-width: 400px;
              width: 100%;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
              background-color: #fff;
              text-align: center;
            }
            .failed-container p {
              margin-top: 10px;
            }
            .failed-container a {
              display: inline-block;
              margin-top: 20px;
              padding: 10px 20px;
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
            }
            .failed-container a:hover {
              background-color: #0056b3;
            }
          </style>
        </head>
        <body>
          <div class="failed-container">
            <h1 class="failed-txt">Payment Failed!</h1>
            <p class="failed-txt">Your payment has failed.</p>
            <p>Please try again later.</p>
            <a href="${
              URL
            }">Go to Merchant...</a>
          </div>
        </body>
        </html>
      `;
            return successHtmlCode;
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
  sendNotificationByEmail,
  recieveDI,
  sendCardDetailOnMail,
  createLeadger,
  getTdsAndDsicount,
  calculateOfferedPricePaxWise,
  getTicketNumberBySector,
  priceRoundOffNumberValues,
  RefundedCommonFunction,
  sendTicketSms,
  RailBookingCommonMethod,
  commonAgentPGCharges,
  commonFunctionsRailLogs,
  commonMethodDate,
  convertTimeISTtoUTC,
  ProivdeIndiaStandardTime,
  calculateOfferedPrice,
  commonProviderMethodDate,
  getPnr1APnedingStatus,
  getPnrDataCommonMethod,
  sendEmailForSatte,
  sendSuccessHtml,
  sendFailedHtml
};
