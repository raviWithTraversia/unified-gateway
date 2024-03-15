const registration = require('../../models/Registration');
const creditRequest = require('../../models/CreditRequest');
const axios = require('axios');
const { Config } = require("../../configs/config");
const registrationServices = require('../../controllers/registration/registration.services')

const dashBoardCount  = async (req,res) => {
    try{
    let  {companyId} = req.query;
    let data = {};
    let req1 = {
      params : {
        companyId : companyId
      }
    };
    let newRegistrationCount = await registrationServices.getAllRegistrationByCompany(req1,res)
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

    newRegistrationCount = newRegistrationCount?.data?.length || 0;
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
            response : 'Data Found Sucessfully' ,
            data : data
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
  
      let responseData = await axios.post(apiUrl,null,{
        headers,
        params: {
          pan_number: panNumber
        }
      });
    // let  responseData =  {
    //     "data": {
    //         "pan_number": "CNAPK1068F",
    //         "pan_status": "VALID",
    //         "pan_status_desc": "Successfully linked to an Aadhaar",
    //         "last_name": "KISHOR",
    //         "first_name": "KAUSHAL",
    //         "middle_name": "",
    //         "pan_holder_title": "Shri",
    //         "pan_last_updated": "19/08/2022",
    //         "pan_aadhaar_seeding": "Y"
    //     }
    // }
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
    //  console.log(apiUrl,"<<<==========", headers, "Code is here 114")
      const responseData = await axios.post(
        apiUrl,
        null,
        {
        headers,
        params: {
          gst_number: gstNumber
        }
      });
    // console.log(apiUrl,"<<<==========", responseData.data.data, "Code is here 121")
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