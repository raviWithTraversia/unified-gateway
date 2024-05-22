const easeBuzzServices = require("./easeBuzz.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
    ServerStatusCode,
    errorResponse,
    CrudMessage,
} = require("../../utils/constants");

const easeBuzz = async (req, res) => {
    try {
        const result = await easeBuzzServices.easeBuzz(req);
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        );
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.INVALID_CRED,
            true
        );
    }
}

const easeBuzzResponce = async (req, res) => {
    try {
        const result = await easeBuzzServices.easeBuzzResponce(req);
        if (result.response == "Save Successfully") {
            apiSucessRes(
              res,
              result.response,
              result.data,
              ServerStatusCode.SUCESS_CODE
            );
          } else if (result.response == "Failed") {
            apiErrorres(
              res,
              result.response,
              ServerStatusCode.RESOURCE_NOT_FOUND,
              true
            );
          }else if (result.response === "Fetch Data Successfully") {
            apiSucessRes(
              res,
              result.response,
              result.data,
              ServerStatusCode.SUCESS_CODE
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
            errorResponse.SOME_UNOWN,
            ServerStatusCode.INVALID_CRED,
            true
        );
    }
}

module.exports = {
    easeBuzz,
    easeBuzzResponce
};
