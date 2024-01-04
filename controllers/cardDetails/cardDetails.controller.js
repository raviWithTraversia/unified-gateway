const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const cardDetailServices = require("./cardDetails.services");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");

const addCardDetails = async (req, res) => {
  try {
    let result = await cardDetailServices.addCardDetails(req, res);
    if (result.response && result.response.isSometingMissing) {
      apiErrorres(res, result.response, result.data, true);
    } else if (
      result.response == "Card with this card number already exists!"
    ) {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.PRECONDITION_FAILED,
        true
      );
    } else if (result.response == "Card Details Added Sucessfully") {
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
        ServerStatusCode.INVALID_CRED,
        true
      );
    }
  } catch (error) {
    apiErrorres(
      res,
      errorResponse.SOME_UNOWN,
      ServerStatusCode.INVALID_CRED,
      true
    );
  }
};
const deleteCardDetails = async (req, res) => {
  try {
    let result = await cardDetailServices.deleteCardDetails(req, res);
    if (result.response == "Card detail deleted successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "Card detail not found") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.INVALID_CRED,
        true
      );
    }
  } catch (error) {
    apiErrorres(
      res,
      errorResponse.SOME_UNOWN,
      ServerStatusCode.INVALID_CRED,
      true
    );
  }
};

const updateCardDetails = async (req, res) => {
  try {
    const result = await cardDetailServices.updateCardDetails(req, res);
    if (result.response == "Card details update sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "Card details not found") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.INVALID_CRED,
        true
      );
    }
  } catch (error) {
    apiErrorres(
      res,
      errorResponse.SOME_UNOWN,
      ServerStatusCode.INVALID_CRED,
      true
    );
  }
};

const getCardDetails = async (req, res) => {
  try {
    const result = await cardDetailServices.getCardDetails(req, res);
    if (result.response == "Card Details Fetch Sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "Card details not found") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.INVALID_CRED,
        true
      );
    }
  } catch (error) {
    apiErrorres(
      res,
      errorResponse.SOME_UNOWN,
      ServerStatusCode.INVALID_CRED,
      true
    );
  }
};

module.exports = {
  addCardDetails,
  deleteCardDetails,
  updateCardDetails,
  getCardDetails,
};
