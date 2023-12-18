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
    //console.log(req.body);
    const result = await agentConfigServices.updateAgentConfiguration(req,res);
    if(result.response == 'Config data updated successfully'){
     apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
     )
    }else  if(result.response == 'TMC Config Insert Sucessfully'){
        apiSucessRes(
           res,
           result.response,
           result.data,
           ServerStatusCode.SUCESS_CODE
        )
       }
    else if(result.response == 'Agent Config Insert Sucessfully'){
        apiSucessRes(
           res,
           result.response,
           result.data,
           ServerStatusCode.SUCESS_CODE
        )
       }
    else if(result.response == 'User  is not Tmc or agent or distributer'){
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
}


module.exports = {
    addAgentConfiguration,
    updateAgentConfiguration
}
