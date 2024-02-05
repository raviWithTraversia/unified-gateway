const ssrCommercialServices = require('./ssrCommercial.services');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const {ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage}  = require('../../utils/constants');

const addSsrCommercial = async (req,res) => {
    try{
    const result = await ssrCommercialServices.addSsrCommercial(req,res);
    if(result.response == 'Service request added successfully' ){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
            )
    }else if(result.response == 'Service request not added'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.PRECONDITION_FAILED,
            true
        )
    }else if(result.response == "This Combination Of SSR Commercial Already Exist"){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.PRECONDITION_FAILED,
            true
        )
    }
    else{
        apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.PRECONDITION_FAILED,
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
};

const getSsrCommercialByCompany = async(req,res) => {
    try{
        const result = await ssrCommercialServices.getSsrCommercialByCompany(req,res);
        if(result.response == 'Service Request Data Found Sucessfully'){
            apiSucessRes(
                res,
                result.response,
                result.data,
                ServerStatusCode.SUCESS_CODE
                )
        }else if(result.response == 'Service Request Data Not Found'){
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
                ServerStatusCode.PRECONDITION_FAILED,
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
};

const editSsrCommercial = async (req,res) => {
    try
    {
    let result = await ssrCommercialServices.editSsrCommercial(req,res);
    if(result.response == 'Data Updated Sucessfully'){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
            )
    }else if(result.response == 'Data Not Updated'){
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
            ServerStatusCode.PRECONDITION_FAILED,
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
const deleteSsrCommercial = async(req,res) => {
    try{
    let result = await ssrCommercialServices.deleteSsrCommercial(req,res);
    if(result.response == 'Ssr Commercial Data Deleted Sucessfully'){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
            )
    }else if(result.response == 'Ssr Commercial Data For This Id Is Not Found'){
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
            ServerStatusCode.PRECONDITION_FAILED,
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

module.exports =  {
    addSsrCommercial,
    getSsrCommercialByCompany,
    deleteSsrCommercial,
    editSsrCommercial
}