const autoTicketingConfigServices = require('./autoTicketing.Services');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const addAutoTicketingConfig = async (req,res) => {
    try{
      const result = await autoTicketingConfigServices.addAutoTicketingConfig(req,res);
      if(result.response == 'Auto Ticketing Configuration is created'){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
      }
      else if(result.response == 'Auto Ticketing Configuration is not created'){
       apiErrorres(
        res,
        result.response,
        ServerStatusCode.NOT_EXIST_CODE,
        true
       )
      }  else if(result.response == 'This Auto Tickerting Data Is Already Exist'){
        apiErrorres(
         res,
         result.response,
         ServerStatusCode.NOT_EXIST_CODE,
         true
        )
       }
      else if(result.response == 'Supplier is not Active'){
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
            ServerStatusCode.INVALID_CRED,
            true
          )
      }
    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.INVALID_CRED,
            true
          )
    }
};

const getAutoTicketingConfig = async (req, res) => {
    try{
        const result = await autoTicketingConfigServices.getAutoTicketingConfig(req,res);
        if(result.response == 'Auto Ticketing Configuration Data sucessfully Fetch'){
          apiSucessRes(
              res,
              result.response,
              result.data,
              ServerStatusCode.SUCESS_CODE
          )
        }
        else if(result.response == 'Auto Ticketing Configuration Not Found'){
         apiErrorres(
          res,
          result.response,
          ServerStatusCode.NOT_EXIST_CODE,
          true
         )
        }else{
          apiErrorres(
              res,
              errorResponse.SOME_UNOWN,
              ServerStatusCode.INVALID_CRED,
              true
            )
        }

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.INVALID_CRED,
            true
          ) 
    }
};

const editAutoTicketingConfig = async (req,res) => {
    try{
        const result = await autoTicketingConfigServices.editAutoTicketingConfig(req,res);
        if(result.response == 'Auto Ticketing is not updated' ){
                    
        }
        else if(result.response == 'Auto Ticketing is updated sucessfully'){
            apiSucessRes(
                res,
                result.response,
                result.data,
                ServerStatusCode.SUCESS_CODE
            )
        }else{
            apiErrorres(
                res,
                errorResponse.SOME_UNOWN,
                ServerStatusCode.INVALID_CRED,
                true
              )
        }

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.INVALID_CRED,
            true
          ) 
    }
}

const deleteAutoTicketingConfig  = async (req,res) => {
    try{
        const result = await autoTicketingConfigServices.deleteAutoTicketingConfig(req,res);
        if(result.response == 'Auto Ticketing Configuration data deleted sucessfully'){
          apiSucessRes(
              res,
              result.response,
              result.data,
              ServerStatusCode.SUCESS_CODE
          )
        }
        else if(result.response == 'Auto Ticketing Configuration data not deleted'){
         apiErrorres(
          res,
          result.response,
          ServerStatusCode.NOT_EXIST_CODE,
          true
         )
        }else{
          apiErrorres(
              res,
              errorResponse.SOME_UNOWN,
              ServerStatusCode.INVALID_CRED,
              true
            )
        }

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.INVALID_CRED,
            true
          ) 
    }
}
module.exports = {
    addAutoTicketingConfig,
    getAutoTicketingConfig,
    editAutoTicketingConfig,
    deleteAutoTicketingConfig
}