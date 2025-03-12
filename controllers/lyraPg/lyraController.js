const lyraService=require('./lyraService')
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
    ServerStatusCode,
    errorResponse,
    CrudMessage,
  } = require("../../utils/constants");
  
const lyraSuccess = async (req, res) => 
    {
      try {
        const result = await lyraService.lyraSuccess(req, res);     
        console.log(result) 
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
        console.log(error)
        apiErrorres(
          res,
          errorResponse.SOME_UNOWN,
          ServerStatusCode.INVALID_CRED,
          true
        );
      }
      
    }
  
    const railPayuSuccess = async (req, res) => 
      {
        try {
          const result = await lyraService.lyraWalletRailResponceSuccess(req, res);      
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
          console.log(error)
          apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.INVALID_CRED,
            true
          );
        }
        
      }
    
    const lyraWalletResponceSuccess = async (req, res) => 
      {
        try {
          const result = await lyraService.lyraWalletResponceSuccess(req, res);      
          res.send(result);        
        } catch (error) {
          apiErrorres(
            res,
            error.message,
            ServerStatusCode.INVALID_CRED,
            true
          );
        }
        
      }

      module.exports ={lyraWalletResponceSuccess,lyraSuccess,railPayuSuccess}