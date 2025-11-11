const { default: axios } = require("axios");
const { Config } = require("../configs/config");
const {
  convertBookingResponse,
} = require("../helpers/common-air-booking.helper");
const {
  createAirCancellationRequestBodyForCommonAPI,
} = require("../helpers/common-air-cancellation.helper");
const { saveLogInFile } = require("../utils/save-log");
const { getVendorList } = require("../helpers/credentials");

module.exports.commonSplitPNR = async function (request) {
  try {
    const importPNRRequest = {
      typeOfTrip: "ONEWAY",
      travelType: "DOM",
      credentialType: request.Authentication?.CredentialType,
      traceId: request.Authentication?.TraceId || uuidv4(),
      companyId: request.Authentication?.CompanyId,
      recLoc: {
        type: "GDS",
        pnr: request.PNR,
      },
      provider: request.Provider,
      vendorList: getVendorList(request.Authentication.CredentialType),
    };
    saveLogInFile("import-pnr-request.json", importPNRRequest);
    const importPnrUrl =
      Config[request.Authentication.CredentialType ?? "TEST"]
        .additionalFlightsBaseURL + `/postbook/v2/RetrievePnr`;

    const pnrResponse = await axios.post(importPnrUrl, importPNRRequest);
    const result = pnrResponse.data?.data?.journey?.[0];

    // ? same as cancellation request
    const { requestBody, error } = createAirCancellationRequestBodyForCommonAPI(
      request,
      result
    );
    if (error) return { error };
    saveLogInFile("split-pnr-request.json", requestBody);
    const url =
      Config[request?.Authentication?.CredentialType ?? "TEST"]
        .additionalFlightsBaseURL + "/postbook/v2/SplitPnr";

    const { data: response } = await axios.post(url, requestBody);
    saveLogInFile("split-pnr--response.json", response);

    if (response?.errors?.length) return { error: response.errors[0] };
    return { result: response?.data };
  } catch (error) {
    saveLogInFile("split-pnr-error.json", error?.response?.data);
    console.dir({ response: error?.response?.data }, { depth: null });
    return { error };
  }
};
