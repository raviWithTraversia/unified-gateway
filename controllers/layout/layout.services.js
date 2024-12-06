const registration = require('../../models/Registration');
const creditRequest = require('../../models/CreditRequest');
var bookingdetails = require("../../models/booking/BookingDetails");
var railBookingdetils=require('../../models/Irctc/bookingDetailsRail')
const company = require("../../models/Company");
const depositDetail = require("../../models/DepositRequest");

const axios = require('axios');
const { Config } = require("../../configs/config");
const registrationServices = require('../../controllers/registration/registration.services')

const dashBoardCount = async (req, res) => {
  try {
    let { companyId,product } = req.query;
   var BookingDetails
    if(product=="Flight"){
      BookingDetails=bookingdetails
    }
    if(product=="Rail"){
      BookingDetails=railBookingdetils
    }
    let data = {};
    let req1 = { params: { companyId: companyId } };
    const ISTtoUTC = (time) => {
      const istDate = new Date(time);
      const utcDate = new Date(istDate.getTime() - 5.5 * 60 * 60 * 1000); // IST to UTC conversion
      return utcDate;
    };
    const today = new Date();

// Set IST start and end times for today
const startOfDayIST = new Date(today.setUTCHours(0, 0, 0, 0));  // Start of today in IST
const endOfDayIST = new Date(today.setUTCHours(23, 59, 59, 999));  // End of today in IST

// Convert IST start and end times to UTC for MongoDB query
const startDateUTC = ISTtoUTC(startOfDayIST);
const endDateUTC = ISTtoUTC(endOfDayIST);

// Build date filter
const dateId = {
  createdAt: {
    $gte: startDateUTC,  // Start of the day in UTC
    $lte: endDateUTC     // End of the day in UTC
  }
};

// Now use this filter in your MongoDB query
let bookingDetailsQuery
if(Config?.TMCID!==companyId){
  bookingDetailsQuery = {
    AgencyId: companyId,
    createdAt: dateId.createdAt // Use the date range filter
  }
}
else{

 bookingDetailsQuery = {
  companyId: companyId,
  createdAt: dateId.createdAt // Use the date range filter
};
}



    let [newRegistrationCount, creditReqCount, getBookingDetails, RegisteredAgentConfig, depositRequest] = await Promise.all([
      registrationServices.getAllRegistrationByCompany(req1, res),
      creditRequest.find({ companyId: companyId }),
      BookingDetails.find(bookingDetailsQuery, { bookingStatus: 1 }),
      company.countDocuments({ parent: companyId }),
      depositDetail.countDocuments({ companyId, status: "pending" })
    ]);

    let cancelPending = 0, pending = 0, hold = 0, failedAtPayment = 0, allFailed = 0, refund = 0, refundPending = 0, amendement = 0,confirmed=0

    getBookingDetails.map(item => {
      if (item.bookingStatus == "PENDING") pending++;
      if (item.bookingStatus == "HOLD") hold++;
      if (item.bookingStatus == "FAILED PAYMENT") failedAtPayment++;
      if (item.bookingStatus == "FAILED") allFailed++;
      if (item.bookingStatus == "REFUND") refund++;
      if (item.bookingStatus == "CANCELLATION PENDING") cancelPending++;
      if (item.bookingStatus == "CONFIRMED") confirmed++;

    });

    newRegistrationCount = newRegistrationCount?.data?.length || 0;
    creditReqCount = creditReqCount.length || 0;

   data['New RegistrationCount'] = newRegistrationCount;
    data['Temp Credit Requests'] = creditReqCount;
    data['Hold'] = hold;
    data['Pending'] = pending;
    data['Failed_at_Payment'] = failedAtPayment;
    data['All_Failed'] = allFailed;
    data['Refund'] = refund;
    data['refund_Pending'] = refundPending;
    data['Registered_Agent_Config'] = RegisteredAgentConfig;
    data['depositRequest'] = depositRequest;
    data['amendement'] = amendement;
    data['cancelPending'] = cancelPending;
    data['confirmed'] = confirmed;
    if (newRegistrationCount) {
      return {
        response: "Count Fetch Sucessfully",
        data
      }
    } else {
      return {
        response: 'Data Found Sucessfully',
        data
      }
    }
  } catch (error) {
    console.log(error)
    throw error
  }
};
const checkPanCard = async (req, res) => {
  try {
    const { panNumber } = req.body;

    if (!panNumber) {
      return {
        response: "PAN number is required"
      };
    }

    const apiUrl = Config.PAN_URL;
    const headers = Config.HADDER_3RD_PAERT;

    let responseData = await axios.post(apiUrl, null, {
      headers,
      params: {
        pan_number: panNumber
      }
    });
    // let  responseData =  {
    //     "data": {
    //         "pan_number": "CNAPK1068F",
    //         "pan_status": "VALID",
    //         "pan_status_desc": "Successfully linked to an Aadhaar",
    //         "last_name": "KISHOR",
    //         "first_name": "KAUSHAL",
    //         "middle_name": "",
    //         "pan_holder_title": "Shri",
    //         "pan_last_updated": "19/08/2022",
    //         "pan_aadhaar_seeding": "Y"
    //     }
    // }
    if (responseData) {
      return {
        response: "Data Fetch Sucessfully",
        data: responseData.data
      };
    } else {
      return {
        response: "Some Error in 3rd party api"
      }
    }
  } catch (error) {
    throw error;
  }
};
const checkGstin = async (req, res) => {
  try {
    const { gstNumber } = req.body;

    if (!gstNumber) {
      return {
        response: "GST number is required"
      };
    }

    const apiUrl = Config.GST_URL;
    const headers = Config.GST_TOKEN;
    //  console.log(apiUrl,"<<<==========", headers, "Code is here 114")
    const responseData = await axios.post(
      apiUrl,
      null,
      {
        headers,
        params: {
          gst_number: gstNumber
        }
      });
    // console.log(apiUrl,"<<<==========", responseData.data.data, "Code is here 121")
    if (responseData) {
      return {
        response: "Data Fetch Sucessfully",
        data: responseData.data
      };
    } else {
      return {
        response: "Some Error"
      }
    }
  }
  catch (error) {
    console.log(error);
    throw error
  }
};

const checkAdhar = async (req, res) => {
  try {
    const {adhaarNumber  } = req.body;

    if (!adhaarNumber) {
      return {
        response: "aadhaar number is required"
      };
    }

    const apiUrl = Config.Adhar_URL;
    const headers = Config.GST_TOKEN;
    //  console.log(apiUrl,"<<<==========", headers, "Code is here 114")
    const responseData = await axios.post(
      apiUrl,
      null,
      {
        headers,
        params: {
          aadhaar_number: adhaarNumber
        }
      });
    // console.log(apiUrl,"<<<==========", responseData.data.data, "Code is here 121")
    if (responseData) {
      return {
        response: "Data Fetch Sucessfully",
        data: responseData.data
      };
    } else {
      return {
        response: "Some Error"
      }
    }
  }
  catch (error) {
    console.log(error);
    throw error
  }
};

const AdharVerify = async (req, res) => {
  try {
    const{id,otp}  = req.body;

    if (!id||!otp) {
      return {
        response: "id and otp is required"
      };
    }

    const apiUrl = Config.AdharVerify_URl;
    const headers = Config.GST_TOKEN;
    //  console.log(apiUrl,"<<<==========", headers, "Code is here 114")
    const responseData = await axios.post(
      apiUrl,
      null,
      {
        headers,
        params: {
          id: id,
          otp:otp
        }
      });
    console.log(apiUrl,"<<<==========", responseData.data.data, "Code is here 121")
    if (responseData) {
      return {
        response: "Data Fetch Sucessfully",
        data: responseData.data
      };
    } else {
      return {
        response: "Some Error"
      }
    }
  }
  catch (error) {
    console.log(error);
    throw error
  }
};
module.exports = {
  dashBoardCount,
  checkPanCard,
  checkGstin,
  checkAdhar,
  AdharVerify
}