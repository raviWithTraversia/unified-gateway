const payuServices = require("./payu.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");

const payu = async (req, res) => {
    try {
        const result = await payuServices.payu(req, res);
        if (result.response == "payU sha token generate successfully") {
          apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
          );
        } else if (result.response == "Data does not exist") {
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
const payuSuccess = async (req, res) => 
  {
    try {
      const result = await payuServices.payuSuccess(req, res);      
      res.send(result);
      // if (result.response == "Success") {
      //   apiSucessRes(
      //     res,
      //     result.response,
      //     result.data,
      //     ServerStatusCode.SUCESS_CODE
      //   );
      // } else if (result.response == "Data does not exist") {
      //   apiErrorres(
      //     res,
      //     result.response,
      //     ServerStatusCode.RESOURCE_NOT_FOUND,
      //     true
      //   );
      // } else {
      //   apiErrorres(
      //     res,
      //     errorResponse.SOME_UNOWN,
      //     ServerStatusCode.INVALID_CRED,
      //     true
      //   );
      // }
    } catch (error) {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.INVALID_CRED,
        true
      );
    }
    
  }
  const payuFail = async (req, res) => 
    {
      try {
        const result = await payuServices.payuFail(req, res);
        res.send(result);
        // if (result.response == "Failed") {
        //   apiSucessRes(
        //     res,
        //     result.response,
        //     result.data,
        //     ServerStatusCode.SUCESS_CODE
        //   );
        // } else if (result.response == "Data does not exist") {
        //   apiErrorres(
        //     res,
        //     result.response,
        //     ServerStatusCode.RESOURCE_NOT_FOUND,
        //     true
        //   );
        // } else {
        //   apiErrorres(
        //     res,
        //     errorResponse.SOME_UNOWN,
        //     ServerStatusCode.INVALID_CRED,
        //     true
        //   );
        // }
      } catch (error) {
        apiErrorres(
          res,
          errorResponse.SOME_UNOWN,
          ServerStatusCode.INVALID_CRED,
          true
        );
      }
  
    }
module.exports = {
  payu,payuSuccess,payuFail
};
