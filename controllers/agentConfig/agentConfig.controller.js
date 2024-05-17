const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const agentConfigServices = require('./agentConfig.services');

const addAgentConfiguration = async (req,res) => {
    try{
        const result = await agentConfigServices.addAgentConfiguration(req,res);
    }catch(error){

    }
};
const updateAgentConfiguration = async (req,res) => {
    try{
   // console.log(req.body);
    const result = await agentConfigServices.updateAgentConfiguration(req,res);
   if(result.response == 'Config updated successfully'){
        apiSucessRes(
           res,
           result.response,
           result.data,
           ServerStatusCode.SUCESS_CODE
        )
       }
    else if(result.response == 'Config not found'){
     apiErrorres(
        res,
        result.response,
        ServerStatusCode.PRECONDITION_FAILED,
        true
     )
    }else{
        apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.RESOURCE_NOT_FOUND,
            true 
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
};

const getAgentConfig = async (req,res) => {
    try{
     const result = await agentConfigServices.getAgentConfig(req,res);
     if(result.response == 'Agent config Data found Sucessfully'){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
         )
     }else if(result.response == 'Agent config Data not found'){
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
            ServerStatusCode.RESOURCE_NOT_FOUND,
            true 
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
};

const updateAgencyProfile = async (req,res) => {
    try{
    const result = await agentConfigServices.updateAgencyProfile(req,res);
    
    if(result.response === 'Agency/Distributor details updated successfully'){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
         )
    }else if(result.response === 'Agency/Distributer details not updated'){
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
            ServerStatusCode.RESOURCE_NOT_FOUND,
            true 
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
};

const getUserProfile = async (req, res) => {
    try {
      const result = await agentConfigServices.getUserProfile(req, res);
      if (result.response === "User data found SucessFully") {
        apiSucessRes(
          res,
          result.response,
          result.data,
          ServerStatusCode.SUCESS_CODE
        );
      } else if (result.response === "User data not found") {
        apiErrorres(res, result.response, ServerStatusCode.NOT_EXIST_CODE, true);
      } else {
        apiErrorres(
          res,
          errorResponse.SOME_UNOWN,
          ServerStatusCode.RESOURCE_NOT_FOUND,
          true
        );
      }
    } catch (error) {
      apiErrorres(res, error, ServerStatusCode.UNAUTHORIZED, true);
    }
  };


module.exports = {
    addAgentConfiguration,
    updateAgentConfiguration,
    getAgentConfig,
    updateAgencyProfile,
    getUserProfile
}
