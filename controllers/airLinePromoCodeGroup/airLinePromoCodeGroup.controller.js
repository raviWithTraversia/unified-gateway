const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  ADMIN_USER_TYPE,
  CrudMessage,
} = require("../../utils/constants");
const airlinePromoGoupController = require("./airLinePromoCodeGroup.services");

const addAirlinePromcodeGroup = async (req, res) => {
  try {
    const result = await airlinePromoGoupController.addAirlinePromcodeGroup(
      req,
      res
    );
    if (result.response == "Airline Promocode Group  Added Sucessfully") {
      apiSucessRes(
        res,
        result.data,
        result.response,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "Airline Promocode Group Not Added") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    } else if (
      result.response ==
      "Airline Promo  group with the same name already exists for this company"
    ) {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
      //Airline Promcode all Id should be unique
    } 
    else if (result.response == "Airline Promcode all Id should be unique") {
        apiErrorres(
          res,
          result.response,
          ServerStatusCode.PRECONDITION_FAILED,
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
const getAirlinePromoCodeGroup = async (req, res) => {
  try {
    const result = await airlinePromoGoupController.getAirlinePromoCodeGroup(
      req,
      res
    );
    if (result.response == "Airline Promo Group Fetch Sucessfully") {
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
const editAirlinePromoCodeGroup = async (req, res) => {
  try {
    const result = await airlinePromoGoupController.editAirlinePromoCodeGroup(
      req,
      res
    );
    if (result.response == "Airline Promo Code Group Updated Sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "Airline Promo Code Group Data Not Updated") {
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
const deleteAirlinePromCodeGroup = async (req, res) => {
  try {
    const result = await airlinePromoGoupController.deleteAirlinePromCodeGroup(
      req,
      res
    );
    if (result.response == "Data deleted sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (
      result.response == "Airline Promo Group data not found for this id"
    ) {
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
  addAirlinePromcodeGroup,
  getAirlinePromoCodeGroup,
  editAirlinePromoCodeGroup,
  deleteAirlinePromCodeGroup,
};
