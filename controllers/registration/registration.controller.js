const registrationServices = require('./registration.services');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const {ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage}  = require('../../utils/constants');
const { response } = require('../../routes/registrationRoute');

const addRegistration = async (req,res) => {
   try{ 
    const result = await registrationServices.addRegistration(req,res);
    if(!result.response && result.isSometingMissing){
        apiErrorres(
            res,
            result.data,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }

    else if(result.response === 'Email already exists' ){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.ALREADY_EXIST,
            true
        )
    }
    else if(result.response === 'Mobile number already exists'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.ALREADY_EXIST,
            true
        )
    }
    else if(result.response === 'status Id is not valid'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.ALREADY_EXIST,
            true
        )
    }
    else if(result.response === 'Sale incharge Id is not valid'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.INVALID_CRED,
            true
        )
    }
    else if(result.response === 'Status Id is not valid'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.INVALID_CRED,
            true
        )
    }
    else if(result.response === 'New registration created successfully'){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
    }
    else if(result.response === 'Registration Failed!'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.PRECONDITION_FAILED,
            true
        )
    }
    else {
        apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.UNPROCESSABLE,
            true
        )
    }
  } catch (error){
    console.error(error);
    apiErrorres (
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
    }else{
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.SERVER_ERROR,
            true )
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
            true 
         
            )

    }
}

const updateRegistration = async (req,res) => {
    try{
        const result = await registrationServices.updateRegistration(req,res);
        if(result.response === "Please pass valid registrationId or statusId"){
            apiErrorres(
                res,
                result.response,
                ServerStatusCode.INVALID_CRED,
                true
            )
        }
        else if(result.response === 'Registration data is not updated'){
            apiErrorres(
                res,
                result.response,
                ServerStatusCode.NOT_EXIST_CODE,
                true
            )
        }
        else if(result.response === 'Registration data updated sucessfully'){
               apiSucessRes(
                res,
                CrudMessage.FETCH_REG_DATA,
                result.response,
                ServerStatusCode.SUCESS_CODE

               )
        }else {
            apiErrorres(
                res,
                result,
                ServerStatusCode.SERVER_ERROR,
                true 
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
    addRegistration,
    getAllRegistration,
    getAllRegistrationByCompany,
    updateRegistration 
}