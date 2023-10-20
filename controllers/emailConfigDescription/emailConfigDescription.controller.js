const emailConfigServices = require('./emailConfigDescription.services');
//const { validationResult } = require("express-validator");
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const {ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage}  = require('../../utils/constants');

const findAllEmailConfig = async(req,res) => {
  try{
    const result = await emailConfigServices.findAllEmailConfig(req,res);
    if(result.response === 'No email config discription data found'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.RESOURCE_NOT_FOUND,
            true
        )
    }else{
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
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

const addEmailConfig = async (req ,res) => {
    try{
     const result = await emailConfigServices.addEmailConfig(req,res);
     if(result.response === 'This email config discription already exist'){
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.ALREADY_EXIST,
        true
      )
     }else{
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
     }

    }catch(error){
        res,
        errorResponse.SOMETHING_WRONG,
        ServerStatusCode.SERVER_ERROR,
        true
    }
}

module.exports = {
    findAllEmailConfig,
    addEmailConfig
}