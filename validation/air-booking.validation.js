const Company = require("../models/Company");

module.exports.validateAirBooking = async function (req) {
  try {
    if (!req.body.SearchRequest) {
      return {
        success: false,
        response: "missing SearchRequest",
      };
    }
    if (!req.body.SearchRequest?.Authentication) {
      return {
        success: false,
        response: "missing Authentication",
      };
    }
    const {
      SearchRequest: { Authentication, TravelType },
    } = req.body;
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
      "PassengerPreferences",
      "ItineraryPriceCheckResponses",
      "paymentMethodType",
      "paymentGateway",
    ];

    const missingFields = fieldNames.filter(
      (fieldName) => req.body.SearchRequest[fieldName] == null
    );
    if (missingFields.length) {
      const missingFieldsString = missingFields.join(", ");
      return {
        success: false,
        response: null,
        isSometingMissing: true,
        data: `Missing or null fields: ${missingFieldsString}`,
      };
    }
    let companyId = Authentication.CompanyId;
    let UserId = Authentication.UserId;
    if (!companyId || !UserId) {
      return {
        success: false,
        response: "Company or User id field are required",
      };
    }
    const checkCompanyIdExist = await Company.findById(companyId);
    if (!checkCompanyIdExist || checkCompanyIdExist.type !== "TMC") {
      return {
        success: false,
        response: "TMC Compnay id does not exist",
      };
    }
    if (TravelType !== "International" && TravelType !== "Domestic") {
      return {
        success: false,
        response: "Travel Type Not Valid",
      };
    }
    return { success: true, message: "Validation Passed" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
