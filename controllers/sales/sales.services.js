const User = require("../../models/User");
const FUNC = require("../../controllers/commonFunctions/common.function");
const commonStatus = require("../../utils/constants")

const getSalesInCharge = async (req, res) => {
  try {
    const  companyId  = req.params.companyId;
    console.log("companyId: ", companyId)
    let isValidcCmpanyId = FUNC.checkIsValidId(companyId);
    console.log("isValidcCmpanyId: ", isValidcCmpanyId)
    if (!isValidcCmpanyId) {
      return {
        response: "companyId is not valid",
      };
    }
    const salesInchageData = await User.find({
      company_ID: companyId,
      sales_In_Charge: true,
      userStatus: commonStatus.Status.Active
    }, {fname : 1,lastName: 1,_id: 1});
    console.log("salesInchageData: ", salesInchageData)
    if (!salesInchageData.length) {
      return {
        response: "No sales incharge exist",
      };
    } else {
      
      return {
        response: "All salses incharge data fetch",
        data: salesInchageData,
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  getSalesInCharge,
};
