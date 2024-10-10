const User = require("../../models/User");
const Company = require("../../models/Company");
const axios = require("axios");
const { Config } = require("../../configs/config");
const jwt=require('jsonwebtoken');
const RailBookingSchema=require('../../models/Irctc/bookingDetailsRail')

const getRailSearch = async (req, res) => {
  try {
    const { fromStn, toStn, date, Authentication } = req.body;
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
    let url = `https://stagews.irctc.co.in/eticketing/webservices/taenqservices/tatwnstns/${fromStn}/${toStn}/${renewDate[0]}${renewDate[1]}${renewDate[2]}`;
    const auth = "Basic V0tBRkwwMDAwMDpUZXN0aW5nMQ==";
    if (Authentication.CredentialType === "LIVE") {
      url = `https://stagews.irctc.co.in/eticketing/webservices/taenqservices/tatwnstns/${fromStn}/${toStn}/${renewDate[0]}${renewDate[1]}${renewDate[2]}`;
    }

    const response = (
      await axios.get(url, { headers: { Authorization: auth } })
    )?.data;
    if (!response?.trainBtwnStnsList?.length) {
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
    const { trainNo, fromStn, toStn, date, Authentication, quota, cls } =
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
    let url = `https://stagews.irctc.co.in/eticketing/webservices/taenqservices/avlFareenquiry/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${fromStn}/${toStn}/${cls}/${quota}/N`;
    const auth = "Basic V0tBRkwwMDAwMDpUZXN0aW5nMQ==";
    if (Authentication.CredentialType === "LIVE") {
      url = `https://stagews.irctc.co.in/eticketing/webservices/taenqservices/avlFareenquiry/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${fromStn}/${toStn}/${cls}/${quota}/N`;
    }

    const response = (
      await axios.post(
        url,
        {
          masterId: "WKAFL00000", //this is hard code master id for temp use
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
    let url = `https://stagews.irctc.co.in/eticketing/webservices/taenqservices/trnscheduleEnq/${trainNo}`; //?journeyDate=${journeyDate}&startingStationCode=${startingStationCode}`;
    // console.log(url,"url");
    const auth = "Basic V0tBRkwwMDAwMDpUZXN0aW5nMQ==";
    if (Authentication.CredentialType === "LIVE") {
      url = `https://stagews.irctc.co.in/eticketing/webservices/taenqservices/trnscheduleEnq/${trainNo}`; //?journeyDate=${journeyDate}&startingStationCode=${startingStationCode}`;
    }

    const response = (
      await axios.get(url, { headers: { Authorization: auth } })
    )?.data;

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
    if (checkUser?.roleId?.name !== "Agency") {
      return { response: "User role must be Agency" };
    }
    if (checkCompany?.type !== "TMC") {
      return { response: "companyId must be TMC" };
    }
    let renewDate = journeyDate.split("-");
    let url = `https://stagews.irctc.co.in/eticketing/webservices/taenqservices/avlFareenquiry/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${frmStn}/${toStn}/${jClass}/${jQuota}/${paymentEnqFlag}`;
    const auth = "Basic V0tBRkwwMDAwMDpUZXN0aW5nMQ==";
    if (Authentication.CredentialType === "LIVE") {
      url = `https://stagews.irctc.co.in/eticketing/webservices/taenqservices/avlFareenquiry/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${frmStn}/${toStn}/${jClass}/${jQuota}/${paymentEnqFlag}`;
    }

     let queryParams = {
           
            "masterId": "WKAFL00000",
            "wsUserLogin": "WKAFL00001",
            "enquiryType": "3",
            "reservationChoice": "99",
            "moreThanOneDay": "true",
            "ignoreChoiceIfWl":ignoreChoiceIfWl,
            "gnToCkOpted":"false",
            "ticketType":ticketType,
            "travelInsuranceOpted":travelInsuranceOpted,
            "passengerList": passengerList,
            "mobileNumber": mobileNumber,
            "autoUpgradationSelected": autoUpgradationSelected,
            "boardingStation": boardingStation,
            "reservationMode": reservationMode,//B2B_WEB_OTP
            "clientTransactionId": clientTransactionId,
            "gstDetailInputFlag": gstDetailInputFlag,
            "agentDeviceId": agentDeviceId,
            "infantList": infantList,
            "gstDetails": gstDetails
        };
    const response = (
      await axios.post(url, queryParams, { headers: { Authorization: auth } })
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
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const DecodeToken = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return {
        response: "Token not found"
      };
    }

    let successHtmlCode
    // Decode the Base64 token
    const responseData = Buffer.from(data, 'base64').toString('utf-8');
    
    // Log the decoded data to check its structure
    console.log("Decoded Data: ", responseData);

    // Try parsing the decoded string as JSON
    let jsonData;
    try {
      jsonData = JSON.parse(responseData);
      let bookingDateStr =jsonData.bookingDate;
      if(!bookingDateStr||!jsonData.reservationId||jsonData.pnrNumber){
   return     successHtmlCode=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Failed Rail Ticket</title>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 30px;
}

.icon img {
  width: 50px;
  height: 50px;
  margin-bottom: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #ff4d4d;
}

p {
  font-size: 16px;
  color: #555;
  margin-bottom: 30px;
}

.options {
  display: flex;
  justify-content: space-between;
}

.retry-btn, .contact-btn {
  background-color: #ff4d4d;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.retry-btn:hover, .contact-btn:hover {
  background-color: #ff3333;
}

.retry-btn {
  margin-right: 10px;
}

</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="icon">
        <img src="https://img.icons8.com/ios-filled/50/ff0000/error--v1.png" alt="Failed">
      </div>
      <h1>Booking Failed</h1>
      <p>We're sorry, but your rail ticket booking could not be completed.</p>
      <div class="options">
        <button class="retry-btn" onclick="retryBooking()">Retry Booking</button>
        <button class="contact-btn" onclick="contactSupport()">Contact Support</button>
      </div>
    </div>
  </div>

  <script>
    function retryBooking() {
      alert("Redirecting to retry booking...");
      // Add functionality to retry the booking here
    }

    function contactSupport() {
      alert("Redirecting to contact support...");
      // Add functionality to contact support here
    }
  </script>
</body>
</html>
`
      }

bookingDateStr = bookingDateStr.replace(".0", "").replace(" IST", "");

let [datePart, timePart] = bookingDateStr.split(" ");

let [day, month, year] = datePart.split("-");
let formattedDate = `${year}-${month}-${day}T${timePart}`;


      jsonData.bookingStatus="CONFIRMED";

      jsonData.bookingDate=new Date(formattedDate)
      console.log(jsonData.clientTransactionId)
      const updaterailBooking=await RailBookingSchema.findOneAndUpdate({clientTransactionId:jsonData.clientTransactionId},{$set:jsonData},{new:true})
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
          }/home/manageRailBooking/railCartDetails?bookingId=${updaterailBooking.clientTransactionId}">Go to Merchant...</a>
        </div>
      </body>
 
      </html>`;
      return successHtmlCode
    } catch (jsonError) {
      console.log(jsonError.message)
      return {
        response: "Invalid JSON format",
        error: jsonError.message
      };
    }

    // If JSON parsing succeeds, return the data
    

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Something went wrong on the server",
      error: error.message
    });
  }
};




module.exports = {
  getRailSearch,
  railSearchBtwnDate,
  railRouteView,
  railFareEnquiry,
  DecodeToken
};
