const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode } = require('../../utils/constants');
const airlinePromoCodeServices = require('./airLinePremoCode.services');

const addAirlinePromoCode = async (req,res) => {
    try{
    let result = await airlinePromoCodeServices.addAirlinePromoCode(req,res);
    if(result.response == 'Airline PromoCode added sucessfully'){
       apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
       )
    }
    else if(result.response == 'Invalid Mongo Object Id'){
       apiErrorres(
        res,
        result.response,
        ServerStatusCode.INVALID_CRED,
        true
       )
    }
    else if(result.response == 'Invalid Mongo Object Id'){
        apiErrorres(
         res,
         result.response,
         ServerStatusCode.INVALID_CRED,
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

const editAirlinePromoCode = async (req,res) => {
    try{
    let result = await airlinePromoCodeServices.editAirlinePromoCode(req,res);
 if(result.response == 'Invalid Mongo Object Id'){
    apiErrorres(
        res,
        result.response,
        ServerStatusCode.INVALID_CRED,
        true
       )
 }
 else if(result.response == 'AirLine PromoCode Data Updated Sucessfully'){
 apiSucessRes(
    res,
    result.response,
    result.data,
    ServerStatusCode.SUCESS_CODE
 )
 }
 else if(result.response == 'AirLine PromoCode Data Not Updated'){
    apiErrorres(
        res,
        result.response,
        ServerStatusCode.RECORD_NOTEXIST,
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
             error,
            ServerStatusCode.SERVER_ERROR,
            true
          ); 
    }
};

const getPromoCode = async (req,res) => {
    try{
        let result = await airlinePromoCodeServices.getPromoCode(req,res);
        if(result.response == 'Invalid Mongo Object Id'){
           apiErrorres(
               res,
               result.response,
               ServerStatusCode.INVALID_CRED,
               true
              )
        }
        else if(result.response == 'Data Fetch Sucessfully'){
            apiSucessRes(
                res,
                result.response,
                result.data,
                ServerStatusCode.SUCESS_CODE
            )
        }
        else if(result.response == 'No Airline Promo Data Found'){
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
}
const deletePromoCode = async(req,res) => {
    try{
        let result = await airlinePromoCodeServices.deletePromoCode(req,res);
        if(result.response == 'Invalid Mongo Object Id'){
           apiErrorres(
               res,
               result.response,
               ServerStatusCode.INVALID_CRED,
               true
              )
        }
        else if(result.response == 'Promo Code deleted Sucessfully'){
            apiSucessRes(
                res,
                result.response,
                result.data,
                ServerStatusCode.SUCESS_CODE
            )
        }
        else if(result.response == 'Promo Code Not Found'){
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
}

module.exports = {
    addAirlinePromoCode ,
    editAirlinePromoCode,
    getPromoCode,
    deletePromoCode
}