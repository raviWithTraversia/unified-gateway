const { apiSucessRes, apiErrorres } = require("../../../utils/commonResponce");

const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../../utils/constants");

const commercialServices=require('./railcommercial.service')
const createCommercialPlan = async (req, res) => {
  try {
    const result = await commercialServices.createCommercialPlan(req, res);
if(!result.response){
  apiErrorres(res, errorResponse.SOMETHING_WRONG, ServerStatusCode.SERVER_ERROR, true);
}
   else if (result.response === "TMC ID Required") {
      apiErrorres(res, result.response, ServerStatusCode.SERVER_ERROR, true);
    } else if (result.response === "railCommercial Create succefully") {
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
    apiErrorres(
      res,
   error.message||errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const FindTmcCommercial = async (req, res) => {
  try {
    const result = await commercialServices.FindTmcCommercial(req, res);
    if (result.response === "BookingId is required.") {
      apiErrorres(res, result.response, ServerStatusCode.SERVER_ERROR, true);
    }
    else if(!result.response){
      apiErrorres(res, result.response, ServerStatusCode.SERVER_ERROR, true);
    }
    else if (result.response === "rail Commercial found Succefully") {
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
    apiErrorres(
      res,
   error.message||errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const FindOneCommercial = async (req, res) => {
  try {
    const result = await commercialServices.FindOneCommercial(req, res);
    if (result.response === "BookingId is required.") {
      apiErrorres(res, result.response, ServerStatusCode.SERVER_ERROR, true);
    }
    else if(!result.response){
      apiErrorres(res, result.response, ServerStatusCode.SERVER_ERROR, true);
    }
    else if (result.response === "Commercial Data found Succefully") {
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
    apiErrorres(
      res,
   error.message||errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const updateOneCommercial = async (req, res) => {
  try {
    const result = await commercialServices.updateOneCommercial(req, res);
    if (result.response === "TMC ID Required") {
      apiErrorres(res, result.response, ServerStatusCode.SERVER_ERROR, true);
    }
    else if(!result.response){
      apiErrorres(res, errorResponse.SOMETHING_WRONG, ServerStatusCode.SERVER_ERROR, true);
    }
    else if (result.response === "Update Commercial Succefully") {
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
module.exports={createCommercialPlan,FindTmcCommercial,FindOneCommercial,updateOneCommercial}