const Company = require("../models/Company");

module.exports.validateSearchRequest = async (req) => {
  const { Authentication, TravelType } = req.body;
  const fieldNames = [
    "Authentication",
    "TypeOfTrip",
    "Segments",
    "PaxDetail",
    "TravelType",
    "Flexi",
    "Direct",
    "ClassOfService",
    "Airlines",
    "FareFamily",
    "RefundableOnly",
  ];
  const missingFields = fieldNames.filter(
    (fieldName) => req.body[fieldName] == null
  );

  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(", ");
    return {
      response: null,
      isSometingMissing: true,
      data: `Missing or null fields: ${missingFieldsString}`,
    };
  }

  let companyId = Authentication.CompanyId;
  let UserId = Authentication.UserId;
  if (!companyId || !UserId)
    return {
      response: "Company or User id field are required",
    };

  const checkCompanyIdExist = await Company.findById(companyId);
  if (!checkCompanyIdExist || checkCompanyIdExist.type !== "TMC")
    return {
      response: "TMC Compnay id does not exist",
    };

  // Also CHeck Role Of TMC by Company Id( PENDING )
  // Logs Pending
  console.log(`[${new Date().toISOString()}] - Start Search`);
  // Check Travel Type ( International / Domestic )
  if (TravelType !== "International" && TravelType !== "Domestic")
    return {
      response: "Travel Type Not Valid",
    };

  return { success: true, response: "Valid Request" };
};
