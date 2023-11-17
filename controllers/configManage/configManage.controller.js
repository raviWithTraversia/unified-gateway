const airGSTMandateService = require('./configManage.service');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const addairGSTMandate = async (req,res) => {
    try{ 
     const result = await airGSTMandateService.addGSTMandate(req,res);
     if(!result.response && result.isSometingMissing){
         apiErrorres(
             res,
             result.data,
             ServerStatusCode.SERVER_ERROR,
             true
         )
     }
 
    //  else if(result.response === 'Email already exists' ){
    //      apiErrorres(
    //          res,
    //          result.response,
    //          ServerStatusCode.ALREADY_EXIST,
    //          true
    //      )
    //  }
    //  else if(result.response === 'Mobile number already exists'){
    //      apiErrorres(
    //          res,
    //          result.response,
    //          ServerStatusCode.ALREADY_EXIST,
    //          true
    //      )
    //  }
    //  else if(result.response === 'status Id is not valid'){
    //      apiErrorres(
    //          res,
    //          result.response,
    //          ServerStatusCode.ALREADY_EXIST,
    //          true
    //      )
    //  }
    //  else if(result.response === 'Sale incharge Id is not valid'){
    //      apiErrorres(
    //          res,
    //          result.response,
    //          ServerStatusCode.INVALID_CRED,
    //          true
    //      )
    //  }
    //  else if(result.response === 'Status Id is not valid'){
    //      apiErrorres(
    //          res,
    //          result.response,
    //          ServerStatusCode.INVALID_CRED,
    //          true
    //      )
    //  }
    //  else if(result.response === 'New registration created successfully'){
    //      apiSucessRes(
    //          res,
    //          result.response,
    //          result.data,
    //          ServerStatusCode.SUCESS_CODE
    //      )
    //  }
    //  else if(result.response === 'Registration Failed!'){
    //      apiErrorres(
    //          res,
    //          result.response,
    //          ServerStatusCode.PRECONDITION_FAILED,
    //          true
    //      )
    //  }
    //  else {
    //      apiErrorres(
    //          res,
    //          errorResponse.SOME_UNOWN,
    //          ServerStatusCode.UNPROCESSABLE,
    //          true
    //      )
    //  }
   } catch (error){
     console.error(error);
     apiErrorres (
         res,
         errorResponse.SOMETHING_WRONG,
         ServerStatusCode.SERVER_ERROR,
         true
     )
 
   }
    
 }


module.exports = {addairGSTMandate}