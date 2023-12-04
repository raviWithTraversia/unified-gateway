const registration = require('../../models/Registration');
const creditRequest = require('../../models/CreditRequest');
const axios = require('axios');
const { Config } = require("../../configs/config");
const axiosRetry = require('axios-retry');


const dashBoardCount  = async (req,res) => {
    try{
    let  {companyId} = req.query;
    let data = {};
    let newRegistrationCount = await registration.find({companyId : companyId});
    let creditReqCount = await creditRequest.find({companyId : companyId});
    let pending = 0;
    let hold = 0;
    let failedAtPayment = 0;
    let allFailed = 0;
    let refund = 0;
    let refundPending = 0;
    let RegisteredAgentConfig = 0;
    let depositRequest = 0;
    let amendement = 0;

    newRegistrationCount = newRegistrationCount.length || 0;
    creditReqCount = creditReqCount.length || 0;
    data['New RegistrationCount'] = newRegistrationCount;
    data['Temp Credit Requests'] = creditReqCount;
    data['Hold'] = hold;
    data['Pending'] = pending;
    data['Failed_at_Payment'] = failedAtPayment;
    data['All_Failed'] = allFailed;
    data['Refund'] = refund;
    data['refund_Pending'] = refundPending;
    data['Registered_Agent_Config'] = RegisteredAgentConfig;
    data['depositRequest'] = depositRequest;
    data['amendement'] = amendement;

    if(newRegistrationCount){
        return {
            response : "Count Fetch Sucessfully",
            data : data
        }
    }else{
        return {
            response : '0' 
        }
    }
      
    }catch(error){
       console.log(error);
       throw error 
    }
};

const checkPanCard = async (req, res) => {
    try {
      const { panNumber } = req.body;
  
      if (!panNumber) {
        return {
          response: "PAN number is required"
        };
      }
  
      const apiUrl = Config.PAN_URL;
      const headers = Config.HADDER_3RD_PAERT;
  
      const responseData = await axios.post(apiUrl,null,{
        headers,
        params: {
          pan_number: panNumber
        }
      });
  
      if(responseData){
        return {
          response : "Data Fetch Sucessfully",
          data: responseData.data  
        };
      }else{
          return {
              response : "Some Error in 3rd party api"
          }
      }
    } catch (error) {
      throw error;
    }
};

const checkGstin = async (req,res) => {
    try{
        const { gstNumber } = req.body;
        
      if (!gstNumber) {
        return {
          response: "GST number is required"
        };
      }
  
      const apiUrl = Config.GST_URL;
      const headers = Config.GST_TOKEN;
  
      const responseData = await axios.post(apiUrl,null,{
        headers,
        params: {
          gst_number: gstNumber
        }
      });
       
      if(responseData){
      return {
        response : "Data Fetch Sucessfully",
        data: responseData.data  
      };
    }else{
        return {
            response : "Some Error"
        }
    }
    }
    catch(error){
        console.log(error);
        throw error 
    }
};

module.exports = {
    dashBoardCount,
    checkPanCard,
    checkGstin
}