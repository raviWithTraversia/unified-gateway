const User = require("../../models/User");
const Company = require("../../models/Company");
const axios = require("axios");
const { Config } = require("../../configs/config");
const jwt = require("jsonwebtoken");
const RailBookingSchema = require("../../models/Irctc/bookingDetailsRail");
const agentConfig=require('../../models/AgentConfig')
const {
  prepareRailBookingQRDataString,
  generateQR,
} = require("../../utils/generate-qr");

const {commonAgentPGCharges,commonFunctionsRailLogs}=require('../../controllers/commonFunctions/common.function')
const getRailSearch = async (req, res) => {
  try {
    const { fromStn, toStn, date, Authentication,traceId } = req.body;
    if ((!fromStn, !toStn, !date, !Authentication)) {
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
    let renewDate = date.split("-");
    let url = `${Config.TEST.IRCTC_BASE_URL}/eticketing/webservices/taenqservices/tatwnstns/${fromStn}/${toStn}/${renewDate[0]}${renewDate[1]}${renewDate[2]}`;
    const auth = Authentication.CredentialType==="LIVE"?Config.LIVE.IRCTC_AUTH:Config.TEST.IRCTC_AUTH;
    if (Authentication.CredentialType === "LIVE") {
      url = `${Config.LIVE.IRCTC_BASE_URL}/eticketing/webservices/taenqservices/tatwnstns/${fromStn}/${toStn}/${renewDate[0]}${renewDate[1]}${renewDate[2]}`;
    }
console.log(url,"url")
    const response = (
      await axios.get(url, { headers: { Authorization: auth } })
    )?.data;
    if (!response?.trainBtwnStnsList?.length) {
      return {
        response: "Error in fetching data",
      };
    } else {
      response.traceId=traceId
      commonFunctionsRailLogs(Authentication?.CompanyId,Authentication?.UserId,traceId,"Rail Search",url,req.body,response)
      
      return {
        response: "Fetch Data Successfully",
        data: response,
      };
    }
  } catch (error) {
    console.log(error);
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const railSearchBtwnDate = async (req, res) => {
  try {
    const { trainNo, fromStn, toStn, date, Authentication, quota, cls,traceId } =
      req.body;
    if ((!fromStn, !toStn, !date, !Authentication)) {
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
    let renewDate = date.split("-");
    let url = `${Config.TEST.IRCTC_BASE_URL}/eticketing/webservices/taenqservices/avlFareenquiry/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${fromStn}/${toStn}/${cls}/${quota}/N`;
    const auth = Authentication.CredentialType==="LIVE"?Config.LIVE.IRCTC_AUTH:Config.TEST.IRCTC_AUTH;
    if (Authentication.CredentialType === "LIVE") {
      url = `${Config.LIVE.IRCTC_BASE_URL}/eticketing/webservices/taenqservices/avlFareenquiry/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${fromStn}/${toStn}/${cls}/${quota}/N`;
    }

    const response = (
      await axios.post(
        url,
        {
          masterId:Authentication.CredentialType === "LIVE"?Config.LIVE.IRCTC_MASTER_ID:Config.TEST.IRCTC_MASTER_ID , //this is hard code master id for temp use
          enquiryType: "3",
          reservationChoice: "99",
          moreThanOneDay: "true",
        },
        { headers: { Authorization: auth } }
      )
    )?.data;
    if (!response) {
      return {
        response: "Error in fetching data",
      };
    } else {
      commonFunctionsRailLogs(Authentication?.CompanyId,Authentication?.UserId,traceId,"Rail Search between Date",url,req.body,response)
      
      return {
        response: "Fetch Data Successfully",
        data: response,
      };
    }
  } catch (error) {
    console.log(error);
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const railRouteView = async (req, res) => {
  try {
    const { trainNo, journeyDate, startingStationCode, Authentication } =
      req.body;
    if ((!trainNo, !Authentication)) {
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
    // let renewDate = journeyDate.split("-");
    let url = `${Config.TEST.IRCTC_BASE_URL}/eticketing/webservices/taenqservices/trnscheduleEnq/${trainNo}`; //?journeyDate=${journeyDate}&startingStationCode=${startingStationCode}`;
    // console.log(url,"url");
    const auth = Authentication.CredentialType==="LIVE"?Config.LIVE.IRCTC_AUTH:Config.TEST.IRCTC_AUTH;
    if (Authentication.CredentialType === "LIVE") {
      url = `${Config.LIVE.IRCTC_BASE_URL}/eticketing/webservices/taenqservices/trnscheduleEnq/${trainNo}`; //?journeyDate=${journeyDate}&startingStationCode=${startingStationCode}`;
    }

    const response = (
      await axios.get(url, { headers: { Authorization: auth } })
    )?.data;

    if (!response) {
      return {
        response: "Error in fetching data",
      };
    } else {
      response.traceId=traceId
      commonFunctionsRailLogs(Authentication?.CompanyId,Authentication?.UserId,traceId,"Rail Search",url,req.body,response)
      
      return {
        response: "Fetch Data Successfully",
        data: response,
      };
    }
  } catch (error) {
    console.log(error);
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const railFareEnquiry = async (req, res) => {
  try {
    const {
      trainNo,
      journeyDate,
      frmStn,
      toStn,
      jClass,
      jQuota,
      paymentEnqFlag,
      Authentication,
      passengerList,
      mobileNumber,
      travelInsuranceOpted,
      ignoreChoiceIfWl,
      reservationMode,
      agentDeviceId,
      autoUpgradationSelected,
      ticketType,
      boardingStation,
      clientTransactionId,
      gstDetailInputFlag,
      infantList,
      gstDetails,
      RailAgentId,
      amount,
      traceId
    } = req.body;
    if ((!trainNo, !Authentication)) {
      return { response: "Provide required fields" };
    }
    if (!["LIVE", "TEST"].includes(Authentication.CredentialType)) {
      return {
        IsSucess: false,
        response: "Credential Type does not exist",
      };
    }
    const checkUser = await agentConfig.findOne({userId:Authentication.UserId}).populate({
      path: 'userId',      // First, populate the userId field
      populate: {
        path: 'roleId',    // Then, populate the roleId inside userId
        model: 'Role',     // Specify the model for roleId (optional if correctly referenced)
      },
    }).populate("RailcommercialPlanIds");
    
    const checkCompany = await Company.findById(Authentication.CompanyId);
    if (!checkUser || !checkCompany) {
      return { response: "Either User or Company must exist" };
    }
    if (checkUser?.userId?.roleId?.name !== "Agency") {
      return { response: "User role must be Agency" };
    }
    if (checkCompany?.type !== "TMC") {
      return { response: "companyId must be TMC" };
    }

console.log(checkUser.RailcommercialPlanIds)
let agentCharges={}
if(jClass=="SL"){
  agentCharges.Conveniencefee=checkUser?.RailcommercialPlanIds?.Conveniencefee?.sleepar
  agentCharges.Agent_service_charge=checkUser?.RailcommercialPlanIds?.Agent_service_charge?.sleepar
  agentCharges.PG_charges=await commonAgentPGCharges(amount)

}
else{
  agentCharges.Conveniencefee=checkUser?.RailcommercialPlanIds?.Conveniencefee?.acCharge
  agentCharges.Agent_service_charge=checkUser?.RailcommercialPlanIds?.Agent_service_charge?.acCharge
  agentCharges.PG_charges=await commonAgentPGCharges(amount)

}
console.log(agentCharges)
    let renewDate = journeyDate.split("-");
    let url = `${Config.TEST.IRCTC_BASE_URL}/eticketing/webservices/taenqservices/avlFareenquiry/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${frmStn}/${toStn}/${jClass}/${jQuota}/${paymentEnqFlag}`;
    const auth = Authentication.CredentialType==="LIVE"?Config.LIVE.IRCTC_AUTH:Config.TEST.IRCTC_AUTH;
    if (Authentication.CredentialType === "LIVE") {
      url = `${Config.LIVE.IRCTC_BASE_URL}/eticketing/webservices/taenqservices/avlFareenquiry/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${frmStn}/${toStn}/${jClass}/${jQuota}/${paymentEnqFlag}`;
    }

    let queryParams = {
      masterId: Authentication.CredentialType === "LIVE"?Config.LIVE.IRCTC_MASTER_ID:Config.TEST.IRCTC_MASTER_ID,
      wsUserLogin: RailAgentId,
      enquiryType: "3",
      reservationChoice: "99",
      moreThanOneDay: "true",
      ignoreChoiceIfWl: ignoreChoiceIfWl,
      gnToCkOpted: "false",
      ticketType: ticketType,
      travelInsuranceOpted: travelInsuranceOpted,
      passengerList: passengerList,
      mobileNumber: mobileNumber,
      autoUpgradationSelected: autoUpgradationSelected,
      boardingStation: boardingStation,
      reservationMode: reservationMode, //B2B_WEB_OTP
      clientTransactionId: clientTransactionId,
      gstDetailInputFlag: gstDetailInputFlag,
      agentDeviceId: agentDeviceId,
      infantList: infantList,
      gstDetails: gstDetails,
    };

    console.log(url,"url")
    const response = (
      await axios.post(url, queryParams, { headers: { Authorization: auth } })
    )?.data;
    // console.log(response);

    if (!response) {
      return {
        response: "Error in fetching data",
      };
    } else {
      response.traceId=traceId
      response.CommercialCharges=agentCharges
      commonFunctionsRailLogs(Authentication?.CompanyId,Authentication?.UserId,traceId,"FareEnquiry",url,req.body,response)
      
      return {
        response: "Fetch Data Successfully",
        data: response,
      };
    }
  } catch (error) {
    // apiErrorres(
    //   res,
    //   errorResponse.SOMETHING_WRONG,
    //   ServerStatusCode.SERVER_ERROR,
    //   true
    // );
  throw error
  }
};

const railBoardingEnquiry = async (req, res) => {
  try {
    const {
      trainNo,
      journeyDate,
      frmStn,
      toStn,
      jClass,
      jQuota,
      Authentication,
      
    } = req.body;
    if ((!trainNo, !Authentication)) {
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
   
    if (checkCompany?.type !== "TMC") {
      return { response: "companyId must be TMC" };
    }
    let renewDate = journeyDate.split("-");
    let url = `${Config.TEST.IRCTC_BASE_URL}/eticketing/webservices/taenqservices/boardingstationenq/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${frmStn}/${toStn}/${jClass}`;
    const auth = Authentication.CredentialType==="LIVE"?Config.LIVE.IRCTC_AUTH:Config.TEST.IRCTC_AUTH;
    if (Authentication.CredentialType === "LIVE") {
      url = `${Config.LIVE.IRCTC_BASE_URL}/eticketing/webservices/taenqservices/boardingstationenq/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${frmStn}/${toStn}/${jClass}`;
    }

    
  
    const response = (
      await axios.get(url, { headers: { Authorization: auth } })
    )?.data;
    // console.log(response);
    
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
   
  }
};

// change boarding Station

const ChangeBoardingStation = async (req, res) => {
  try {
    const {
      pnr,
      boardingStation,
      boardingStnName,
      Authentication,
      traceId
      
    } = req.body;
    if ((!pnr, !Authentication)) {
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
   
    if (checkCompany?.type !== "TMC") {
      return { response: "companyId must be TMC" };
    }
    let url = `${Config.TEST.IRCTC_BASE_URL}/eticketing/webservices/tatktservices/changeBoardingPoint/${pnr}/${boardingStation}`;
    const auth = Authentication.CredentialType==="LIVE"?Config.LIVE.IRCTC_AUTH:Config.TEST.IRCTC_AUTH;
    if (Authentication.CredentialType === "LIVE") {
      url = `${Config.LIVE.IRCTC_BASE_URL}/eticketing/webservices/tatktservices/changeBoardingPoint/${pnr}/${boardingStation}`;
    }

    
  
    const response = (
      await axios.get(url, { headers: { Authorization: auth } })
    )?.data;
    // console.log(response);
    if (!response) {
      return {
        response: "Error in fetching data",
      };
    } else {
      if(response.success=='true'&&response.status.includes("Boarding point has been changed successfully.")){
        console.log(response)
        response.traceId=traceId

        await RailBookingSchema.findOneAndUpdate({pnrNumber:response.pnr},{$set:{boardingStn:response.newBoardingPoint,boardingDate:response.newBoardingDate,boardingStnName:boardingStnName}},{new:true})
}
commonFunctionsRailLogs(Authentication?.CompanyId,Authentication?.UserId,traceId,"Boarding Station",url,req.body,response)

      return {
        response: "Fetch Data Successfully",
        data: response,
      };
    }
  } catch (error) {
    console.log(error, "error");
   
  }
};


// Pnr enquiry 

const PnrEnquirry = async (req, res) => {
  try {
    const {
      pnr,
      Authentication,
      
    } = req.body;
    if ((!pnr, !Authentication)) {
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
   
    if (checkCompany?.type !== "TMC") {
      return { response: "companyId must be TMC" };
    }
    let url = `${Config.TEST.IRCTC_BASE_URL}/eticketing/webservices/taenqservices/pnrenquiry/${pnr}`;
    const auth = Authentication.CredentialType==="LIVE"?Config.LIVE.IRCTC_AUTH:Config.TEST.IRCTC_AUTH;
    if (Authentication.CredentialType === "LIVE") {
      url = `${Config.LIVE.IRCTC_BASE_URL}/eticketing/webservices/taenqservices/pnrenquiry/${pnr}`;
    }

    console.log(url,"url")
  
    const response = (
      await axios.get(url, { headers: { Authorization: auth } })
    )?.data;
    // console.log(response);
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
   
  }
};

const DecodeToken = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return {
        response: "Token not found",
      };
    }

    let successHtmlCode
    // Decode the Base64 token
    const responseData = Buffer.from(data, "base64").toString("utf-8");

    // Log the decoded data to check its structure
    console.log("Decoded Data: ", responseData);

    // Try parsing the decoded string as JSON
    let jsonData;
    try {
      jsonData = JSON.parse(responseData);
      let bookingDateStr =jsonData.bookingDate;

      bookingDateStr = bookingDateStr.replace(".0", "").replace(" IST", "");

      let [datePart, timePart] = bookingDateStr.split(" ");

      let [day, month, year] = datePart.split("-");
      let formattedDate = `${year}-${month}-${day}T${timePart}`;

      jsonData.bookingStatus = "CONFIRMED";

      jsonData.bookingDate = new Date(formattedDate);
      console.log(jsonData.clientTransactionId);
      if(!jsonData?.pnrNumber){
        return "jddieiei"
      }
      if (jsonData?.reservationId && jsonData?.pnrNumber) {
        const qrCodeData = prepareRailBookingQRDataString({
          booking: jsonData,
        });
        if (qrCodeData) {
          const qrImage = await generateQR({
            text: qrCodeData,
            fileName: `${Date.now()}-${jsonData.pnrNumber}.png`,
          });
          if (qrImage) jsonData.qrImage = qrImage;
        }
      }
      const updaterailBooking = await RailBookingSchema.findOneAndUpdate(
        { clientTransactionId: jsonData.clientTransactionId },
        { $set: jsonData },
        { new: true }
      );
      // commonFunctionsRailLogs(Authentication?.CompanyId,Authentication?.userId,traceId,"Decode Token for Booking","TOken",data,jsonData)
       successHtmlCode = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ticket Book Success</title>
        <style>
        .success-txt{
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
        
        .success-container a {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
        }
        
        .success-container a:hover {
          background-color: #0056b3;
        }
      </style>
  
      </head>
      <body>
        <div class="success-container">
          <h1 class="success-txt">Ticket Booked Successful!</h1>
          <p class="success-txt">Your Ticket has been Booked successfully...</p>
          <p>Thank you for your purchase.</p>
            <p>PNR No.: ${updaterailBooking.pnrNumber}</p>
          <a href="${
            Config[Config.MODE].baseURL
          }/home/manageRailBooking/railCartDetails?bookingId=${
        updaterailBooking.clientTransactionId
      }">Go to Merchant...</a>
        </div>
      </body>
 
      </html>`;
      return successHtmlCode;
    } catch (jsonError) {
      console.log(jsonError.message);
      return {
        response: "Invalid JSON format",
        error: "Something went wrong",
      };
    }

    // If JSON parsing succeeds, return the data
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Something went wrong on the server",
      error: error.message,
    });
  }
};

module.exports = {
  getRailSearch,
  railSearchBtwnDate,
  railRouteView,
  railFareEnquiry,
  DecodeToken,
  railBoardingEnquiry,
  ChangeBoardingStation,
  PnrEnquirry
};
