const flightSearch = require("./flight.service");
const airPricingCheck = require("./airPricing.service");
const airBooking = require("./airBooking.service");
const ssrServices = require("../flight/ssr.service");
const cancelationServices = require("../flight/cancelation.service");
const partialServices = require("../flight/partialCancelation.service");
const cancelationChargeServices = require("../flight/cancelationCharge.service");
const partialChargeServices = require("../flight/partialCalcelationCharge.service");
const genericCart = require("../flight/genericCart.service");
const amendment = require("../flight/amendment.service");

const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");
const flightSerchLogServices = require("../../controllers/flightSearchLog/flightSearchLog.services");

const getSearch = async (req, res) => {
  try {
    const result = await flightSearch.getSearch(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Trace Id Required" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Supplier credentials does not exist" ||
      result.response === "Company or User id field are required" ||
      result.response === "TMC Compnay id does not exist" ||
      result.response === "Travel Type Not Valid"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "Fetch Data Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
      await flightSerchLogServices.addFlightSerchReport(req);
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

const airPricing = async (req, res) => {
  try {
    const result = await airPricingCheck.airPricing(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Trace Id Required" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Supplier credentials does not exist" ||
      result.response === "Company or User id field are required" ||
      result.response === "TMC Compnay id does not exist" ||
      result.response === "Travel Type Not Valid"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "Fetch Data Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE,
        result.apiReq
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

const startBooking = async (req, res) => {
  try {
    const result = await airBooking.startBooking(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Trace Id Required" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Supplier credentials does not exist" ||
      result.response === "Company or User id field are required" ||
      result.response === "TMC Compnay id does not exist" ||
      result.response === "Travel Type Not Valid"
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

const specialServiceReq = async (req, res) => {
  try {
    const result = await ssrServices.specialServiceReq(req, res);

    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Trace Id Required" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Supplier credentials does not exist" ||
      result.response === "Company or User id field are required" ||
      result.response === "TMC Compnay id does not exist" ||
      result.response === "Travel Type Not Valid" ||
      result.response === "Data Not Found"
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

const genericcart = async (req, res) => {
  try {
    const result = await genericCart.genericcart(req, res);

    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Trace Id Required" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Supplier credentials does not exist" ||
      result.response === "Company or User id field are required" ||
      result.response === "TMC Compnay id does not exist" ||
      result.response === "Travel Type Not Valid" ||
      result.response === "Data Not Found"
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

const fullCancelation = async (req, res) => {
  try {
    const result = await cancelationServices.fullCancelation(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Trace Id Required" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Supplier credentials does not exist" ||
      result.response === "Company or User id field are required" ||
      result.response === "TMC Compnay id does not exist" ||
      result.response === "Travel Type Not Valid" ||
      result.response === "Booking Id does not exist"
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

const fullCancelationCharge = async (req, res) => {
  try {
    const result = await cancelationChargeServices.fullCancelationCharge(
      req,
      res
    );
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Trace Id Required" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Supplier credentials does not exist" ||
      result.response === "Company or User id field are required" ||
      result.response === "TMC Compnay id does not exist" ||
      result.response === "Travel Type Not Valid" ||
      result.response === "Booking Id does not exist"
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

const partialCancelation = async (req, res) => {
  try {
    const result = await partialServices.partialCancelation(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Trace Id Required" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Supplier credentials does not exist" ||
      result.response === "Company or User id field are required" ||
      result.response === "TMC Compnay id does not exist" ||
      result.response === "Travel Type Not Valid" ||
      result.response === "Booking Id does not exist"
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

const partialCancelationCharge = async (req, res) => {
  try {
    const result = await partialChargeServices.partialCancelationCharge(
      req,
      res
    );
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Trace Id Required" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Supplier credentials does not exist" ||
      result.response === "Company or User id field are required" ||
      result.response === "TMC Compnay id does not exist" ||
      result.response === "Travel Type Not Valid" ||
      result.response === "Booking Id does not exist"
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

const updateBookingStatus = async (req, res) => {
  try {
    const result = await cancelationServices.updateBookingStatus(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response ===
      "_BookingId or companyId or credentialsType does not exist" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Supplier credentials does not exist" ||
      result.response === "Error in updating Status!" ||
      result.response === "No booking Found!"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "Status updated Successfully!") {
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

const amendmentDetails = async (req, res) => {
  try {
    const result = await amendment.amendment(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Booking Id does not exist" ||
      result.response === "Config does not exist" ||
      result.response === "Not Save Booking Data" ||
      result.response === "Amendment with this AmendmentId already exists" ||
      result.response === "Failed to create passenger preference amendment" ||
      result.response === "PassengerPrefence Not Exits" ||
      result.responce === "Failed to save booking data" ||
      result.responce === "Sector not found" ||
      result.responce === "SRC DESC does not exist"
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

const getAllAmendment = async (req, res) => {
  try {
    const result = await amendment.getAllAmendment(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (result.response === "User id does not exist" || result.response === "Data Not Found") {
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

const assignAmendmentUser = async (req, res) => {
  try {
    const result = await amendment.assignAmendmentUser(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (result.response === "Provide either assignedUser or newCartId" || result.response === "User id does not exist") {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "User assigned Successfully" || result.response === "assignedUser and newCartId assigned successfully" || result.response === "newCartId assigned Successfully") {
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

const deleteAmendmentDetail = async (req, res) => {
  try {
    const result = await amendment.deleteAmendmentDetail(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (result.response === "Error in deleting Amendment" || result.response === "Provide required fields") {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "Amendment deleted Successfully") {
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
}

module.exports = {
  getSearch,
  airPricing,
  startBooking,
  specialServiceReq,
  genericcart,
  fullCancelation,
  partialCancelation,
  partialCancelationCharge,
  fullCancelationCharge,
  updateBookingStatus,
  amendmentDetails,
  getAllAmendment,
  assignAmendmentUser,
  deleteAmendmentDetail
};
