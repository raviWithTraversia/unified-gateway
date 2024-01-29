const { apiSucessRes, apiErrorres } = require("../../utils/commonResponse");
const {
  ServerStatusCode,
  errorResponse,
  ADMIN_USER_TYPE,
  CrudMessage,
} = require("../../utils/constants");
const agencyGoupController = require("./agencyGroup.services");

const addAgencyGroup = async (req, res) => {
  try {
    const result = await agencyGoupController.addAgencyGroup(
      req,
      res
    );
    if (result.response == "Agency Group  Added Sucessfully") {
      apiSucessRes(
        res,
        result.data,
        result.response,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "Agency  Group Not Added") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    } else if (
      result.response ==
      "Agency group with the same name already exists for this company"
    ) {
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
const getAgencyGroup = async (req, res) => {
  try {
    const result = await agencyGoupController.getAgencyGroup(
      req,
      res
    );
    if (result.response == "Agency Group Fetch Sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "Agency Group Not Found") {
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
const editAgencyGroup = async (req, res) => {
  try {
    const result = await agencyGoupController.editAgencyGroup(
      req,
      res
    );
    if (result.response == "Agency Group Updated Sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "Agency Group Data Not Updated") {
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
const deleteAgencyGroup = async (req, res) => {
  try {
    const result = await agencyGoupController.deleteAgencyGroup(
      req,
      res
    );
    if (result.response == "Data deleted sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (
      result.response == "Agency Group data not found for this id"
    ) {
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
const assignAgencyGroup = async (req, res) => {
  try {
    const result = await agencyGoupController.assignAgencyGroup(
      req,
      res
    );
    if (result.response == "Selected Agency Successfully Assigned To The Group") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "Selected Agency Not Updated Successfully") {
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

const getAssignAgencyGroup = async (req,res) => {
  try{
    const result = await agencyGoupController.getAssignAgencyGroup(
      req,
      res
    );
    if (result.response == "Data Fetch Sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "User Data Not Found") {
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

  }catch(error){
    apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);

  }
}

module.exports = {
  addAgencyGroup,
  getAgencyGroup,
  editAgencyGroup,
  deleteAgencyGroup,
  assignAgencyGroup,
  getAssignAgencyGroup
};
