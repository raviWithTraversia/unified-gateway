const gstDetailServices = require("./gstDetails.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage
} = require("../../utils/constants");

const addGstDetail = async (req,res) => {
    try{
    let result = await gstDetailServices.addGstDetail(req,res);
    if(result.response == 'Gst Data Added Sucessfully'){
        apiSucessRes( 
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
           )
    }
    else if(result.response == 'GST number already exists'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.RESOURCE_NOT_FOUND,
            true
        )
    }else if(result.response == 'Gst Data Not Added'){
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
    }catch{
        apiErrorres(
            res,
            errorResponse.error,
            ServerStatusCode.SERVER_ERROR,
            true)
    }
};
const getGstDetail = async (req , res) => {
    try{
    let result = await gstDetailServices.getGstDetail(req,res);
        if(result.response == 'Gst Data Fetch sucessfully'){
            apiSucessRes( 
                res,
                result.response,
                result.data,
                ServerStatusCode.SUCESS_CODE
               )
        }else if(result.response == 'Gst Data Not Found'){
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
            true) 
    }
}
module.exports = {
    addGstDetail,
    getGstDetail
}