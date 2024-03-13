const flightSearch = require("./flight.service");
const airPricingCheck = require("./airPricing.service");
const airBooking = require("./airBooking.service");
const ssrServices = require('../flight/ssr.service')
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");
const flightSerchLogServices = require('../../controllers/flightSearchLog/flightSearchLog.services');

const getSearch = async (req, res) => {
    try {
        const result = await flightSearch.getSearch(req, res);
        if (!result.response && result.isSometingMissing) {
          apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        }else if (result.response === "Trace Id Required" || result.response === "Credential Type does not exist" || result.response === "Supplier credentials does not exist" || result.response === "Company or User id field are required" || result.response === "TMC Compnay id does not exist" || result.response === "Travel Type Not Valid") {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
        }else if (result.response === "Fetch Data Successfully") {
          apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
          );
          await flightSerchLogServices.addFlightSerchReport(req)
        }else {
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

const airPricing = async(req, res) => {
  try {
    const result = await airPricingCheck.airPricing(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    }else if (result.response === "Trace Id Required" || result.response === "Credential Type does not exist" || result.response === "Supplier credentials does not exist" || result.response === "Company or User id field are required" || result.response === "TMC Compnay id does not exist" || result.response === "Travel Type Not Valid") {
        apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    }else if (result.response === "Fetch Data Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE,
        result.apiReq
      );
    }else {
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

const startBooking = async(req, res) => {
  try {
    const result = await airBooking.startBooking(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    }else if (result.response === "Trace Id Required" || result.response === "Credential Type does not exist" || result.response === "Supplier credentials does not exist" || result.response === "Company or User id field are required" || result.response === "TMC Compnay id does not exist" || result.response === "Travel Type Not Valid") {
        apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    }else if (result.response === "Fetch Data Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    }else {
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

const specialServiceReq = async (req , res) => {
  try{
  const result = await ssrServices.specialServiceReq(req,res);
   
  if (!result.response && result.isSometingMissing) {
    apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
  }else if (result.response === "Trace Id Required" || result.response === "Credential Type does not exist" || result.response === "Supplier credentials does not exist" || result.response === "Company or User id field are required" || result.response === "TMC Compnay id does not exist" || result.response === "Travel Type Not Valid") {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
  }else if (result.response === "Fetch Data Successfully") {
    apiSucessRes(
      res,
      result.response,
      result.data,
      ServerStatusCode.SUCESS_CODE
    );
  }else {
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
module.exports = {getSearch, airPricing, startBooking, specialServiceReq};
