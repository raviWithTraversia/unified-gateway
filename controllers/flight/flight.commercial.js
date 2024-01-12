const aircommercials = require("../../models/AirCommercial");
const UserModule = require("../../models/User");
const Company = require("../../models/Company");
const getApplyAllCommercial = async (Authentication, commonArray) => {
  const userDetails = await UserModule.findOne({ _id: Authentication.UserId });
  if (!userDetails) {
    return {
      IsSuccess: false,
      response: "User Id Not Available",
    };
  }

  const companyDetails = await Company.findOne({
    _id: userDetails.company_ID,
  }).populate("parent", "type");

  return {
    IsSucess: true,
    response: commonArray,
  };

  if (companyDetails.type == "Agency" && companyDetails.parent.type == "TMC") {
    // TMC-Agency // // one time apply commertioal

  } else if (
    companyDetails.type == "Agency" &&
    companyDetails.parent.type == "Distributer"
  ) {
    // TMC-Distributer-Agency // Two time apply commertioal
  } else if (
    companyDetails.type == "Distributer" &&
    companyDetails.parent.type == "TMC"
  ) {
    // Distributer-TMC // one time apply commertioal
  } else {
    // TMC itself
  }

  // const companyId = companyDetails._id;
  // const parentId = companyDetails.parent._id;
  // // Now check agent config and group config
  // // assign conditions here and get commerciall plan
  // const commercialPlanId = "659ce88a6cc654ffe95d12d0"; // if not exist then get default
  // const getAirCommercials = await aircommercials.find({commercialAirPlanId:commercialPlanId}); // commertialplan inside air commertial plan list

  // if(userTypeString === "TMC-Agency" ){ // one time apply commercial,incentive,plb,markup

  // }else if(userTypeString === "TMC-Distributer-Agency"){ // two times apply commercial,incentive,plb,markup

  // }else if(userTypeString === "TMC-Distributer"){ // one time apply commercial,incentive,plb,markup

  // }else{ // only for tmc

  // }
  // return {
  //     IsSucess: true,
  //     response: commonArray,
  //   };
};
module.exports = {
  getApplyAllCommercial,
};
