const emailConfigServices = require('./emailConfig.services');
//const { validationResult } = require("express-validator");
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const {ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage}  = require('../../utils/constants');

const getEmailConfig = async(req,res) => {
  try{
    const result = await emailConfigServices.getEmailConfig(req,res);
     if(result.data === null){
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.BAD_REQUEST,
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
      if(result.response === 'Company id not exist'){
        apiErrorres(
          res,
          result.response,
          ServerStatusCode.RECORD_NOTEXIST,
          true
        )
      }
      if(result.response === 'Smtp id not exist'){
        apiErrorres(
          res,
          result.response,
          ServerStatusCode.RECORD_NOTEXIST,
          true
        )
      }
      if(result.response === 'Email config is already exist'){
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
      apiErrorres(
        res,
        error,
        ServerStatusCode.UNPROCESSABLE,
        true
      )
    }
}

module.exports = {
    getEmailConfig,
    addEmailConfig
}