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

const checkPanCard = async (req,res) => {
  try{
    const result = await layoutService.checkPanCard(req,res);
    if(result.response === "Data Fetch Sucessfully"){
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE  
    )
    }else if(result.response === '"PAN number is required"'){
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.UNPROCESSABLE,
        true
      )
    }
    else{
      apiErrorres(
        res,
        errorResponse.NOT_AVALIABLE,
        ServerStatusCode.UNPROCESSABLE,
        true
      )
    }
  }catch(error){
    apiErrorres(
      res,
      error,
      ServerStatusCode.SERVER_ERROR,
      true 
  )
  }
}

module.exports = {
    dashBoardCount,
    checkPanCard

}