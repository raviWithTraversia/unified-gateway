const emailConfigServices = require('./email.services');
const { response } = require("../../routes/smtpRoute");
const { validationResult } = require("express-validator");
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const {ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage}  = require('../../utils/constants');

const getEmailConfig = async(req,res) => {
  try{
    const result = await emailConfigServices.getEmailConfig(req,res);

  }catch(error){

  }
}

const addEmailConfig = async (req ,res) => {
    try{

    }catch(error){

    }
}

module.exports = {
    getEmailConfig,
    addEmailConfig
}