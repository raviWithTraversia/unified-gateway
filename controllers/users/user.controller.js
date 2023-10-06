const User = require("../../models/User");
const Company = require("../../models/Company");
const bcryptjs = require("bcryptjs");
const { Config } = require("../../configs/config");
const jwt = require("jsonwebtoken");
const userServices = require('./user.services');
const { response } = require("../../routes/userRoute");
const { validationResult } = require("express-validator");
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const {ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage}  = require('../../utils/constants');


const registerUser = async (req, res) => {
   try {
       const result = await userServices.registerUser(req);
       if(result.response == 'All fields are required' || result.response == 'Invalid email format' || result.response == 'Password must be at least 8 characters long' 
           || result.response == 'This email is already in use') {
         apiErrorres(res,result.response,ServerStatusCode.BAD_REQUEST,true )
       }else{
        apiSucessRes(
            res,
            CrudMessage.USER_CREATED,
            result.response,
            ServerStatusCode.SUCESS_CODE
            )
       }
     
   }
    catch (error) {
       console.log(error);
       apiErrorres(
        res,
        errorResponse.SOMETHING_WRONG,
        ServerStatusCode.SERVER_ERROR,
        true )
    }
}


const loginUser = async (req, res) => {
   try {    
    const result = await userServices.loginUser(req);
    if(result.response == 'User not found'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.UNAUTHORIZED,
            true )
    }
    else if(result.response == 'Invalid password'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.BAD_REQUEST,
            true )
    }
    else {
        apiSucessRes(
            res,
            CrudMessage.LOGIN_SUCESS,
            result.data,
            ServerStatusCode.SUCESS_CODE
            )
    }
   }
    catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true )
    }
}

const userInsert = async (req, res) => {
   try {
    const result = await userServices.userInsert(req);
    if(result.response == 'All fields are required' || result.response == 'User with this email already exists' 
    || result.response == 'Company with this companyName already exists'){
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.BAD_REQUEST,
        true )
    } else {
      apiSucessRes(
        res,
        CrudMessage.USER_INSERT,
        result.response,
        ServerStatusCode.SUCESS_CODE
        )
    }
   }
    catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true )
    }
  };

  const forgotPassword = async (req,res) =>{
    try{
      const result = await userServices.forgotPassword(req);
      if(result.response == 'User not found'){
        apiErrorres(
          res,
          result.response,
          ServerStatusCode.RESOURCE_NOT_FOUND,
          true )
      }else{
        apiSucessRes(
          res,
          CrudMessage.RESET_MAIL_SENT,
          result.response,
          ServerStatusCode.SUCESS_CODE
          )
      }

    }catch(error){
      apiErrorres(
        res,
        errorResponse.SOMETHING_WRONG,
        ServerStatusCode.SERVER_ERROR,
        true )
    }
  };

  const resetPassword = async (req, res) => {
    try {
      const result = await userServices.resetPassword(req,res);
      if(result.response == 'Invalid reset token'){
        apiErrorres(
          res,
          result.response,
          ServerStatusCode.RESOURCE_NOT_FOUND,
          true )

      }else{
 
        apiSucessRes(
          res,
          CrudMessage.PASSWORD_RESET,
          result.response,
          ServerStatusCode.SUCESS_CODE
          )

      }

    }catch (error){
      apiErrorres(
        res,
        errorResponse.SOMETHING_WRONG,
        ServerStatusCode.SERVER_ERROR,
        true )
    }
  }
 


module.exports = {
    registerUser,
    loginUser,
    userInsert,
    forgotPassword,
    resetPassword
}