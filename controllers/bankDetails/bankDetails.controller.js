const bankDetails  = require("./bankDetails.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  ADMIN_USER_TYPE,
  CrudMessage,
} = require("../../utils/constants");

const addBankDetails = async (req,res) => {
    try{
         const result = await bankDetails.addBankDetails(req.body, req.file)
         if( result.response == "Bank Details Added sucessfully"){
            apiSucessRes(
                res,
                result.response,
                result.data,
                ServerStatusCode.SUCESS_CODE
            )    
         }
         else if(result.response == "Some Datails is missing or bank detils not saved"){
            apiErrorres(
                res,
                result.response,
                ServerStatusCode.PRECONDITION_FAILED,
                true
            )
         }else{
            apiErrorres(
                res,
                errorResponse.SOMETHING_WRONG,
                ServerStatusCode.SERVER_ERROR,
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
    addBankDetails
}