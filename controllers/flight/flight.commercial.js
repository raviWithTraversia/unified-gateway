const aircommercials = require("../../models/AirCommercial");
const getApplyAllCommercial = async (userTypeString,companyDetails,Authentication,commonArray) => {
    const companyId = companyDetails._id;
    const parentId = companyDetails.parent._id;
    // Now check agent config and group config
    // assign conditions here and get commerciall plan 
    const commercialPlanId = "659ce88a6cc654ffe95d12d0"; // if not exist then get default
    const getAirCommercials = await aircommercials.find({commercialAirPlanId:commercialPlanId}); // commertialplan inside air commertial plan list
    
    
    if(userTypeString === "TMC-Agency" ){ // one time apply commercial,incentive,plb,markup

    }else if(userTypeString === "TMC-Distributer-Agency"){ // two times apply commercial,incentive,plb,markup

    }else if(userTypeString === "TMC-Distributer"){ // one time apply commercial,incentive,plb,markup

    }else{ // only for tmc

    }
    return {
        IsSucess: true,
        response: getAirCommercials,
      };
};
module.exports = {
    getApplyAllCommercial,
  };