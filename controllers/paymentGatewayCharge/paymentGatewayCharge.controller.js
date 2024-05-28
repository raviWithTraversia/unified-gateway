const pgChargesServices = require('./paymentGatewayCharge.services');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const addPgCharges = async (req, res) => {
  try {
    const result = await pgChargesServices.addPgCharges(req, res);
    if (result.response == 'Payment Gateway Charges Insert Sucessfully') {
      apiSucessRes(
        res,
        result.data,
        result.response,
        ServerStatusCode.SUCESS_CODE
      )
    } else if (result.response == 'Payment Gateway Charges Not Added') {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.PRECONDITION_FAILED,
        true
      )
    }
    else if (result.response == 'User Dont have permision to add Pg Charges Details') {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.UNAUTHORIZED,
        true
      )
    }
    else if (result.response == 'Payment gateway charges for this company and provider already exist') {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.PRECONDITION_FAILED,
        true
      )
    }
    else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.PRECONDITION_FAILED,
        true
      )
    }
  }
  catch (error) {
    apiErrorres(
      res,
      error,
      ServerStatusCode.SERVER_ERROR,
      true
    );

  }
}

const editPgcharges = async (req, res) => {
  try {
    const result = await pgChargesServices.editPgcharges(req, res);
    if (result.response == 'Update Pg Cherges Sucessfully') {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      )
    }
    else if (result.response == 'Pg charges Not Updated') {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.PRECONDITION_FAILED,
        true
      )
    } else if (result.response == 'Payment gateway charges for this company and provider already exist') {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.PRECONDITION_FAILED,
        true
      )
    }
    else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.PRECONDITION_FAILED,
        true
      )
    }
  }
  catch (error) {
    apiErrorres(
      res,
      error,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
}

const calculatePgCharges = async (req, res) => {
  try {
    const result = await pgChargesServices.calculatePgCharges(req, res);
    if (result.response) {
      if (result.data) {
        apiSucessRes(
          res,
          result.response,
          result.data,
          ServerStatusCode.SUCESS_CODE
        )
      } else {
        apiErrorres(
          res,
          result.response,
          ServerStatusCode.PRECONDITION_FAILED,
          true
        )
      }
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.PRECONDITION_FAILED,
        true
      )
    }
  }
  catch (error) {
    apiErrorres(
      res,
      error,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const getPgCharges = async (req, res) => {
  try {
    const result = await pgChargesServices.getPgCharges(req, res);
    if (result.response == 'All Payment Method Fetch Sucessful') {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      )
    }
    else if (result.response == 'Payment Method Not Found') {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      )
    } else {
      apiErrorres(
        res,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        errorResponse.SOME_UNOWN,
        true
      )
    }

  } catch (error) {
    apiErrorres(
      res,
      error,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
}

module.exports = {
  addPgCharges,
  editPgcharges,
  calculatePgCharges,
  getPgCharges
}