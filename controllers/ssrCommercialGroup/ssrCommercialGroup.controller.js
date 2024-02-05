const ssrCommercialGroupServices = require('./ssrCommercialGroup.services');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const {ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage}  = require('../../utils/constants');

const addSsrCommercialGroup = async (req,res) => {
    try{
    const result = await ssrCommercialGroupServices.addSsrCommercialGroup(req,res);
    if(result.response == "Ssr Commercial Group Added Sucessfully"){
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      )
    }else if(result.response == "Ssr Commercial Group With The Same Name Already Exists For This Company"){
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.ALREADY_EXIST,
        true
      )
    }else if(result.response == "Ssr Commercial Group Not Added"){
        apiErrorres(
          res,
          result.response,
          ServerStatusCode.PRECONDITION_FAILED,
          true
        )
      }
    else{
        apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.PRECONDITION_FAILED,
            true
        )
    }

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true 
            )
    }
};

module.exports = {
    addSsrCommercialGroup
}
