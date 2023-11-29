//const airGstMandate = require("../../models/configManage/AirGSTMandate");
const Company = require("../../models/Company");
const Supplier = require("../../models/Supplier");
const axios = require("axios");
const getSearch = async (req, res) => {
  const {
    Authentication,
    TypeOfTrip,
    Segments,
    PaxDetail,
    TravelType,
    Flexi,
    Direct,
    ClassOfService,
    Airlines,
    FareFamily,
    RefundableOnly,
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
    result = await handleInternational(
      Authentication,
      TypeOfTrip,
      Segments,
      PaxDetail,
      TravelType,
      Flexi,
      Direct,
      ClassOfService,
      Airlines,
      FareFamily,
      RefundableOnly
    );
  } else if (TravelType === "Domestic") {
    result = await handleDomestic(
      Authentication,
      TypeOfTrip,
      Segments,
      PaxDetail,
      TravelType,
      Flexi,
      Direct,
      ClassOfService,
      Airlines,
      FareFamily,
      RefundableOnly
    );
  } else {
    return {
      response: "Travel Type Not Valid",
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

async function handleInternational(
  Authentication,
  TypeOfTrip,
  Segments,
  PaxDetail,
  TravelType,
  Flexi,
  Direct,
  ClassOfService,
  Airlines,
  FareFamily,
  RefundableOnly
) {
  // International
  // Check LIVE and TEST
  const { CredentialType, CompanyId, TraceId } = Authentication;
  if (!["LIVE", "TEST"].includes(CredentialType)) {
    return {
      IsSucess: false,
      response: "Credential Type does not exist",
    };
  }
  const supplierCredentials = await Supplier.find({
    companyId: CompanyId,
    credentialsType: CredentialType,
  })
    .populate({
      path: "supplierCodeId",
      select: "supplierCode",
    })
    .exec();
  if (!supplierCredentials || !supplierCredentials.length) {
    return {
      IsSucess: false,
      response: "Supplier credentials does not exist",
    };
  }
  if (!TraceId) {
    return {
      IsSucess: false,
      response: "Trace Id Required",
    };
  }
  // Commertial query call here ( PENDING )
  // Supplier API Integration Start Here ....
  const responsesApi = await Promise.all(
    supplierCredentials.map(async (supplier) => {
      try {
        switch (supplier.supplierCodeId.supplierCode) {
          case "Kafila":
            return await internationalKafilaFun(
              supplier,
              TypeOfTrip,
              Segments,
              PaxDetail,
              TravelType,
              Flexi,
              Direct,
              ClassOfService,
              Airlines,
              FareFamily,
              RefundableOnly
            );

          default:
            throw new Error(
              `Unsupported supplier: ${supplier.supplierCodeId.supplierCode}`
            );
        }
      } catch (error) {
        return { error: error.message, supplier: supplier };
      }
    })
  );

  // Combine the responses here
  const combineResponseObj = {};
  supplierCredentials.forEach((supplier, index) => {
    const responsecombineapi = responsesApi[index];
    if (!responsecombineapi.error) {
      combineResponseObj[supplier.supplierCodeId.supplierCode] =
        responsecombineapi;
    } else {
      combineResponseObj[supplier.supplierCodeId.supplierCode] = {
        IsSucess: false,
        response: "Supplier Not Found",
      };
    }
  });

  return {
    IsSucess: true,
    response: combineResponseObj,
  };
}

const internationalKafilaFun = async (
  supplier,
  TypeOfTrip,
  Segments,
  PaxDetail,
  TravelType,
  Flexi,
  Direct,
  ClassOfService,
  Airlines,
  FareFamily,
  RefundableOnly
) => {
  // Apply APi for Type of trip ( ONEWAY / ROUNDTRIP / MULTYCITY )
  if (!["MULTYCITY", "ONEWAY", "ROUNDTRIP"].includes(TypeOfTrip)) {
    return {
      IsSucess: false,
      response: "Type of trip does not exist",
    };
  }
  // add api with here oneway round multicity

  return Flexi;
};
async function handleDomestic(
  Authentication,
  TypeOfTrip,
  Segments,
  PaxDetail,
  TravelType,
  Flexi,
  Direct,
  ClassOfService,
  Airlines,
  FareFamily,
  RefundableOnly
) {
  // Domestic
  return "Domestic";
}

module.exports = {
  getSearch,
};
