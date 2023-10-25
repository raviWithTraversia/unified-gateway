
const smtpServices = require('./smtp.services');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const {ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage}  = require('../../utils/constants');

const smtpConfig = async (req,res) => {
    try{
      const result = await smtpServices.smtpConfig(req);
      if(result.response == 'No smtp configuration available'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.BAD_REQUEST,
            true )
      }else {
        apiSucessRes(
            res,
            CrudMessage.FETCH_DATA,
            result.response,
            ServerStatusCode.SUCESS_CODE
            )
      }
    }
    catch(error) {
        console.log(error);
        apiErrorres(
         res,
         errorResponse.SOMETHING_WRONG,
         ServerStatusCode.SERVER_ERROR,
         true )
    }
};

const addSmtpConfig = async (req,res) => {
    try{
    const result = await smtpServices.addSmtpConfig(req);
    if(!result.response){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.BAD_REQUEST,
            true )
    }else{
        apiSucessRes(
            res,
            CrudMessage.ADD_SMTP,
            result.response,
            ServerStatusCode.SUCESS_CODE
            )
    }

    }catch(error){
        console.log(error);
        apiErrorres(
         res,
         errorResponse.SOMETHING_WRONG,
         ServerStatusCode.SERVER_ERROR,
         true )
    }
}

const removeSmtpConfig = async (req,res) => {
    try{
    const result = await smtpServices.removeSmtpConfig(req,res);
    if(!result.response){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.BAD_REQUEST,
            true )

    }else {
        apiSucessRes(
            res,
            CrudMessage.REMOVE_SMTP,
            result.response,
            ServerStatusCode.SUCESS_CODE
            )

    }

    }catch(error){
        console.log(error);
        apiErrorres(
         res,
         errorResponse.SOMETHING_WRONG,
         ServerStatusCode.SERVER_ERROR,
         true )
    }
}



module.exports = {
    smtpConfig,
    addSmtpConfig,
    removeSmtpConfig
}