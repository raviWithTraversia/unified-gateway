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

  if (companyId === undefined || companyId === null) {
    return {
      response: "company Id field are required",
    };
  }

  // Check company Id is exis or not
  const checkCompanyIdExist = await Company.find({ _id:companyId });
  
  if (checkCompanyIdExist.length === 0) {
    return {
      response: "Compnay id does not exist",
    };
  }
  console.log(checkCompanyIdExist);
  return false;
  // Now check
  // Check Search Type Of Trip - OneWay, Round, MultiCIty
  /// get suppliere data from agency
};

module.exports = {
  getSearch,
};
