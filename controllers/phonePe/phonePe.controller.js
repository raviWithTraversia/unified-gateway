const phonePeSearvice = require("./phonePe.service");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {lyraAndPhonePeFlightCommonSucess,phonePeAndLyraRailWalletSucess,lyraAndPhonePeFlightBookingCommonSucess}=require('../lyraPg/lyraService')
const {
    ServerStatusCode,
    errorResponse,
    CrudMessage,
  } = require("../../utils/constants");

  const phonePeInitiatePayment = async (req, res) => {
    try {
      const response = await phonePeSearvice.phonePeRedirectUrl(req);
      if(response?.response == "failed to get phonePe Token"){
        return apiErrorres(res, response.response, 400, true);
      }
      else if(response?.response == "success"){
      return res.status(200).json({success:true,data:response.data});
}
    } catch (error) {
      return apiErrorres(res, error.message,500,false);
    }
  };
  const phonePeFlightWalletSuccess = async (req, res) => {
    try {
      const response = await phonePeSearvice.phonePeSuccess(req,res);
      if(response?.response == "failed to get phonePe Token"){
        return apiErrorres(res, response.response, 400, false);
      }
      else if(response?.response == "success"){
    let htmlData= await lyraAndPhonePeFlightCommonSucess(response.data);
      res.setHeader("Content-Type", "text/html"); // ✅ Important

    res.send(htmlData);
}
else {
    apiErrorres(res, response.response, 400, response.data);
}
      
    } catch (error) {
      return apiErrorres(res, error.message,500,false);
    }
  };

  const phonePeRailWalletSuccess = async (req, res) => {
    try {
      const response = await phonePeSearvice.phonePeSuccess(req,res);
      if(response?.response == "failed to get phonePe Token"){
        return apiErrorres(res, response.response, 400, false);
      }
      else if(response?.response == "success"){
    let htmlData= await phonePeAndLyraRailWalletSucess(response.data);
    res.send(htmlData);
}
else {
    apiErrorres(res, response.response, 400, response.data);
}
      
    } catch (error) {
      return apiErrorres(res, error.message,500,false);
    }
  };
  const phonePeFlightBookingSuccess = async (req, res) => {
    try {
      const response = await phonePeSearvice.phonePeSuccess(req,res);
      if(response?.response == "failed to get phonePe Token"){
        return apiErrorres(res, response.response, 400, false);
      }
      else if(response?.response == "success"){
    let htmlData= await lyraAndPhonePeFlightBookingCommonSucess(response.data);
    res.send(htmlData);
}
else {
    apiErrorres(res, response.response, 400, response.data);
}
      
    } catch (error) {
      return apiErrorres(res, error.message,500,false);
    }
  };
  module.exports = {
    phonePeInitiatePayment,
    phonePeFlightWalletSuccess,
    phonePeRailWalletSuccess,
    phonePeFlightBookingSuccess
  };