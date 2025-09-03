const railSearchServices = require("./railSearch.services");
const railBookingServices = require("./railBooking.services");
const { ObjectId } = require("mongodb");
const railBillingData=require('./rail-reports.controller')
const {Config}=require('../../configs/config')
const axios=require('axios')

const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");
const {
  cancelRailBooking,
  validatePsgnToken,
  calculateCancellationCharges,
  verifyOTP,
  resendOTP,
} = require("./rail-booking-cancel.service");
const User = require("../../models/User");
const Company = require("../../models/Company");
const RailCancellation = require("../../models/Irctc/rail-cancellation");
const { fetchRailRefundDetails } = require("./rail-refund-details.service");
const bookingDetailsRail = require("../../models/Irctc/bookingDetailsRail");
const moment = require("moment");
const agentConfig=require('../../models/AgentConfig')
const Railleadger=require('../../models/Irctc/ledgerRail')
const { fetchTxnHistory, fileTDR } = require("./tdr.service");
const { string } = require("joi");
// const flightSerchLogServices = require("../../controllers/flightSearchLog/flightSearchLog.services");

const railSearch = async (req, res) => {
  try {
    const result = await railSearchServices.getRailSearch(req, res);
    console.log(result,"djei")
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Provide required fields" ||
      result.response === "No Response from Irctc" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Either User or Company must exist" ||
      result.response === "User role must be Agency" ||
      result.response === "companyId must be TMC"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "Fetch Data Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.UNPROCESSABLE,
        true
      );
    }
  } catch (error) {
    console.error(error);
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
    const result = await railSearchServices.railSearchBtwnDate(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Provide required fields" ||
      result.response === "No Response from Irctc" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Either User or Company must exist" ||
      result.response === "User role must be Agency" ||
      result.response === "companyId must be TMC"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "Fetch Data Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.UNPROCESSABLE,
        true
      );
    }
  } catch (error) {
    console.error(error);
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};
const getTrainStation = async (req, res) => {
  try {
    const result = await railBookingServices.getTrainStation(req, res);
    if (result.response === "Station(s) found successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response === "Station Code and StationName not found") {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.UNPROCESSABLE,
        true
      );
    }
  } catch (error) {
    console.error(error);
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const createTrainStation = async (req, res) => {
  try {
    const result = await railBookingServices.createTrainStation(req, res);
    if (result.response === "Train Station Added Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response === "Provide required fields") {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.UNPROCESSABLE,
        true
      );
    }
  } catch (error) {
        console.error(error);
        if(error.code === "ER_DUP_ENTRY"){
          apiErrorres(res, "Train Station Code already exists", ServerStatusCode.SERVER_ERROR, true);
        }else{  
          apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
          );
        }
}
}

const updateTrainStation = async (req, res) => {
  try {
    const result = await railBookingServices.updateTrainStation(req, res);
    if (result.response === "Train Station Updated Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response === "Train Station not found") {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.UNPROCESSABLE,
        true
      );
    }
  } catch (error) {
        console.error(error);
        if(error.code === "ER_DUP_ENTRY"){
          apiErrorres(res, "Train Station Code already exists", ServerStatusCode.SERVER_ERROR, true);
        }else{  
          apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
          );
        }
      }
}
const getTrainRoute = async (req, res) => {
  try {
    const result = await railSearchServices.railRouteView(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Provide required fields" ||
      result.response === "No Response from Irctc" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Either User or Company must exist" ||
      result.response === "User role must be Agency" ||
      result.response === "companyId must be TMC"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "Fetch Data Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.UNPROCESSABLE,
        true
      );
    }
  } catch (error) {
    console.error(error);
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const getFareEnquiry = async (req, res) => {
  try {
    const result = await railSearchServices.railFareEnquiry(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Provide required fields" ||
      result.response === "No Response from Irctc" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Either User or Company must exist" ||
      result.response === "User role must be Agency" ||
      result.response === "companyId must be TMC"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "Fetch Data Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.UNPROCESSABLE,
        true
      );
    }
  } catch (error) {
    console.error(error);
    apiErrorres(
      res,
     error.message||errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const getBoardingStation = async (req, res) => {
  try {
    const result = await railSearchServices.railBoardingEnquiry(req, res);
    console.log(result)
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Provide required fields" ||
      result.response === "No Response from Irctc" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Either User or Company must exist" ||
      result.response === "User role must be Agency" ||
      result.response === "companyId must be TMC"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "Fetch Data Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.UNPROCESSABLE,
        true
      );
    }
  } catch (error) {
    console.error(error);
    apiErrorres(
      res,
      error.message,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const ChangeBoardingStation = async (req, res) => {
  try {
    const result = await railSearchServices.ChangeBoardingStation(req, res);
    console.log(result)
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Provide required fields" ||
      result.response === "No Response from Irctc" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Either User or Company must exist" ||
      result.response === "User role must be Agency" ||
      result.response === "companyId must be TMC"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "Fetch Data Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.UNPROCESSABLE,
        true
      );
    }
  } catch (error) {
    console.error(error);
    apiErrorres(
      res,
      error.message,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const PnrEnquirry = async (req, res) => {
  try {
    const result = await railSearchServices.PnrEnquirry(req, res);
    console.log(result)
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Provide required fields" ||
      result.response === "No Response from Irctc" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Either User or Company must exist" ||
      result.response === "User role must be Agency" ||
      result.response === "companyId must be TMC"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "Fetch Data Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.UNPROCESSABLE,
        true
      );
    }
  } catch (error) {
    console.error(error);
    apiErrorres(
      res,
      error.message,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};
const DecodeToken = async (req, res) => {
  try {
    const result = await railSearchServices.DecodeToken(req, res);
    res.send(result);
  } catch (error) {
    console.error(error);
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

async function fetchCancellationCharges(req, res) {
  try {
    const { passengerToken, pnr,Authentication,reservationId } = req.body;
    const { error } = validatePsgnToken(passengerToken);
    if (error) return apiErrorres(res, error, 400, true);
    if (!reservationId)
      return apiErrorres(res, "reservationId Required", 400, true);
    const latesPassengerData=await checkPnrStatus(Authentication,pnr)
    if (typeof latesPassengerData === "string") {
      return apiErrorres(
        res,
        latesPassengerData,
        400,
        true
      );
    }
// const currentStatus=
// console.log(latesPassengerData)
const booking = await bookingDetailsRail.findOneAndUpdate(
  { pnrNumber: pnr }, // Match the document by PNR number
  [
    {
      $set: {
        psgnDtlList: {
          $map: {
            input: { $range: [0, { $size: "$psgnDtlList" }] }, // Create a range of indices
            as: "index",
            in: {
              $mergeObjects: [
                { $arrayElemAt: ["$psgnDtlList", "$$index"] }, // Keep existing passenger data
                {
                  currentStatus: {
                    $arrayElemAt: [latesPassengerData.map(item => item.currentStatus), "$$index"]
                  },
                  currentCoachId: {
                    $arrayElemAt: [latesPassengerData.map(item => item.bookingCoachId), "$$index"]
                  },
                  currentBerthCode: {
                    $arrayElemAt: [latesPassengerData.map(item => item.bookingBerthNo), "$$index"]
                  }
                },
              ],
            },
          },
        },
      },
    },
  ],
  { new: true } // Return the updated document
);
;



    if (!booking)
      return apiErrorres(
        res,
        "No Booking Found With Given pnrNuber",
        400,
        true
      );
      
      
    const { error: chargesError, result } = calculateCancellationCharges({
      passengerToken,
      booking,
    });
    if (chargesError) return apiErrorres(res, chargesError, 400, true);
    return apiSucessRes(
      res,
      "Fetched Cancellation Charges",
      result,
      ServerStatusCode.SUCESS_CODE
    );
  } catch (error) {
    console.log({ error });
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
}

async function cancelBooking(req, res) {
  try {
    const { reservationId, txnId, passengerToken, Authentication } = req.body;
    if (!reservationId || !txnId || !passengerToken || !Authentication)
      return res.status(400).json({
        IsSucess: false,
        Message: "Provide required fields",
        ResponseStatusCode: 400,
        Error: true,
      });

    if (!["LIVE", "TEST"].includes(Authentication?.CredentialType))
      return res.status(400).json({
        IsSucess: false,
        Message: "Credential Type does not exist",
        ResponseStatusCode: 400,
        Error: true,
      });

    const checkUser = await User.findById(Authentication?.UserId).populate(
      "roleId"
    );
    const checkCompany = await Company.findById(Authentication?.CompanyId);
    if (!checkUser || !checkCompany)
      return res.status(400).json({
        IsSucess: false,
        Message: "Either User or Company must exist",
        ResponseStatusCode: 400,
        Error: true,
      });

    req.body.user = checkUser;
    req.body.company = checkCompany;

    const { isValid, error } = validatePsgnToken(passengerToken);
    if (!isValid)
      return res.status(400).json({
        IsSucess: false,
        Message: error,
        ResponseStatusCode: 400,
        Error: true,
      });
    const response = await cancelRailBooking(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
}
async function verifyCancellationOTP(req, res) {
  try {
    const { Authentication, pnr, cancellationId, otp,reservationId } = req.body;
    const cancelRailBookings=await RailCancellation.findOne({reservationId:reservationId})

    if(!cancellationId){
      req.body.cancellationId=cancelRailBookings.cancellationId
}
    if (!Authentication || !pnr || !otp)
      return apiErrorres(
        res,
        "Required Fields Missing, Authenticaion, pnr, otp",
        400,
        true
      );
    const { error, result } = await verifyOTP(req.body);
    if (error) return apiErrorres(res, "OTP Verification Failed", 400, error);
    return apiSucessRes(res, "OTP Verification Successful", result, 200);
  } catch (error) {
    console.log({ error });
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
}
async function resendCancellationOTP(req, res) {
  try {
    const { Authentication, pnr, cancellationId } = req.body;
    if (!Authentication || !pnr || !cancellationId)
      return apiErrorres(
        res,
        "Required Fields Missing, Authenticaion, pnr, cancellationId",
        400,
        true
      );
    const { error, result } = await resendOTP(req.body);

    if (error) return apiErrorres(res, "Error While Resending OTP", 500, error);
    return apiSucessRes(res, "OTP Resent", result, 200);
  } catch (error) {
    console.log({ error });
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
}

async function fetchRefundDetails(req, res) {
  try {
    const { reservationId, cancellationId, Authentication } = req.body;
    if (!reservationId || !cancellationId)
      return apiErrorres(
        res,
        "Missing Required Parameters, reservationId, cancellationId",
        400,
        true
      );
    if (!["LIVE", "TEST"].includes(Authentication?.CredentialType))
      return res.status(400).json({
        IsSucess: false,
        Message: "Credential Type does not exist",
        ResponseStatusCode: 400,
        Error: true,
      });

    const checkUser = await User.findById(Authentication?.UserId).populate(
      "roleId"
    );
    const checkCompany = await Company.findById(Authentication?.CompanyId);
    if (!checkUser || !checkCompany)
      return res.status(400).json({
        IsSucess: false,
        Message: "Either User Or Company Must Exist",
        ResponseStatusCode: 400,
        Error: true,
      });
    const cancellationDetails = await RailCancellation.findOne({
      reservationId,
    });
    if (!cancellationDetails)
      return apiErrorres(
        res,
        `Cancellation Request Not Found With Given Reservation Id ${reservationId}`,
        404,
        true
      );
    const { result, status } = await fetchRailRefundDetails(req.body);
    return res.status(status).json(result);
  } catch (error) {
    console.log({ error });
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
}

async function updateCancellationDetails(req, res) {
  try {
    const { txnId, refundAmount,cancellationCharge } = req.body;
    if (!txnId || !refundAmount||!cancellationCharge)
      return apiErrorres(
        res,
        "Missing Required Parameter Cancellation Id Or Data",
        400,
        true
      );
    


    const cancellationDetails = await RailCancellation.findOneAndUpdate({txnId:txnId},{$set:{
      refundAmount:refundAmount,
      cashDeducted:cancellationCharge,
      status:"REFUNDED",
      isRefunded:true
    }},
      { new: true }
    );


    if (!cancellationDetails)
      return res.status(200).json({
        IsSucess: false,
        Message: "Cancellation Details Not Found",
        ResponseStatusCode: 404,
        Error: true,
      });
      const agencyConfig = await agentConfig.findOneAndUpdate(
        { userId: cancellationDetails.userId },  // Filter criteria to find the document
        { $inc: { railCashBalance: refundAmount } },  // Increment the railCashBalance by refundAmount
        { new: true }  // Return the updated document
      );
      
if(!agencyConfig)
  return res.status(200).json({
    IsSucess: false,
    Message: "agencyConfig Details Not Found",
    ResponseStatusCode: 404,
    Error: true,
  });

console.log(agencyConfig,"agencyConfing")
 const BookingData=await bookingDetailsRail.findOneAndUpdate({cartId:txnId},{$set:{IsRefunded:true}},{new:true})

await Railleadger.create({
  userId: agencyConfig.userId,
  companyId: agencyConfig.companyId,
  ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
  transactionAmount:refundAmount ,
  cartId:`Manual ${BookingData?.providerbookingId}`,
  currencyType: "INR",
  fop: "CREDIT",
  transactionType: "CREDIT",
  runningAmount:agencyConfig.railCashBalance,
  remarks: "Manual Refund against cancellation",
  transactionBy: req.user._id,
});






    return res.status(200).json({
      IsSucess: true,
      Message: "Cancellation Details Updated Successfully",
      ResponseStatusCode: 200,
      Data: cancellationDetails,
      Error: false,
    });
  } catch (error) {
    console.log({ error });
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
}

async function fetchCancellations(req, res) {
  try {
    // date,
    const { companyId, agencyId, isRefunded, fromDate, toDate } = req.body;
    const query = {
      ...(agencyId && { agencyId: new ObjectId(agencyId) }),
      ...(isRefunded != null && { isRefunded }),
    };

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) {
        if (!moment(fromDate, "YYYY-MM-DD", true).isValid())
          return apiErrorres(
            res,
            "invalid fromDate format, must be YYYY-MM-DD",
            400,
            true
          );

        let startDate = moment(fromDate)
          .set("hour", 0)
          .set("minute", 0)
          .set("second", 0)
          .toDate();
        query.createdAt["$gte"] = startDate;
      }
      if (toDate) {
        if (!moment(toDate, "YYYY-MM-DD", true).isValid())
          return apiErrorres(
            res,
            "invalid toDate format, must be YYYY-MM-DD",
            400,
            true
          );
        let endDate = moment(toDate)
          .set("hour", 23)
          .set("minute", 59)
          .second(59)
          .toDate();
        query.createdAt["$lte"] = endDate;
      }
    }
    if (fromDate && toDate) {
      if (moment(toDate).isBefore(fromDate)) {
        return apiErrorres(
          res,
          "Invalid From Date | To Date, To Date Must Be A Date Greater Than Or Equal To From Date",
          400,
          true
        );
      }
    }
    // console.log({ query });

    const cancellations = await RailCancellation.aggregate([
  { $match: query }, // match your filter
  {$sort:{createdAt:-1}},
  {
    $lookup: {
      from: "users",            // "userId" ka reference collection name
      localField: "userId",     // field in RailCancellation
      foreignField: "_id",      // field in users
      as: "userId"
    }
  },
  {
    $unwind: {
      path: "$userId",
      preserveNullAndEmptyArrays: true // same as populate's default behavior
    }
  },
  {
    $lookup:{
      from:"bookingdetailsrails",
      localField:"txnId",
      foreignField:"cartId",
      as:"bookingDetails"

    }
  },

  {
    $unwind: {
      path: "$bookingDetails",
      preserveNullAndEmptyArrays: true // same as populate's default behavior
    }
  },
  {
    $group: {
      _id: "$_id",
      doc: { $first: "$$ROOT" }
    }
  },
  { $sort: { createdAt: -1 } }
]);

    return res.status(200).json({
      IsSucess: true,
      Message: "Cancellations Fetched Successfully",
      Result:cancellations.length>0? cancellations.map((doc)=> doc.doc):[],
    });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      IsSucess: false,
      Message: "Something Went Wrong",
      Error: error.message,
    });
  }
}

async function handleFetchTDRReasons(req, res) {
  try {
    const tdrReasons = [
      {
        reasonIndex: "2",
        tdrReason:
          "Train Late More Than Three Hours and Passenger Not Travelled.",
      },
      {
        reasonIndex: "3",
        tdrReason: "Difference Of Fare In Case proper Coach Not Attached.",
      },
      {
        reasonIndex: "4",
        tdrReason: "Ac Failure",
      },
      {
        reasonIndex: "7",
        tdrReason:
          "Party Partially Travelled. (Journey terminated short of destination) ",
      },
      {
        reasonIndex: "8",
        tdrReason: "ALL Confirmed Passenger Not Travelled",
      },
      {
        reasonIndex: "9",
        tdrReason: "Train Diverted And Passenger Not Travelled",
      },
      {
        reasonIndex: "11",
        tdrReason: "Train Diverted And Train Not Touching Boarding Station.",
      },
      {
        reasonIndex: "12",
        tdrReason: "Train Diverted And Train Not Touching Destination Station.",
      },
      {
        reasonIndex: "13",
        tdrReason:
          "Passenger Not Travelled As Reservation Provided In Lower Class.",
      },
      {
        reasonIndex: "14",
        tdrReason:
          "Passenger Not Travelled Due To Ticket In RAC After Chart Preparation.",
      },
      {
        reasonIndex: "15",
        tdrReason: "Train Terminated Short Of Destination.",
      },
      {
        reasonIndex: "17",
        tdrReason:
          "Party Partially Confirmed/Waitlisted And All Passengers Did Not Travel.",
      },
      {
        reasonIndex: "16",
        tdrReason:
          "Party Partially Confirmed/Waitlisted And Waitlisted Passengers Did Not Travel.",
      },
      {
        reasonIndex: "22",
        tdrReason: "Difference Of Fare As Passenger Travelled In Lower Class.",
      },
      {
        reasonIndex: "25",
        tdrReason: "Passenger Not Travelled Due To Coach Damage.",
      },
      {
        reasonIndex: "29",
        tdrReason:
          "Passengers Not Allowed To Travel by Railway due To COVID-19 Condition",
      },
      {
        reasonIndex: "28",
        tdrReason:
          "Unable To Cancel Due To Train Restored After Train Cancellation.",
      },
    ];
    return apiSucessRes(
      res,
      "TDR Reasons Fetched",
      tdrReasons,
      ServerStatusCode.SUCESS_CODE
    );
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      IsSucess: false,
      message: "something went wrong",
      error: error.message,
    });
  }
}
async function handleFetchTxnHistory(req, res) {
  try {
    const { Authentication, txnId } = req.body;
    if (!Authentication || !txnId)
      return apiErrorres(
        res,
        "Missing Fields | Authentication or txnId",
        400,
        true
      );
    const { result, error } = await fetchTxnHistory(req.body);
    if (error) return apiErrorres(res, error, 400, result);
    return apiSucessRes(
      res,
      "History Fetched",
      result,
      ServerStatusCode.SUCESS_CODE
    );
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      IsSucess: false,
      message: "something went wrong",
      error: error.message,
    });
  }
}
async function handleTDRRequest(req, res) {
  try {
    const { Authentication, txnId, passengerToken, reasonIndex } = req.body;
    if (
      !Authentication ||
      !txnId ||
      !passengerToken ||
      !reasonIndex ||
      !Authentication?.UserId ||
      !Authentication?.Agency ||
      !Authentication?.CompanyId
    )
      return apiErrorres(
        res,
        "Missing Fields | Authentication or txnId or passengerToken or reasonIndex or Authentication.UserId or Authentication.CompanyId or Authentication.Agency",
        400,
        true
      );
    const { result, error } = await fileTDR(req.body);
    if (error) return apiErrorres(res, error, 400, result);
    return apiSucessRes(
      res,
      "TDR Requested",
      result,
      ServerStatusCode.SUCESS_CODE
    );
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      IsSucess: false,
      message: "something went wrong",
      error: error.message,
    });
  }
}

const getBillingRailData = async (req, res) => {
  try {
    const result = await railBillingData.getBillingRailData(req);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (result.response === "Data Not Found" || result.response === "Please provide required fields" || result.response === "Access Denied! Provide a valid Key!") {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "Fetch Data Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.UNPROCESSABLE,
        true
      );
    }
  } catch (error) {
    console.log(error)
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};
const updateBillPost = async (req, res) => {
  try {
    const result = await railBillingData.updateBillPost(req);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (result.response === "Data Not Found" || result.response === "Please provide valid AccountPost" || result.response === "Error in Updating AccountPost") {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "AccountPost Updated Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.UNPROCESSABLE,
        true
      );
    }
  } catch (error) {
    console.log(error)
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
}

const checkPnrStatus = async (Authentication, pnr) => {
  try {
    const url =
      Authentication.CredentialType === "LIVE"
        ? `${Config.LIVE.baseURLBackend}/api/rail/Pnr-enquiry`
        : `${Config.TEST.baseURLBackend}/api/rail/Pnr-enquiry`;



    const response = await axios.post(
      url,
      {
        Authentication: Authentication, // Request body
        pnr: pnr,
      },
      {
        headers: {
          "Content-Type": "application/json",
         },
      }
    );
console.log(response?.data?.Result?.passengerList)
if(!response?.data?.Result?.passengerList){
  console.log(response?.data?.Result?.errorMessage)
  return response?.data?.Result?.errorMessage
}
const currentStatus=[]
  for(var data of response?.data?.Result?.passengerList){
    currentStatus.push({currentStatus:data?.currentStatus,bookingBerthNo:data?.bookingBerthNo,currentBerthNo:data?.currentBerthNo})
  };
  return currentStatus
  } catch (error) {
    console.error("Error in PNR status check:", error.message);
    return error.message; // Handle errors as needed
  }
};
module.exports = {
  railSearch,
  railSearchBtwnDate,
  getTrainStation,
  getTrainRoute,
  getFareEnquiry,
  DecodeToken,
  fetchCancellationCharges,
  cancelBooking,
  verifyCancellationOTP,
  resendCancellationOTP,
  fetchRefundDetails,
  updateCancellationDetails,
  fetchCancellations,
  handleFetchTDRReasons,
  handleFetchTxnHistory,
  createTrainStation,
  handleTDRRequest,
  getBoardingStation,
  ChangeBoardingStation,
  PnrEnquirry,
  getBillingRailData,
  updateBillPost,
  updateTrainStation,
  checkPnrStatus
};
