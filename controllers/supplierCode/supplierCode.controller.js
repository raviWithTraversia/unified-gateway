
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse } = require('../../utils/constants');
const supplierCodeServices = require('./supplierCode.services');


const addSupplierCode = async (req,res) => {
    try{
     let result = await supplierCodeServices.addSupplierCode(req,res);
      if(result.response == 'Add Supplier Code Sucessfully' ){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )  
      }else if(result.response == 'Supplier Code not added'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.INVALID_CRED,
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
             error,
            ServerStatusCode.SERVER_ERROR,
            true
          );  
    }
}

const getSupplierCode = async (req,res) => {
    try{
    let result = await supplierCodeServices.getSupplierCode(req,res);
    if(result.response == 'Data Fetch Sucessfully'){
       apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
       )
    }else if(result.response == null){
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      )
    }else {
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
             error,
            ServerStatusCode.SERVER_ERROR,
            true
          );  
    }
  };

  module.exports = {
    addSupplierCode,
    getSupplierCode
}