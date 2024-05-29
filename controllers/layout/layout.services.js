const registration = require('../../models/Registration');
const creditRequest = require('../../models/CreditRequest');
const bookingdetails = require("../../models/booking/BookingDetails");
const company = require("../../models/Company");
const depositDetail = require("../../models/DepositRequest");

const axios = require('axios');
const { Config } = require("../../configs/config");
const registrationServices = require('../../controllers/registration/registration.services')

const dashBoardCount = async (req, res) => {
  try {
    let { companyId } = req.query;
    let data = {};
    let req1 = { params: { companyId: companyId } };
    let fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(new Date().getDate() - 1);

    let [newRegistrationCount, creditReqCount, getBookingDetails, RegisteredAgentConfig, depositRequest] = await Promise.all([
      registrationServices.getAllRegistrationByCompany(req1, res),
      creditRequest.find({ companyId: companyId }),
      bookingdetails.find({ createdAt: { $gte: new Date((fifteenDaysAgo.toISOString().split("T"))[0]) }, companyId }, { bookingStatus: 1 }),
      company.countDocuments({ parent: companyId }),
      depositDetail.countDocuments({ companyId, status: "pending" })
    ]);

    let cancelPending = 0, pending = 0, hold = 0, failedAtPayment = 0, allFailed = 0, refund = 0, refundPending = 0, amendement = 0

    getBookingDetails.map(item => {
      if (item.bookingStatus == "PENDING") pending++;
      if (item.bookingStatus == "HOLD") hold++;
      if (item.bookingStatus == "FAILEDPAYMENT") failedAtPayment++;
      if (item.bookingStatus == "FAILED") allFailed++;
      if (item.bookingStatus == "REFUND") refund++;
      if (item.bookingStatus == "CANCELLATION PENDING") cancelPending++;
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

module.exports = {
  dashBoardCount,
  checkPanCard,
  checkGstin
}