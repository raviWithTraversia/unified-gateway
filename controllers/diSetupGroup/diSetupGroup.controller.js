const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  ADMIN_USER_TYPE,
  CrudMessage,
} = require("../../utils/constants");
const diSetupGoupController = require("./diSetupGroup.services");

const addDiSetupGroup = async (req, res) => {
  try {
    const result = await diSetupGoupController.addDiSetupGroup(req, res);
    if (result.response == "DiSetup Group  Added Sucessfully") {
      apiSucessRes(
        res,
        result.data,
        result.response,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "DiSetup Group Not Added") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
      //all Id should be unique
    }  else if (result.response == "Disetup  group with the same name already exists for this company") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    }
    else if (result.response == "all Id should be unique") {
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
        ServerStatusCode.RESOURCE_NOT_FOUND,
        errorResponse.SOME_UNOWN,
        true
      );
    }
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);
  }
};

const getDiSetupGroup = async (req, res) => {
  try {
    const result = await diSetupGoupController.getDiSetupGroup(req, res);
    if (result.response == "DiSetup Group Fetch Sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "DiSetup Group Not Found") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    } else {
      apiErrorres(
        res,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        errorResponse.SOME_UNOWN,
        true
      );
    }
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);
  }
};

const editDiSetupGroup = async (req, res) => {
  try {
    const result = await diSetupGoupController.editDiSetupGroup(req, res);
    if (result.response == "DiSetup Group Updated Sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "DiSetup Group Data Not Updated") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    }
    else {
      apiErrorres(
        res,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        errorResponse.SOME_UNOWN,
        true
      );
    }
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);
  }
};
const deleteDiSetupGroup = async (req, res) => {
  try {
    const result = await diSetupGoupController.deleteDiSetupGroup(req, res);
    if (result.response == "Data deleted sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "DiSetup Group data not found for this id") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    } else {
      apiErrorres(
        res,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        errorResponse.SOME_UNOWN,
        true
      );
    }
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);
  }
};
module.exports = {
  addDiSetupGroup,
  getDiSetupGroup,
  editDiSetupGroup,
  deleteDiSetupGroup
};
