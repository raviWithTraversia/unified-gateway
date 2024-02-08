const manageAirlineCredentialServices = require('./manageAirlineCred.services');
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");

const addAirlineCred = async (req, res) => {
try{
let result = await manageAirlineCredentialServices.addAirlineCred(req,res);
if(result.response == 'Airline Credential Data Insert Sucessfully') {
    apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
}else if(result.response == 'Airline Credntial Data Not Inserted' ){
    apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
}else{
    apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.INVALID_CRED,
        true
      );
}
}catch(error){
    apiErrorres(
        res,
        errorResponse.SOMETHING_WRONG,
        ServerStatusCode.SERVER_ERROR,
        true
      ); 
}

};
const updateAirlineCred = async (req , res) => {
    try{
    let result = await manageAirlineCredentialServices.updateAirlineCred(req,res);
    if(result.response == 'Data Updated Sucessfully'){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
          );
    }else if(result.response == 'Data not Updated'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.RESOURCE_NOT_FOUND,
            true
          );
    }else{
        apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.INVALID_CRED,
            true
          );
    }

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
          ); 
    }
};
const getAirlineCred = async (req,res) => {
    try{
    let result = await manageAirlineCredentialServices.getAirlineCred(req,res)
        if (result.response == "Data Found Sucessfully") {
            apiSucessRes(
              res,
              result.response,
              result.data,
              ServerStatusCode.SUCESS_CODE
            );
          } else if (result.response == "Data not found") {
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

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
          ); 
    }
}

module.exports = {
    addAirlineCred,
    updateAirlineCred,
    getAirlineCred
}