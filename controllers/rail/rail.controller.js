const railSearchServices = require("./railSearch.services");
const railBookingServices = require("./railBooking.services");
const { ObjectId } = require("mongodb");
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
// const flightSerchLogServices = require("../../controllers/flightSearchLog/flightSearchLog.services");

const railSearch = async (req, res) => {
  try {
    const result = await railSearchServices.getRailSearch(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Provide required fields" ||
      result.response === "Error in fetching data" ||
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
      result.response === "Error in fetching data" ||
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

const getTrainRoute = async (req, res) => {
  try {
    const result = await railSearchServices.railRouteView(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Provide required fields" ||
      result.response === "Error in fetching data" ||
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
      result.response === "Error in fetching data" ||
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
    const { passengerToken, reservationId } = req.body;
    const { error } = validatePsgnToken(passengerToken);
    if (error) return apiErrorres(res, error, 400, true);
    if (!reservationId)
      return apiErrorres(res, "reservationId Required", 400, true);
    const booking = await bookingDetailsRail.findOne({ reservationId });
    if (!booking)
      return apiErrorres(
        res,
        "No Booking Found With Given Reservationid",
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
    const { Authentication, pnr, cancellationId, otp } = req.body;
    if (!Authentication || !pnr || !cancellationId || !otp)
      return apiErrorres(
        res,
        "Required Fields Missing, Authenticaion, pnr, cancellationId, otp",
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
    const { companyId, isRefunded, fromDate, toDate } = req.body;
    const query = {
      ...(companyId && { companyId: new ObjectId(companyId) }),
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
          "Invalid Fromdate | Todate, Todate Must Be A Date Greater Than Or Equal To Fromdate",
          400,
          true
        );
      }
    }
    console.log({ query });

    const cancellations = await RailCancellation.find(query).populate("userId");
    return res.status(200).json({
      IsSucess: true,
      Message: "Cancellations Fetched Successfully",
      Result: cancellations,
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

async function handleFetchTxnHistory(req, res) {
  try {
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      IsSucess: false,
      message: "something went wrong",
      error: error.message,
    });
  }
}
async function handleTDRRequest(req, res) {}

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
  handleFetchTxnHistory,
  handleTDRRequest,
};
