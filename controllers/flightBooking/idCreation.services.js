const flightcommercial = require("./flight.commercial");
const PromoCode = require("../../models/AirlinePromoCode");
const Company = require("../../models/Company");
const Supplier = require("../../models/Supplier");
const seriesDeparture = require("../../models/SeriesDeparture");
const AirportsDetails = require("../../models/AirportDetail");
const fareFamilyMaster = require("../../models/FareFamilyMaster");
const Role = require("../../models/Role");
const axios = require("axios");
const uuid = require("uuid");
const NodeCache = require("node-cache");
const flightCache = new NodeCache();
const moment = require("moment");

const getIdCreation = async (req, res) => {
  const {
    companyId,
    prefix,    
  } = req.body;
  const fieldNames = [
    "companyId",
    "prefix",    
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
  if (!companyId) {
    return {
      response: "TMC Compnay id does not exist",
    };
  }

  // Check if company Id exists
  const checkCompanyIdExist = await Company.findById(companyId);
  if (!checkCompanyIdExist || checkCompanyIdExist.type !== "TMC") {
    return {
      response: "TMC Compnay id does not exist",
    };
  }  

  if (!result.IsSucess) {
    return {
      response: result.response,
    };
  } else {
    return {
      response: "Fetch Data Successfully",
      data: result.response,
    };
  }
};

module.exports = {
    getIdCreation,
};
