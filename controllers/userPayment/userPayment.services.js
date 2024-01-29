const diModel = require('../../models/DiSetup');
const depositePayment = require('../../models/DepositePayment');
const userBalanceModel = require('../../models/UserCashBalance');
const diSetupModel = require('../../models/DiSetup')
const userModel = require('../../models/User');
const companyModel = require('../../models/Company');
const {HOST_ROLE, Status} = require('../../utils/constants');
const commonFunc = require('../commonFunctions/common.function')

const manualPaymentForBalance = async (req,res) => {
    let {userId , amount , remarks} = req.body;
    try{
    let checkIsValidId = commonFunc.checkIsValidId(userId);
    if(checkIsValidId == "Invalid Mongo Object Id"){
       return {
         response : 'UserId Is Not Valid'
       }
    }
     // check agencyId parant is tmc or distributer
     let checkUserRole = await userModel.find({_id : userId}).populate('roleId').sort({minAmount : 1});
     console.log("====>>>>", checkUserRole, "<<<=====");
     if(checkUserRole[0].roleId.name == HOST_ROLE.TMC){
        
     }
    else if(checkUserRole[0].roleId.name == HOST_ROLE.AGENCY || checkUserRole[0].roleId.name == HOST_ROLE.DISTRIBUTER ){
       // check parent role
       let companyId = checkUserRole[0].company_ID;
       let getCompanyData = await companyModel.find({_id : companyId,companyStatus: Status.Active });
       console.log("?????????? ==>",getCompanyData,"<<<======" )
       let checkParantType = await companyModel.find({_id : getCompanyData[0].parent});
        if(checkParantType[0]?.type == HOST_ROLE.TMC){
    // if(parant is tmc then fetch di data and calculate incentive % and add insentive amount on input amount and suit the mail)
           let diData = await diSetupModel.find({ companyId: getCompanyData[0]?.parent })
           .select('minAmount diPersentage');
           console.log("==>>",diData, "<<===")
           let calcIncentive = 0;
           if(amount > diData[0].minAmount){
            calcIncentive = calculateIncentive(amount,diData);
           }
           //console.log("{{{{{{",calcIncentive, "}}}}}}}}}}}}}}}}}}}}}}}")
        }else{
    // if(parant is distributer then check is  their parant have any insentive or not)
    
        }
     }
   

    }catch(error){
        console.log(error);
        throw error
    }
};

const calculateIncentive = (amount , diSlab) => {
   let incentiveAmount = 0;
   let remainingAmount = amount;
   for(slab of diSlab){
     if(remainingAmount > 0){
        let incentiveAmountSlab = Math.min(remainingAmount ,slab.minAmount) ;
        let calcIncentiveAmount = (incentiveAmountSlab * slab.diPersentage) / 100;
        incentiveAmount += calcIncentiveAmount;
        remainingAmount -= incentiveAmountSlab;
     }else{
        break;
     }
   };
   return incentiveAmount;

}

module.exports = {
  manualPaymentForBalance
}