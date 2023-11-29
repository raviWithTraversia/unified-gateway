const ConfigCredentialServices = require("./configCredential.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");

const addCredntials = async (req,res) => {
  try{
    const result = await ConfigCredentialServices.addCredntials(req,res);
    if(result.response === 'companyId is not valid'){
       apiErrorres(
        res,
        result.response,
        ServerStatusCode.INVALID_CRED,
        true
       )
    }
    else if(result.response === 'Config Data Insert Sucessfully'){
       apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
       )
    }
    else if(result.response === 'Config data not Inserted'){
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
          ServerStatusCode.PRECONDITION_FAILED,
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
    ); 
  }
};

const updateCredential = async (req,res) => {
   try{
    const result = await ConfigCredentialServices.updateCredential(req,res);
    if(result.response === 'configId is not valid'){
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.INVALID_CRED,
        true
       )
    }
    else if(result.response === 'Config credential details updated sucessfully'){
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
       )
    }
    else if(result.response === 'Config credential details not  updated'){
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
         error,
        ServerStatusCode.SERVER_ERROR,
        true
      ); 
    }
      
   }catch(error){
    apiErrorres(
      res,
       error,
      ServerStatusCode.SERVER_ERROR,
      true
    ); 
   }
};

const getCredentialForCompany = async (req,res) => {
   try{
    const result = await ConfigCredentialServices.getCredentialForCompany(req,res);
    if(result.response === 'companyId is not valid'){
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.INVALID_CRED,
        true
       )
    }
    else if(result.response === 'Config Credential Data Found'){
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
       )
    }
    else if(result.response === 'Config Credential Data Not Found'){
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
         error,
        ServerStatusCode.SERVER_ERROR,
        true
      ); 
    }
   
   }catch(error){
    apiErrorres(
      res,
       error,
      ServerStatusCode.SERVER_ERROR,
      true
    ); 
   }
};

const deleteCredential = async (req,res) => {
   try{
    const result = await ConfigCredentialServices.deleteCredential(req,res);
    if(result.response === 'Invalid Mongo Object Id'){
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.INVALID_CRED,
        true
       )
    }
    else if(result.response === 'Credential deleted Sucessfully'){
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
       )
    }
    else if(result.response === 'Credential not deleted'){
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
         error,
        ServerStatusCode.SERVER_ERROR,
        true
      ); 
    }
     
   }catch(error){
    apiErrorres(
      res,
       error,
      ServerStatusCode.SERVER_ERROR,
      true
    ); 
   }
};

module.exports = {
   addCredntials,
   updateCredential,
   getCredentialForCompany,
   deleteCredential
}
