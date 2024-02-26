const seriesDepartureGroupServices = require('./seriesDepartureGroup.services');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const {ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage}  = require('../../utils/constants');

const addSeriesDepartureGroup = async (req,res) => {
  try{
  const result = await seriesDepartureGroupServices.addSeriesDepartureGroup(req,res);
  if(result.response == 'Series Departure Group created successfully'){
    apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
    )
  }else if(result.response == 'Missing required fields in request body'){
    apiErrorres(
        res,
        result.response,
        ServerStatusCode.PRECONDITION_FAILED,
        true
    )
  }else{
    apiErrorres(
        res,
        result.response,
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
        )
  }
};

const getSeriesDepartureGroup = async (req,res) => {
  try{
 const result = await seriesDepartureGroupServices.getSeriesDepartureGroup(req,res);
 if(result.response == 'Series Departure Group Data Found Sucessfully'){
    apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
    )
 }else if(result.response == 'Series Departure Group not found'){
    apiErrorres(
        res,
        result.response,
        ServerStatusCode.PRECONDITION_FAILED,
        true
    )
 }else{
    apiErrorres(
        res,
        result.response,
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
        )
  }
};

const updatedSeriesDepartureGroup = async (req,res) => {

};

module.exports = {
    addSeriesDepartureGroup,
    getSeriesDepartureGroup,
    updatedSeriesDepartureGroup
}
