const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode } = require('../../utils/constants');
const supplierServices = require('./supplier.services');

const addSupplier = async (req,res) => {
    try{
    const result = await supplierServices.addSupplier(req,res);
    if(result.response == 'new Supplier added'){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
    }
    else if(result.response == 'Supplier not added'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.RESOURCE_NOT_FOUND,
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
             error,
            ServerStatusCode.SERVER_ERROR,
            true
          ); 
    }
};

const updateSupplier = async (req,res) =>{
    try{
        const result = await supplierServices.updateSupplier(req,res);
        if(result.response == 'Supplier Data Updated Sucessfully'){
           apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
           )
        }
        else if(result.response == 'Supplier data not updated'){
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
             error,
            ServerStatusCode.SERVER_ERROR,
            true
          ); 
    }
};

const getSupplier = async (req,res) => {
    try{
        const result = await supplierServices.getSupplier(req,res)
        if(result.response == 'Supplier Data Fetch Sucessfully'){
            apiSucessRes(
                res,
                result.response,
                result.data,
                ServerStatusCode.SUCESS_CODE
            )
        }
        else if(result.response == 'Supplier Data Not Found'){
          apiErrorres(
            res,
            result.response,
            ServerStatusCode.RECORD_NOTEXIST,
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
             error,
            ServerStatusCode.SERVER_ERROR,
            true
          ); 
    }
};

module.exports = {
    addSupplier,
    updateSupplier,
    getSupplier
}
