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
const BookingTemp = require("../../models/booking/BookingTemp");
const fixedFareData = require("./fixedFare.service");
const getCommercialForPkFareService = require("./flight.commercial");

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
  getCommonPnrTicket,
} = require("../../services/common-pnrTicket-service");
const {
  getCommonFairRules,
} = require("../../services/common-fair-rules.service");
const {
  validateAirBooking,
} = require("../../validation/air-booking.validation");
const { commonFlightSearch } = require("../../services/common-search");
const { saveLogInFile } = require("../../utils/save-log");
const { importPNRHelper } = require("../../helpers/common-import-pnr.helper");
const travellersDetailsService = require("./travellersDetails.service");
const { getCommercialForPkFare } = require("./flight.commercial");
const { commonSplitPNR } = require("../../services/common-split-pnr");
const {
  commonDateChangeSearch,
} = require("../../services/common-date-change-search");
const {
  getCommonDCAirPricing,
} = require("../../services/common-date-change-pricing");

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
    let isAirlineFilterEligible = true,
      isClassAvlInKafila = false;
    // if (req.body.Airlines?.length)
    //   isAirlineFilterEligible = req.body.Airlines.some((type) =>
    //     ["SG", "6E", "IX", "QP", "FF"].includes(type)
    //   );
    if (["Economy", "Business Class"].includes(req?.body?.ClassOfService))
      isClassAvlInKafila = true;
    const isInternationalRoundTrip =
      req.body.TravelType === "International" &&
      req.body.TypeOfTrip === "ROUNDTRIP";

    const flightRequests = [];
    if (
      !isInternationalRoundTrip &&
      isAirlineFilterEligible &&
      isClassAvlInKafila
    )
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
      // .filter((itinerary) =>
      //   ["Kafila", "1A", "1AN", "6E"].includes(itinerary.Provider)
      // )
      .sort((a, b) => a.TotalPrice - b.TotalPrice);
    if (itineraries.length) {
      apiSucessRes(
        res,
        "Fetch Data Successfully",
        itineraries,
        ServerStatusCode.SUCESS_CODE
      );
    } else {
      apiErrorres(res, "No Data Found", 400, true);
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

const getDateChangeSearch = async (req, res) => {
  try {
    // const validationResult = await validateSearchRequest(req);
    // if (!validationResult.response && validationResult.isSometingMissing)
    //   return apiErrorres(
    //     res,
    //     validationResult.data,
    //     ServerStatusCode.SERVER_ERROR,
    //     true
    //   );
    // if (
    //   validationResult.response === "Trace Id Required" ||
    //   validationResult.response === "Credential Type does not exist" ||
    //   validationResult.response === "Supplier credentials does not exist" ||
    //   validationResult.response === "Company or User id field are required" ||
    //   validationResult.response === "TMC Compnay id does not exist" ||
    //   validationResult.response === "Travel Type Not Valid" ||
    //   validationResult.response === "your company not Active"
    // )
    //   return apiErrorres(
    //     res,
    //     validationResult.response,
    //     ServerStatusCode.BAD_REQUEST,
    //     true
    //   );

    // const isTestEnv = ["LIVE", "TEST"].some((type) =>
    //   req.body.Authentication?.CredentialType.includes(type)
    // );
    let isAirlineFilterEligible = true,
      isClassAvlInKafila = false;
    if (req.body.Airlines?.length)
      isAirlineFilterEligible = req.body.Airlines.some((type) =>
        ["SG", "6E", "IX", "QP", "FF"].includes(type)
      );
    // if (["Economy", "Business Class"].includes(req?.body?.ClassOfService))
    //   isClassAvlInKafila = true;
    const isInternationalRoundTrip =
      req.body.TravelType === "International" &&
      req.body.TypeOfTrip === "ROUNDTRIP";

    const flightRequests = [];
    // if (isTestEnv)
    flightRequests.push(commonDateChangeSearch(req.body));
    const results = await Promise.allSettled(flightRequests);
    // console.log(results, "results");
    let itineraries = [];
    results.forEach((result) => {
      saveLogInFile("result.json", result);
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
        ["Kafila", "1A", "1AN", "6E"].includes(itinerary.Provider)
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
      apiErrorres(res, "No Data Found", 400, true);
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

const getDateChangePricing = async (req, res) => {
  try {
    const { result, error } = await getCommonDCAirPricing(req.body);
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
      return apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);

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

const getPnrTicket = async (req, res) => {
  try {
    // throw new Error("Service Unavailable  The Moment");
    // return false
    if (req.body.paymentMethod === "PG") {
      await BookingTemp.create({
        companyId: req.body.Authentication.CompanyId,
        userId: req.body.Authentication.UserId,
        source: "Kafila",
        BookingId: req.body.bookingId,
        request: JSON.stringify(req.body),
        responce: "Hold Booking Save Successfully",
      });
      return apiSucessRes(
        res,
        "Fetch Process Result",
        "Hold Booking Save Successfully",
        ServerStatusCode.SUCESS_CODE
      );
    } else {
      const { result, error } = await getCommonPnrTicket(req.body, res);
      if (error) {
        throw new Error(error);
      }
      const errorMessage = [
        "Your Balance is not sufficient",
        "Booking data not found",
        "Agent configuration not found",
        "Passenger preferences not found",
        "No passengers found",
        "Hold From Api Side",
        "Booking is not confirmed",
      ];
      if (typeof result[0] === "string" && errorMessage.includes(result[0])) {
        return apiErrorres(
          res,
          result[0] || errorResponse.SOMETHING_WRONG,
          ServerStatusCode.SERVER_ERROR,
          true
        );
      }

      if (error || result.length === 0)
        return apiErrorres(
          res,
          errorResponse.SOMETHING_WRONG,
          ServerStatusCode.SERVER_ERROR,
          true
        );

      return apiSucessRes(
        res,
        "Fetch Process Result",
        result,
        ServerStatusCode.SUCESS_CODE
      );
    }
  } catch (error) {
    console.log({ error });
    return apiErrorres(
      res,
      error.message || errorResponse.SOMETHING_WRONG,
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
    console.log({ bookResponse: result.response });
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
const dateChangeBooking = async (req, res) => {
  try {
    // const validationResult = await validateAirBooking(req);
    // const isValidReq = validationResult.success;
    // if (!isValidReq) {
    //   if (!validationResult.response && validationResult.isSometingMissing) {
    //     return apiErrorres(
    //       res,
    //       validationResult.data,
    //       ServerStatusCode.SERVER_ERROR,
    //       true
    //     );
    //   }
    //   if (
    //     validationResult.response === "Trace Id Required" ||
    //     validationResult.response === "Credential Type does not exist" ||
    //     validationResult.response === "Supplier credentials does not exist" ||
    //     validationResult.response ===
    //       "Company or User Trace id field are required" ||
    //     validationResult.response === "TMC Compnay id does not exist" ||
    //     validationResult.response === "Travel Type Not Valid" ||
    //     validationResult.response === "allready created booking"
    //   ) {
    //     return apiErrorres(
    //       res,
    //       validationResult.response,
    //       ServerStatusCode.BAD_REQUEST,
    //       true
    //     );
    //   }
    //   if (validationResult.response) {
    //     return apiErrorres(
    //       res,
    //       validationResult.response,
    //       ServerStatusCode.BAD_REQUEST,
    //       true
    //     );
    //   }
    // }

    //
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
    const result = await airBooking.handleDateChangeBooking(req, res);
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
        result?.data?.Error || result.response || errorResponse.SOME_UNOWN,
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
const splitPNR = async (req, res) => {
  try {
    if (!req.body?.Authentication) {
      return apiErrorres(
        res,
        "Authentication Details Required",
        ServerStatusCode.BAD_REQUEST,
        true
      );
    }
    if (!req.body?.PNR) {
      return apiErrorres(
        res,
        "PNR Required",
        ServerStatusCode.BAD_REQUEST,
        true
      );
    }

    if (!req.body?.passengarList?.length) {
      return apiErrorres(
        res,
        "Passenger List Required",
        ServerStatusCode.BAD_REQUEST,
        true
      );
    }

    const result = await commonSplitPNR(req.body);
    return apiSucessRes(
      res,
      "PNR Splitted Successfully",
      result,
      ServerStatusCode.SUCESS_CODE
    );

    // if (!result.response && result.isSometingMissing) {
    //   apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    // } else if (
    //   result.response === "Trace Id Required" ||
    //   result.response === "Credential Type does not exist" ||
    //   result.response === "Supplier credentials does not exist" ||
    //   result.response === "Company or User id field are required" ||
    //   result.response === "TMC Compnay id does not exist" ||
    //   result.response === "Travel Type Not Valid" ||
    //   result.response === "Booking Id does not exist"
    // ) {
    //   apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    // } else if (result.response === "Fetch Data Successfully") {
    //   apiSucessRes(
    //     res,
    //     result.response,
    //     result.data,
    //     ServerStatusCode.SUCESS_CODE
    //   );
    // } else {
    //   apiErrorres(
    //     res,
    //     result.response || errorResponse.SOME_UNOWN,
    //     ServerStatusCode.UNPROCESSABLE,
    //     true
    //   );
    // }
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
      result.response === "No booking Found!" ||
      result.response === "PNR Import api Not Working.." ||
      result.response === "Log api is not working..."
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
      result.response === "_BookingId must be an array" ||
      result.response === "_BookingId array is empty" ||
      result.response === "TMC companyID Not Found" ||
      result.response === "Cancellation is still Pending" ||
      result.response === "Kafila API Data Not Found" ||
      result.response === "Invalid fromDate or toDate" ||
      result.response === "TMC companyID Not Found" ||
      result.response === "Kafila API Data Not Found" ||
      result.response === "Cancelation Data Not Found" ||
      result.response === "One Time One Provider Booking Insert"
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
        result.response || errorResponse.SOME_UNOWN,
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
async function getAllTravellers(req, res) {
  try {
    const result = await travellersDetailsService.getAllTravellers(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
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
    apiErrorres(
      res,
      error?.message || errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
}
async function addTravellers(req, res) {
  try {
    const result = await travellersDetailsService.addTravellers(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (result.response === "Travellers details saved successfully.") {
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
    apiErrorres(
      res,
      error?.message || errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
}

const getFixedFare = async (req, res) => {
  try {
    const result = await fixedFareData.getFixedFareService(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (result.response === "fixed Fare Details found sucessfully") {
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
    apiErrorres(
      res,
      error?.message || errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const getCommercialForPkFareController = async (req, res) => {
  try {
    const result = await getCommercialForPkFareService.getCommercialForPkFare(
      req,
      res
    );
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    } else if (result.response === "Fetch Commercial Data Successfully") {
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
    apiErrorres(
      res,
      error?.message || errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};
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
  getPnrTicket,
  getAllTravellers,
  addTravellers,
  getFixedFare,
  getCommercialForPkFareController,
  splitPNR,
  getDateChangeSearch,
  getDateChangePricing,
  dateChangeBooking,
};
