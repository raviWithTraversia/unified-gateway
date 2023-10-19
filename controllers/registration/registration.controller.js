const registrationServices = require('./registration.services');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const {ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage}  = require('../../utils/constants');

const addRegistration = async (req,res) => {
   try{ 
    const result = await registrationServices.addRegistration(req,res);
    if(!result.response && result.isSometingMissing){
        apiErrorres(
          res,
          result.data,
          ServerStatusCode.BAD_REQUEST,
          true
        )
    }

    if(result.response === 'Email already exists' ){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.BAD_REQUEST,
            true
        )
    }
    if(result.response === 'Mobile number already exists'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.BAD_REQUEST,
            true
        )
    }
    else {
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
    }
  } catch (error){
    apiErrorres(
        res,
        errorResponse.SOMETHING_WRONG,
        ServerStatusCode.SERVER_ERROR,
        true
         )

  }
   
}

const getAllRegistration = async (req , res) => {
    try{
    const result = await registrationServices.getAllRegistration(req,res);
    if(result.response === 'All registrationData fetch'){
        apiSucessRes(
            res,
            CrudMessage.ALL_DATA,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
    }

    } catch (error){
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true )

    }
}

const getAllRegistrationByCompany = async (req,res) => {
    try {
    const result = await registrationServices.getAllRegistrationByCompany(req,res);
     if(!result.response){
        apiErrorres(
            res,
            result.message,
            ServerStatusCode.BAD_REQUEST,
            true
        )

     }else{
        apiSucessRes(
            res,
            CrudMessage.FETCH_REG_DATA,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )

     }

    } catch(error){
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true )

    }
}
module.exports = {
    addRegistration,
    getAllRegistration,
    getAllRegistrationByCompany   
}