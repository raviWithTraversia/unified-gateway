const diServices = require('../../controllers/diSetup/diSetup.services');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const addDiSetup = async (req,res) => {
    try{
      const result = await diServices.addDiSetup(req,res);
      if(result.response == 'New Di Setup is created'){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
      }
      else if(result.response == 'Di setup is not created'){
       apiErrorres(
        res,
        result.response,
        ServerStatusCode.NOT_EXIST_CODE,
        true
       )
      }else{
        apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.INVALID_CRED,
            true
          )
      }
    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.INVALID_CRED,
            true
          )
    }
};

module.exports = {
    addDiSetup
}