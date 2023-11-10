const registration = require('../../models/Registration');
const creditRequest = require('../../models/CreditRequest');
const axios = require('axios');



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
      const { panNumber, companyId } = req.body;
  
      if (!panNumber || !companyId) {
        return{
          response: "All fields are required"
        };
      }
     
      const apiUrl = 'https://api.atlaskyc.com/v2/prod/verify/pan';
      const headers = {
        'Accept': 'application/json',
        'Authorization': 'Basic ay0zNzU2OGVjOS0zNzBiLTRiMDctYTlkOS03MWNiYjViNGQxNjM6cy01YTExMGE0MS05MGE2LTQ1ZjItOTM3YS1iYzE2NzQ4ZWE3MzA='
      };
  
      const response = await axios.post(apiUrl, {pan_number :panNumber } , { headers: headers });
  
      console.log(response.data);
      return{
        data: response.data
      };
  
    } catch (error) {
     throw error
    }
  };
  


module.exports = {
    dashBoardCount,
    checkPanCard
}