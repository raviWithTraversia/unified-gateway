const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");

const {
  ServerStatusCode,
  errorResponse,
  ADMIN_USER_TYPE,
  CrudMessage,
} = require("../../utils/constants");
const fareRuleController = require("./fareRules.services");

const addfareRule = async (req, res) => {
  try {
    const result = await fareRuleController.addfareRule(req, res);
    if (result.response == "Fare rule add sucessfully") {
      apiSucessRes(
        res,
        result.data,
        result.response,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "Fare rule not added") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    } else {
      apiErrorres(
        res,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        errorResponse.SOME_UNOWN,
        true
      );
    }
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);
  }
};
const getFareRule = async (req, res) => {
  try {
    const result = await fareRuleController.getFareRule(req, res);
    if (result.response == "Fare Rule Fetch Sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "Fare Rule Not Found") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    } else {
      apiErrorres(
        res,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        errorResponse.SOME_UNOWN,
        true
      );
    }
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);
  }
};
const deleteFareRule = async (req, res) => {
  try {
    const result = await fareRuleController.deleteFareRule(req, res);
    if (result.response == "Fare Rule Deleted Sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "Fare Rule Not Deleted") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    } else {
      apiErrorres(
        res,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        errorResponse.SOME_UNOWN,
        true
      );
    }
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);
  }
};
const updateFareRule = async (req, res) => {
  try {
    const result = await fareRuleController.updateFareRule(req, res);
    if (result.response == "Fare rule Updated Sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "Fare rule Data Not Updated") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    } else {
      apiErrorres(
        res,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        errorResponse.SOME_UNOWN,
        true
      );
    }
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);
  }
};
const getCustomFareRule = async (req,res) => {
  try{
  const result = await fareRuleController.getCustomFareRule(req,res);
  if(result.response == "Fare Rule Fetch Sucessfully"){
    apiSucessRes(
      res,
      result.response,
      result.data,
      ServerStatusCode.SUCESS_CODE
    );
  }
  else if(result.response == "Fare Rule Not Found"){
    apiErrorres(
      res,
      result.response,
      ServerStatusCode.RESOURCE_NOT_FOUND,
      true
    );
  }else{
    apiErrorres(
      res,
      ServerStatusCode.RESOURCE_NOT_FOUND,
      errorResponse.SOME_UNOWN,
      true
    );
  }

  }catch(error){
     apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);

  }
}
module.exports = {
  addfareRule,
  getFareRule,
  deleteFareRule,
  updateFareRule,
  getCustomFareRule
};
