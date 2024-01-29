const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse } = require('../../utils/constants');
const userPaymentServices = require('./userPayment.services');

const manualPaymentForBalance = async (req,res) => {
    try{
    const result = await userPaymentServices.manualPaymentForBalance(req,res);
    if(result){
     
    }

    }catch(error){
        console.log(error);
        throw error
    }
};

module.exports = {
    manualPaymentForBalance  
}