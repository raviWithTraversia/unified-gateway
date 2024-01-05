const agencyGroupModel = require('../../models/AgencyGroup');

const addAgencyGroup = async (req,res) => {
    try{
    let {
        privilagePlanId ,
        commercialPlanId,
        plbGroupId,
        incentiveGroupId,
        fairRuleGroupId,
        diSetupGroupId,
        airlinePromoCodeGroupId,
        isDefault,
        companyId} = req.body;

        if (isDefault === true) {
            let checkIsAnydefaultTrue =
              await agencyGroupModel.updateMany(
                { companyId },
                { isDefault: false }
              );
          }

    }catch(error){
        console.log(error);
        throw error
    }
};

module.exports = {
    addAgencyGroup 
}