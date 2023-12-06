const manageUploadServices = require('./manageUploads.services');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const addImageUpload = async (req,res) => {
   try{
    let result = await manageUploadServices.addImageUpload(req,res);
    if(result.isSometingMissing){
        apiErrorres(
            res,
            result.data,
            ServerStatusCode.RESOURCE_NOT_FOUND,
            true       
        )
    }
    else if(result.response === 'Invalid Mongo Object Id'){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.RESOURCE_NOT_FOUND,
            true       
        )
    }
    else if(result.response === 'Data Upload Sucessfully'){
        apiSucessRes(
            res,
            result.response,
            CrudMessage.IMAGE_UPLOAD,
            ServerStatusCode.SUCESS_CODE,
        )
    }
    else if(result.response === 'Data Not Upload Sucessfully'){
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
        ServerStatusCode.INVALID_CRED,
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

const getUploadImage = async (req,res) => {
    try{
    let result = await manageUploadServices.getUploadImage(req,res);
     if(result.response == 'Image fetch Sucessfully'){
      apiSucessRes(
        res,
        result.response,
        CrudMessage.IMAGE_UPLOAD_FETCH,
        ServerStatusCode.SUCESS_CODE,
      )
     }
     else if(result.response == 'Image not found'){
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
            ServerStatusCode.INVALID_CRED,
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

const updateUploadImage = async (req,res) => {
    try{
     let result = await manageUploadServices.updateUploadImage(req,res);

    }catch(error){
     apiErrorres(
         res,
         errorResponse.SOMETHING_WRONG,
         ServerStatusCode.SERVER_ERROR,
         true
     )
    }
};

const deleteUploadImage = async (req,res) => {
    try{
     let result = await manageUploadServices.deleteUploadImage(req,res);
        

    }catch(error){
     apiErrorres(
         res,
         errorResponse.SOMETHING_WRONG,
         ServerStatusCode.SERVER_ERROR,
         true
     )
    }
};

module.exports = {
    addImageUpload,
    getUploadImage,
    deleteUploadImage,
    updateUploadImage
}