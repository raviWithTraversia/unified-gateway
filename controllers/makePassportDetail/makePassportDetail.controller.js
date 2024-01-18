const makePassportDetailServices = require('./makePassportDetail.services');
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");

const addPassportDetailForAirline = async (req,res) => {
    const result = await makePassportDetailServices.addPassportDetailForAirline(req,res);
    if(result.response == 'Passport Details for airline is saved'){
      apiSucessRes(
          res,
          result.response,
          result.data,
          ServerStatusCode.SUCESS_CODE
      )
  
    }else if(result.response == 'MarkUp Charges Charges Not Added'){
      apiErrorres(
          res,
          result.response,
          ServerStatusCode.RESOURCE_NOT_FOUND,
          true
      )
  
    }
    else{
      apiErrorres(
          res,
          errorResponse.SOME_UNOWN,
          ServerStatusCode.INVALID_CRED,
          true
      )
    }
  };
  const updatePassportDetailForAirline = async (req, res) => {
      try {
        let result = await makePassportDetailServices.updatePassportDetailForAirline(req, res);
        if (result.response == "Markup Data updated successfully") {
          apiSucessRes(
            res,
            result.response,
            CrudMessage.IMAGE_UPLOAD_UPDATED,
            ServerStatusCode.SUCESS_CODE
          );
        } else if (result.response == "MarkUp data not found") {
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
          errorResponse.SOMETHING_WRONG,
          ServerStatusCode.SERVER_ERROR,
          true
        );
      }
  };

  module.exports = {
    addPassportDetailForAirline,
    updatePassportDetailForAirline
  }