const groupTicketRequestServices = require("./groupTicketRequest.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage
} = require("../../utils/constants");

const addTicketRequset = async (req,res) => {
    try{
    const result = await groupTicketRequestServices.addTicketRequset(req,res);
    if(result.response == 'Group Ticket Request Data Created Sucessfully'){
        apiSucessRes( 
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
           )
    }else if(result.response == 'Group Ticket Request Data Not Created'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.RESOURCE_NOT_FOUND,
            true
        )
    }else {
        apiErrorres(
            res,
            ServerStatusCode.RESOURCE_NOT_FOUND,
            errorResponse.SOME_UNOWN,
            true
        )
    }
    }catch(error){
        apiErrorres(
            res,
            errorResponse.error,
            ServerStatusCode.SERVER_ERROR,
            true)
    }
};
const getTicketRequestId = async (req,res) => {
 try{
const result = await groupTicketRequestServices.getTicketRequestId(req,res);
if(result.response == 'Group ticket request found sucessfully'){
    apiSucessRes( 
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
       )
}else if(result.response == 'Group ticket request not found'){
    apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
    )
}else{
    apiErrorres(
        res,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        errorResponse.SOME_UNOWN,
        true
    )
}
}catch(error){
    apiErrorres(
        res,
        errorResponse.error.message,
        ServerStatusCode.SERVER_ERROR,
        true
        ) 
 }
};
const getTicketRequestByUserId = async (req,res) => {
    try{
        const result = await groupTicketRequestServices.getTicketRequestByUserId(req,res);
        if(result.response == 'Group ticket request found sucessfully'){
            apiSucessRes( 
                res,
                result.response,
                result.data,
                ServerStatusCode.SUCESS_CODE
               )
        }else if(result.response == 'Group ticket request not found'){
            apiErrorres(
                res,
                result.response,
                ServerStatusCode.RESOURCE_NOT_FOUND,
                true
            )
        }else{
            apiErrorres(
                res,
                ServerStatusCode.RESOURCE_NOT_FOUND,
                errorResponse.SOME_UNOWN,
                true
            )
        }
        }catch(error){
            apiErrorres(
                res,
                errorResponse.error.message,
                ServerStatusCode.SERVER_ERROR,
                true
                ) 
         }
};
const updateTicketRequest = async (req,res) => {
    try{
        const result = await groupTicketRequestServices.updateTicketRequest(req,res);
        //Group ticket request updated sucessfully
        if(result.response == 'Group ticket request updated sucessfully'){
            apiSucessRes( 
                res,
                result.response,
                result.data,
                ServerStatusCode.SUCESS_CODE
               )
        }else if(result.response == 'Group ticket request not found'){
            apiErrorres(
                res,
                result.response,
                ServerStatusCode.RESOURCE_NOT_FOUND,
                true
            )
        }else{
            apiErrorres(
                res,
                ServerStatusCode.RESOURCE_NOT_FOUND,
                errorResponse.SOME_UNOWN,
                true
            )
        }
        }catch(error){
            apiErrorres(
                res,
                errorResponse.error,
                ServerStatusCode.SERVER_ERROR,
                true
                ) 
         }
};

module.exports = {
    addTicketRequset,
    getTicketRequestId,
    getTicketRequestByUserId,
    updateTicketRequest
}