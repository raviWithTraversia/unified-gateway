const registration = require('../../models/Registration');
const creditRequest = require('../../models/CreditRequest');


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



module.exports = {
    dashBoardCount
}