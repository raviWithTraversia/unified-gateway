const airGSTMandateService = require("./configManage.service");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");

const addairGSTMandate = async (req, res) => {
  try {
    const result = await airGSTMandateService.addGSTMandate(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
    }else if (result.response === "Compnay id does not exist" || result.response == 'company Id field are required' || result.response == 'Records Already Exists') {
        apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    }else if (result.response === "Add Air GST Mandate Successfully") {
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

const getairGSTMandate = async (req, res) => {
    try {
        const result = await airGSTMandateService.getairGSTMandate(req, res);
        if (!result.response && result.isSometingMissing) {
          apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
        }else if (result.response === "Company Id required" || result.response == 'Company Id Not Valid') {
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

const updateairGSTMandate = async (req, res) => {
  try {
      const result = await airGSTMandateService.updateairGSTMandate(req, res);
      if (!result.response && result.isSometingMissing) {
        apiErrorres(res, result.data, ServerStatusCode.SERVER_ERROR, true);
      }else if (result.response === "Air GST Mandate Id required" || result.response === "Company Id required" || result.response == 'Record not found for the provided Id') {
          apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
      }else if (result.response === "Update Air GST Mandate Successfully") {
        apiSucessRes(
          res,
          result.response,
          result.data,
          ServerStatusCode.SUCESS_CODE
        )
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

const deleteGSTMandate = async (req,res) => {
  try{
  const result = await airGSTMandateService.deleteGSTMandate(req,res);
  if(result.response == 'Air GST Mandate Delete Sucessfully'){
   apiSucessRes(
    res,
    result.response,
    result.data,
    ServerStatusCode.SUCESS_CODE
   )
  }else if(result.response == 'Air GST Mandate Id required'){
    apiErrorres(
      res,
       result.response, 
       ServerStatusCode.RESOURCE_NOT_FOUND,
        true);
  

  }else if(result.response == 'Air GST Mandate id not found'){
   apiErrorres(
    res,
    result.response,
    ServerStatusCode.PRECONDITION_FAILED,
    true
   )
  }else{
    apiErrorres(
      res,
      errorResponse.SOME_UNOWN,
      ServerStatusCode.UNPROCESSABLE,
      true
    );
  }

  }catch(error){
    console.error(error);
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
}



module.exports = { addairGSTMandate,getairGSTMandate, updateairGSTMandate, deleteGSTMandate };
