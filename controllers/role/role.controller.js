const roles = require('./role.services');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const {ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage}  = require('../../utils/constants');

const createRoles = async (req,res) => {
  try{
    const result = await roles.createRoles(req,res);
    if(result.response === "companyId is not valid"){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.INVALID_CRED,
            true
        )
    }
    else if("This role name is already exixt"){
     apiErrorres(
        res,
        result.response,
        ServerStatusCode.ALREADY_EXIST,
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

const findRoles = async (req,res) => {
  try{
    const result = await roles.findRoles(req,res);

    if(result.response === "companyId is not valid"){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.INVALID_CRED,
            true
        )
    }
    else if(result.response === "No role exist for this company"){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.ALREADY_EXIST,
            true
         )
    }
    else if(result.response === "Role Fetch sucessfully" ){
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
    createRoles,
    findRoles
}