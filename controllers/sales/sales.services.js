const User = require("../../models/User");
const FUNC = require("../../controllers/commonFunctions/common.function");

const getSalesInCharge = async (req, res) => {
  try {
    const { companyId, salesInCharge } = req.body;
    let isValidcCmpanyId = FUNC.checkIsValidId(companyId);
    if (!isValidcCmpanyId) {
      return {
        response: "companyId is not valid",
      };
    }
    const salesInchageData = User.find({
      company_ID: companyId,
      sales_In_Charge: salesInCharge,
    });
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
