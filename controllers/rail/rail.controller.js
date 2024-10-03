const railSearchServices = require("./railSearch.services");
const railBookingServices = require("./railBooking.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");
const {
  cancelRailBooking,
  validatePsgnToken,
} = require("./rail-booking-cancel.service");
const User = require("../../models/User");
const Company = require("../../models/Company");
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

    if (checkUser?.roleId?.name !== "Agency")
      return res.status(400).json({
        IsSucess: false,
        Message: "User role must be Agency",
        ResponseStatusCode: 400,
        Error: true,
      });

    if (checkCompany?.type !== "TMC")
      return res.status(400).json({
        IsSucess: false,
        Message: "companyId must be TMC",
        ResponseStatusCode: 400,
        Error: true,
      });

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
module.exports = {
  railSearch,
  railSearchBtwnDate,
  getTrainStation,
  getTrainRoute,
  getFareEnquiry,
  DecodeToken,
  cancelBooking,
};
