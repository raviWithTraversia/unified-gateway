const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  ADMIN_USER_TYPE,
  CrudMessage,
} = require("../../utils/constants");
const paymentGatewayChargeGoupController = require("./paymentGatewayChargeGroup.services");

const addPaymentGatewayChargeGroup = async (req, res) => {
  try {
    const result = await paymentGatewayChargeGoupController.addPaymentGatewayChargeGroup(req, res);
    if (result.response == "PaymentGatewayCharge Group  Added Sucessfully") {
      apiSucessRes(
        res,
        result.data,
        result.response,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "PaymentGatewayCharge Group Not Added") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    }  else if (result.response == "Paymentgateway charge group with the same name already exists for this company") {
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

const getPaymentGatewayChargeGroup = async (req, res) => {
  try {
    const result = await paymentGatewayChargeGoupController.getPaymentGatewayChargeGroup(req, res);
    if (result.response == "PaymentGateway Group Fetch Sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "PaymentGateway Group Not Found") {
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

const editPaymentGatewayChargeGroup = async (req, res) => {
  try {
    const result = await paymentGatewayChargeGoupController.editPaymentGatewayChargeGroup(req, res);
    if (result.response == "PaymentGatewayChargeGroup Updated Sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "PaymentGatewayChargeGroup Data Not Updated") {
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
const deletePaymentGatewayChargeGroup = async (req, res) => {
  try {
    const result = await paymentGatewayChargeGoupController.deletePaymentGatewayChargeGroup(req, res);
    if (result.response == "Data deleted sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "PaymentGatewayChargeGroup data not found for this id") {
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
  addPaymentGatewayChargeGroup,
  getPaymentGatewayChargeGroup,
  editPaymentGatewayChargeGroup,
  deletePaymentGatewayChargeGroup
};
