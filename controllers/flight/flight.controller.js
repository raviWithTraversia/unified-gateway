const flightSearch = require("./flight.service");
const airPricingCheck = require("./airPricing.service");
const airBooking = require("./airBooking.service");
const ssrServices = require("./ssr.service");
const cancelationServices = require("./cancelation.service");
const partialServices = require("./partialCancelation.service");
const cancelationChargeServices = require("./cancelationCharge.service");
const partialChargeServices = require("./partialCalcelationCharge.service");
const genericCart = require("./genericCart.service");
const amendment = require("./amendment.service");
const amendmentCart = require("./amendmentCart.service");
const amadeus = require("./amadeus/searchFlights.service");
const Config = require("../../configs/config");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");
const flightSerchLogServices = require("../../controllers/flightSearchLog/flightSearchLog.services");
const { getCommonAirPricing } = require("../../services/common-air-pricing");
const { validateSearchRequest } = require("../../validation/search.validation");
const { getCommonRBD } = require("../../services/common-rbd.service");
const {
  getCommonFairRules,
} = require("../../services/common-fair-rules.service");
const {
  validateAirBooking,
} = require("../../validation/air-booking.validation");
const { commonFlightSearch } = require("../../services/common-search");
const { saveLogInFile } = require("../../utils/save-log");
const { importPNRHelper } = require("../../helpers/common-import-pnr.helper");

const getSearch = async (req, res) => {
  console.log(
    `${
      req?.body?.Authentication?.TraceId ?? ""
    } search started at: ${new Date()}`
  );
  try {
    const validationResult = await validateSearchRequest(req);
    // console.log({ validationResult });
    if (!validationResult.response && validationResult.isSometingMissing)
      return apiErrorres(
        res,
        validationResult.data,
        ServerStatusCode.SERVER_ERROR,
        true
      );
    if (
      validationResult.response === "Trace Id Required" ||
      validationResult.response === "Credential Type does not exist" ||
      validationResult.response === "Supplier credentials does not exist" ||
      validationResult.response === "Company or User id field are required" ||
      validationResult.response === "TMC Compnay id does not exist" ||
      validationResult.response === "Travel Type Not Valid" ||
      validationResult.response === "your company not Active"
    )
      return apiErrorres(
        res,
        validationResult.response,
        ServerStatusCode.BAD_REQUEST,
        true
      );

    const isTestEnv = ["LIVE", "TEST"].some((type) =>
      req.body.Authentication?.CredentialType.includes(type)
    );
    const isInternationalRoundTrip =
      req.body.TravelType === "International" &&
      req.body.TypeOfTrip === "ROUNDTRIP";

    const flightRequests = [];
    if (!isInternationalRoundTrip)
      flightRequests.push(flightSearch.getSearch(req, res));
    if (isTestEnv) flightRequests.push(commonFlightSearch(req.body));
    const results = await Promise.allSettled(flightRequests);
    // console.log(results, "results");
    let itineraries = [];
    results.forEach((result) => {
      saveLogInFile("result.json", result);
      // console.dir({ result }, { depth: null });
      if (
        result.status === "fulfilled" &&
        (result?.value?.data?.response?.length || result.value?.data?.length)
      )
        itineraries = [
          ...itineraries,
          ...(result?.value?.data?.response || result.value.data),
        ];
    });
    // "6E", "SG"
    itineraries = itineraries
      .filter((itinerary) =>
        ["Kafila", "1A", "1AN"].includes(itinerary.Provider)
      )
      .sort((a, b) => a.TotalPrice - b.TotalPrice);
    if (itineraries.length) {
      apiSucessRes(
        res,
        "Fetch Data Successfully",
        itineraries,
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
    await flightSerchLogServices.addFlightSerchReport(req);
  } catch (error) {
    console.error(error);
    apiErrorres(
      res,
      error.message || errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  } finally {
    console.log(
      `${
        req?.body?.Authentication?.TraceId ?? ""
      } search finished at ${new Date()}`
    );
  }
};

const airPricing = async (req, res) => {
  try {
    const itsCehck = ["LIVE", "TEST"].some((type) =>
      req.body.Authentication?.CredentialType.includes(type)
    );
    if (itsCehck && req.body.Itinerary?.[0]?.Provider !== "Kafila") {
      console.log("running common api");
      const { result, error } = await getCommonAirPricing(req.body);
      if (error)
        return res.status(500).json({
          IsSucess: false,
          ResponseStatusCode: 500,
          Message: error,
          Result: [],
        });
      return res.status(200).json({
        IsSucess: true,
        ResponseStatusCode: 200,
        Message: "Fetch Data Successfully",
        Result: result,
        ApiReq: {
          Itinerary: result,
        },
      });
    }
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

const getRBD = async (req, res) => {
  try {
    const { result, error } = await getCommonRBD(req.body);
    if (error)
      return apiErrorres(
        res,
        errorResponse.SOMETHING_WRONG,
        ServerStatusCode.SERVER_ERROR,
        true
      );

    return apiSucessRes(
      res,
      "Fetch RBD Result",
      result,
      ServerStatusCode.SUCESS_CODE
    );
  } catch (error) {
    console.log({ error });
    return apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const startBooking = async (req, res) => {
  try {
    const validationResult = await validateAirBooking(req);
    console.log({ validationResult });
    const isValidReq = validationResult.success;
    if (!isValidReq) {
      if (!validationResult.response && validationResult.isSometingMissing) {
        return apiErrorres(
          res,
          validationResult.data,
          ServerStatusCode.SERVER_ERROR,
          true
        );
      }
      if (
        validationResult.response === "Trace Id Required" ||
        validationResult.response === "Credential Type does not exist" ||
        validationResult.response === "Supplier credentials does not exist" ||
        validationResult.response ===
          "Company or User Trace id field are required" ||
        validationResult.response === "TMC Compnay id does not exist" ||
        validationResult.response === "Travel Type Not Valid" ||
        validationResult.response === "allready created booking"
      ) {
        return apiErrorres(
          res,
          validationResult.response,
          ServerStatusCode.BAD_REQUEST,
          true
        );
      }
      if (validationResult.response) {
        return apiErrorres(
          res,
          validationResult.response,
          ServerStatusCode.BAD_REQUEST,
          true
        );
      }
    }
    // if (req.body.ItineraryPriceCheckResponses?.[0]?.Provider !== "Kafila") {
    //   const { result, error } = await commonFlightBook(req.body);
    //   if (error) return apiErrorres(res, error, 500, true);
    //   return apiSucessRes(
    //     res,
    //     "Fetch Data Successfully",
    //     result,
    //     ServerStatusCode.SUCESS_CODE
    //   );
    // }
    const result = await airBooking.startBooking(req, res);
    if (result.response === "Fetch Data Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response === "allready created booking") {
      apiErrorres(res, result.response, ServerStatusCode.UNPROCESSABLE, true);
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
        result?.response || errorResponse.SOME_UNOWN,
        ServerStatusCode.UNPROCESSABLE,
        true
      );
    }
  } catch (error) {
    console.error(error);
    apiErrorres(
      res,
      error?.message || errorResponse.SOMETHING_WRONG,
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
        result.response || errorResponse.SOME_UNOWN,
        ServerStatusCode.UNPROCESSABLE,
        true
      );
    }
  } catch (error) {
    console.error(error);
    apiErrorres(
      res,
      error?.message || errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const partialCancelation = async (req, res) => {
  try {
    const result = await partialServices.partialCancelation(req, res);
    console.log(result?.data, "jdieiiei");
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
    console.log(result?.data, "response");
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
        result?.data || "something went wrong",
        ServerStatusCode.UNPROCESSABLE,
        true
      );
    }
  } catch (error) {
    console.log(error.message);
    apiErrorres(
      res,
      error.message.includes(
        "Cannot read properties of undefined (reading 'Passengers')"
      )
        ? "Try after some time or Contact to call center."
        : error.message,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const updateConfirmBookingStatus = async (req, res) => {
  try {
    const result = await cancelationServices.updateConfirmBookingStatus(
      req,
      res
    );
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
    apiErrorres(res, error.message, ServerStatusCode.SERVER_ERROR, true);
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

const amendmentCartCreate = async (req, res) => {
  try {
    const result = await amendmentCart.amendmentCartCreate(req, res);

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

const updatePendingBookingStatus = async (req, res) => {
  try {
    const result = await cancelationServices.updatePendingBookingStatus(
      req,
      res
    );
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response ===
        "_BookingId or companyId or credentialsType does not exist" ||
      result.response === "Credential Type does not exist" ||
      result.response === "Supplier credentials does not exist" ||
      result.response === "Cancellation is still Pending" ||
      result.response === "Kafila API Data Not Found" ||
      result.response === "Cancelation Data Not Found" ||
      result.response === "TMC companyID Not Found"
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

const getAllAmendment = async (req, res) => {
  try {
    const result = await amendment.getAllAmendment(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "User id does not exist" ||
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

const assignAmendmentUser = async (req, res) => {
  try {
    const result = await amendment.assignAmendmentUser(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "Provide either assignedUser or newCartId" ||
      result.response === "User id does not exist"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (
      result.response === "User assigned Successfully" ||
      result.response === "assignedUser and newCartId assigned successfully" ||
      result.response === "newCartId assigned Successfully"
    ) {
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
    } else if (
      result.response === "Error in deleting Amendment" ||
      result.response === "Provide required fields"
    ) {
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
};

const amadeusTest = async (req, res) => {
  try {
    const result = await amadeus.search(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (
      result.response === "User id does not exist" ||
      result.response === "Error in updating assignedUser"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "User assigned Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
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

async function getFairRules(req, res) {
  try {
    const { result, error } = await getCommonFairRules(req.body);
    if (error)
      return apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);

    apiSucessRes(
      res,
      "Fetch Data Successfully",
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

async function importPNR(req, res) {
  try {
    const { result, error } = await importPNRHelper(req.body);
    if (error)
      return res.status(500).json({
        IsSucess: false,
        Message: error.message,
        ResponseStatusCode: 500,
        Error: error.message,
      });
    return res.status(200).json({
      IsSucess: true,
      ResponseStatusCode: 200,
      Message: "PNR imported successfully",
      Result: result,
    });
  } catch (error) {
    console.log({ errorImportingPNR: error });
    return res.status(500).json({
      IsSucess: false,
      Message: error.message,
      ResponseStatusCode: 500,
      Error: error.message,
    });
  }
}

module.exports = {
  getSearch,
  airPricing,
  getRBD,
  getFairRules,
  startBooking,
  specialServiceReq,
  genericcart,
  fullCancelation,
  partialCancelation,
  partialCancelationCharge,
  fullCancelationCharge,
  updateBookingStatus,
  amendmentDetails,
  amendmentCartCreate,
  getAllAmendment,
  assignAmendmentUser,
  deleteAmendmentDetail,
  amadeusTest,
  updatePendingBookingStatus,
  updateConfirmBookingStatus,
  importPNR,
};
