const salesInCharge = require('./sales.services');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const {ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage}  = require('../../utils/constants');

const getSalesInCharge = async (req,res) => {
    try{
      const result = await salesInCharge.getSalesInCharge(req,res);
      if(result.response === "companyId is not valid"){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.INVALID_CRED,
            true
        )
      }
      else if(result.response === "No sales incharge exist"){
        apiErrorres(
            res,
            result.response,
            ServerStatusCode.NOT_EXIST_CODE,
            true
        )
      }
      else{
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
      }
    }catch{
        apiErrorres(
            res,
            result.error,
            ServerStatusCode.BAD_REQUEST,
            true
        )
    }
}

module.exports = {
    getSalesInCharge
}