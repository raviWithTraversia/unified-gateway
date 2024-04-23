const payuServices = require("./payu.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");

const payu = async (req, res) => {
    try {        
        const result = await payuServices.payu(req);
        if(result.response == 'All field are required' || result.response == 'companyId does not exist' || result.response == 'createdBy id does not exist') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            apiSucessRes(
                res,
                CrudMessage.PAYU_REQUEST_RESPONCE,
                result.response,
                ServerStatusCode.SUCESS_CODE
            )  
        }
        
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
};
module.exports = {
  payu,
};
