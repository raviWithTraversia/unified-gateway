const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  ADMIN_USER_TYPE,
  CrudMessage,
} = require("../../utils/constants");
const fareRuleGoupController = require("./fareRuleGroup.services");

const addFareRuleGroup = async (req, res) => {
  try {
    const result = await fareRuleGoupController.addFareRuleGroup(req, res);
    if (result.response == "FareRule Group Added Sucessfully") {
      apiSucessRes(
        res,
        result.data,
        result.response,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "FareRule Group Not Added") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    }  else if (result.response == "Fare rule group with the same name already exists for this company") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    }
    else {
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

const getFareRuleGroup = async (req, res) => {
  try {
    const result = await fareRuleGoupController.getFareRuleGroup(req, res);
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

const editFareRuleGroup = async (req, res) => {
  try {
    const result = await fareRuleGoupController.editFareRuleGroup(req, res);
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
    } else if (result.response == "Fare rule group with the same name already exists for this company") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    }
    else {
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

const getCustomFareRule = async (req, res) => {
  try {
    const result = await fareRuleGoupController.getCustomFareRule(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    }else if (result.response === "Company field are required" || result.response === "TMC Compnay id does not exist" || result.response === "Fare Group Not Found!!" || result.response === "User Id Not Available") {
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
    apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);
  }
};


const deleteFareRuleGroup = async (req, res) => {
  try {
    const result = await fareRuleGoupController.deleteFareRuleGroup(req, res);
    if (result.response == "Data deleted sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "Farerule Group data not found for this id") {
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
module.exports = {
  addFareRuleGroup,
  getFareRuleGroup,
  editFareRuleGroup,
  deleteFareRuleGroup,
  getCustomFareRule
};
