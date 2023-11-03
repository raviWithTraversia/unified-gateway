const status = require('./status.services');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const {ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage}  = require('../../utils/constants');

const findStatusType = async(req,res) => {
  try{
    const result = await status.findStatusType(req,res);
    if(result.response === 'Status not Found'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.BAD_REQUEST,
            true
        )
    }
    else{
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
        errorResponse.SOMETHING_WRONG,
        ServerStatusCode.SERVER_ERROR,
        true
    )
  }
}

const addStatusType = async(req,res) => {
  try{
      const result = await status.addStatusType(req,res);
      if(result.response === 'This status or type aleady exist'){
        apiSucessRes(
            res,
            result.response,
            result.response,
            ServerStatusCode.ALREADY_EXIST
        )
      }
      else{
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
        errorResponse.SOMETHING_WRONG,
        ServerStatusCode.SERVER_ERROR,
        true
    )
  }
}

const findAllStatusType = async (req,res) => {
  try{
    const result = await status.findAllStatusType(req,res);
    if(result.response === 'No status found'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.BAD_REQUEST,
            true
        );
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
        errorResponse.SOMETHING_WRONG,
        ServerStatusCode.SERVER_ERROR,
        true
    )
  }
}

module.exports = {
    findStatusType,
    addStatusType,
    findAllStatusType
}