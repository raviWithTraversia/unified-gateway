const bankDetailServices  = require("./bankDetails.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  ADMIN_USER_TYPE,
  CrudMessage,
} = require("../../utils/constants");

const addBankDetails = async (req,res) => {
    try{
         const result = await bankDetailServices.addBankDetails(req,res)
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
            //This Account Number alerady Exist
         }else if(result.response === "This Account Number alerady Exist"){
            apiErrorres(
                res,
                result.response,
                ServerStatusCode.ALREADY_EXIST,
                true
            )
         }
         else if(result.response === "This account number alrady exist"){
            apiErrorres(
                res,
                result.response,
                ServerStatusCode.ALREADY_EXIST,
                true
            )
         }
         else if(result.isSometingMissing){
            apiErrorres(
                res,
                result.data,
                ServerStatusCode.RESOURCE_NOT_FOUND,
                true
            )
         }
         
         else{
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

const getBankDetails = async (req,res) => {
    try{
    const result = await bankDetailServices.getCompanyBankDetalis(req,res);
    if(result.response === "Bank Details Fetch Sucessfully"){
       apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
       ) 
    }
    else if(result.response === "No any Bank details added for this company"){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.RECORD_NOTEXIST,
            true
        )
    }
    else{
        apiErrorres(
            res,
            "Some Unkown error",
            ServerStatusCode.NOT_EXIST_CODE,
            true
        )
    }

    }catch(error){
         apiErrorres(
            res,
            error,
            ServerStatusCode.BAD_REQUEST,
            true
         )
    }
}

const updateBankDetails = async (req,res) => {
    try{

    const result = await bankDetailServices.updateBankDetails(req,res);
    if(!result){
       apiErrorres(
        res,
        errorResponse.NOT_AVALIABLE,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
       )
    }
    else if(result.response === 'Bank details not updated'){
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.UNPROCESSABLE,
        true
      )
    }
    else if(result.response === 'Bank details updated sucessfully'){
       apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
       )
    }
    else{
         apiErrorres(
            res,
            errorResponse.NOT_AVALIABLE,
            ServerStatusCode.RESOURCE_NOT_FOUND,
            true
         )
    }
    }catch(error){
        apiErrorres(
            res,
            error,
            ServerStatusCode.RESOURCE_NOT_FOUND,
            true
        )
    }
};
const deleteBankDetails = async (req,res) => {
    try{
        const result = await bankDetailServices.deleteBankDetails(req,res);
        if(result.response  === "Bank details deleted successfully"){
          apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
          )
        }else if(result.response === 'Bank details not found' ){
           apiErrorres(
            res,
            result.response,
            ServerStatusCode.RECORD_NOTEXIST,
            true
           )
        }else{
            apiErrorres(
                res,
                errorResponse.SOME_UNOWN,
                ServerStatusCode.UNPROCESSABLE,
                true
               )
        }

    }catch(error){
        apiErrorres(
            res,
            error,
            ServerStatusCode.UNAUTHORIZED,
            true
        )
    }
}
module.exports = {
    addBankDetails,
    getBankDetails,
    updateBankDetails,
    deleteBankDetails
}