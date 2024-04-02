const balanceService = require("./balanceManage.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");

const getbalance = async (req, res) => {
    try {
        const result = await balanceService.getBalance(req, res);
        if (!result.response && result.isSometingMissing) {
          apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        }else if (result.response === "User id does not exist" || result.response === "No data found for the given UserId") {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
        }else if (result.response === "Fetch Data Successfully") {
          apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
          );          
        }else {
          apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.UNPROCESSABLE,
            true
          );
        }
      } catch (error) {
        console.error(error);
        apiErrorres(
          res,
          errorResponse.SOMETHING_WRONG,
          ServerStatusCode.SERVER_ERROR,
          true
        );
      }
};



module.exports = {getbalance};
