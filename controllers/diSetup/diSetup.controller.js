const diServices = require('./diSetup.services');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const addDiSetup = async (req,res) => {
    try{
      const result = await diServices.addDiSetup(req,res);
      if(result.response == 'New Di Setup is created'){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
      }
      else if(result.response == 'Di setup is not created'){
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

const getDiSetup = async (req, res) => {
    try{
        const result = await diServices.getDiSetup(req,res);
        if(result.response == 'Di Data sucessfully Fetch'){
          apiSucessRes(
              res,
              result.response,
              result.data,
              ServerStatusCode.SUCESS_CODE
          )
        }
        else if(result.response == 'Data Not Found'){
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

const deleteDiSetup = async (req,res) => {
    try{
        const result = await diServices.deleteDiSetup(req,res);
        if(result.response == 'Di data deleted sucessfully'){
          apiSucessRes(
              res,
              result.response,
              result.data,
              ServerStatusCode.SUCESS_CODE
          )
        }
        else if(result.response == 'Di data not deleted'){
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

const editDiSetup = async (req,res) => {
  try{
    let result = await diServices.editDiSetup(req,res);
    if(result.response == 'Di data Updated Sucessfully'){
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      )
    }
    else if(result.response == 'Di Data Not Updated'){
      apiErrorres(
       res,
       result.response,
       ServerStatusCode.RESOURCE_NOT_FOUND,
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
    addDiSetup,
    getDiSetup,
    deleteDiSetup,
    editDiSetup
}