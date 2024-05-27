const manageMarkUpServices = require('./manageMarkup.services');
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");

const addMarkup = async (req,res) => {
  const result = await manageMarkUpServices.addMarkup(req,res);
  if(result.response == 'MarkUp Charges Insert Sucessfully'){
    apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
    )

  }else if(result.response == 'MarkUp Charges Charges Not Added'){
    apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
    )

  }else if(result.response == 'User Dont have permision to add MarkUp Charges'){
    apiErrorres(
        res,
        result.response,
        ServerStatusCode.PRECONDITION_FAILED,
        true
    )
  }else if(result.response == 'This Markup already exists!'){
    apiErrorres (  
    res,
    result.response,
    ServerStatusCode.ALREADY_EXIST,
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
};
const updateMarkup = async (req, res) => {
    try {
      let result = await manageMarkUpServices.updateMarkup(req, res);
      if (result.response == "Markup Data updated successfully") {
        apiSucessRes(
          res,
          result.response,
          CrudMessage.IMAGE_UPLOAD_UPDATED,
          ServerStatusCode.SUCESS_CODE
        );
      } else if (result.response == "MarkUp data not found") {
        apiErrorres(
          res,
          result.response,
          ServerStatusCode.RESOURCE_NOT_FOUND,
          true
        );
      } else {
        apiErrorres(
          res,
          errorResponse.SOME_UNOWN,
          ServerStatusCode.INVALID_CRED,
          true
        );
      }
    } catch (error) {
      apiErrorres(
        res,
        errorResponse.SOMETHING_WRONG,
        ServerStatusCode.SERVER_ERROR,
        true
      );
    }
};
const deletedMarkup = async (req, res) => {
    try {
      let result = await manageMarkUpServices.deletedMarkup(req, res);
      if (result.response == "Markup details deleted successfully") {
        apiSucessRes(
          res,
          result.response,
          CrudMessage.IMAGE_UPLOAD_DELETED,
          ServerStatusCode.SUCESS_CODE
        );
      } else if (result.response == "Markup details not found") {
        apiErrorres(
          res,
          result.response,
          ServerStatusCode.RESOURCE_NOT_FOUND,
          true
        );
      }
      else if(result.response == "You can't delete default markup") {
        apiErrorres(
          res,
          result.response,
          ServerStatusCode.PRECONDITION_FAILED,
          true
        );
      }
       else {
        apiErrorres(
          res,
          errorResponse.SOME_UNOWN,
          ServerStatusCode.INVALID_CRED,
          true
        );
      }
    } catch (error) {
      apiErrorres(
        res,
        errorResponse.SOMETHING_WRONG,
        ServerStatusCode.SERVER_ERROR,
        true
      );
    }
};
const getMarkUp = async (req , res) => {
  try{
    let result = await manageMarkUpServices.getMarkUp(req, res);
    if(result.response == 'Markup Data Fetch Sucessfully'){
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE

      )
    }else if(result.response == 'Markup Data not found'){
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
        ServerStatusCode.INVALID_CRED,
        true
      );
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
const getMarkUpCatogeryMaster = async (req,res) => {
  try{
  const result = await manageMarkUpServices.getMarkUpCatogeryMaster(req,res);
  if(result.response == 'Markup Catogery Data found Sucessfully'){
    apiSucessRes(
      res,
      result.response,
      result.data,
      ServerStatusCode.SUCESS_CODE
    )

  }else if(result.response == 'Markup Catogery Data Not Found'){
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
      ServerStatusCode.INVALID_CRED,
      true
    );
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


const getMarkuplogHistory = async (req,res) => {
  try{
  const result = await manageMarkUpServices.getMarkuplogHistory(req,res);
  if(result.response == 'markupLogHistory Data found Sucessfully'){
    apiSucessRes(
      res,
      result.response,
      result.data,
      ServerStatusCode.SUCESS_CODE
    )

  }else if(result.response == 'markupLogHistory Data Not Found'){
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
      ServerStatusCode.INVALID_CRED,
      true
    );
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
    addMarkup,
    deletedMarkup,
    updateMarkup,
    getMarkUp,
    getMarkUpCatogeryMaster ,
    getMarkuplogHistory
}
