//const airGstMandate = require("../../models/configManage/AirGSTMandate");
const Company = require("../../models/Company");

const getSearch = async (req, res) => {
  const { Authentication, TypeOfTrip, Segments, PaxDetail, TravelType } =
    req.body;
  const fieldNames = [
    "Authentication",
    "TypeOfTrip",
    "Segments",
    "PaxDetail",
    "TravelType",
  ];
  const missingFields = fieldNames.filter(
    (fieldName) =>
      req.body[fieldName] === null || req.body[fieldName] === undefined
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

  if (!companyId) {
    return {
      response: "company Id field are required",
    };
  }

  // Check if company Id exists
  const checkCompanyIdExist = await Company.findById(companyId);

  if (!checkCompanyIdExist) {
    return {
      response: "Compnay id does not exist",
    };
  }
  // Also CHeck Role Of TMC by Company Id( PENDING )
  // Logs Pending

  // Check Travel Type ( International / Domestic )
  let result;
  if (TravelType === "International") {
    result = await handleInternational(Authentication);
  } else if (TravelType === "Domestic") {
    result = await handleDomestic(Authentication);
  } else {
    return {
      response: "Travel Type Not Valid",
    };
  }
  return {
    response: "Fetch Data Successfully",
    data: result,
  };
};

async function handleInternational(Authentication) {  // International
    // Check Supplier and Get Details
    // Check LIVE and TEST
    const { CredentialType, CompanyId, TraceId } = Authentication;
     
    const supplierObj = [{'supplierCode': '1G'},{'supplierCode': 'TBO'}];
    
    console.log(supplierObj);

    return supplierObj;
}

async function handleDomestic(Authentication) { // Domestic
  return "Domestic";
}

module.exports = {
  getSearch,
};
