const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const layoutService = require('./layout.services');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');
const dashBoardCount = async (req , res) => {
    try{
      const result = await layoutService.dashBoardCount(req,res);
      if(result.response === 'Count Fetch Sucessfully'){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE  
        )
      }else{
        apiErrorres(
            res,
            errorResponse.NOT_AVALIABLE,
            ServerStatusCode.UNPROCESSABLE,
            true
        )
      }
    }
    catch(error){
        apiErrorres(
            res,
            error,
            ServerStatusCode.SERVER_ERROR,
            true 
        )
    }
};



module.exports = {
    dashBoardCount

}