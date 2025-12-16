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
const { authenticate } = require("../helpers/authentication.helper");

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
    saveLogInFile("IMPORT-PNR.RQ.JSON", importPNRRequest);
    const importPnrUrl =
      Config[request.Authentication.CredentialType ?? "TEST"]
        .additionalFlightsBaseURL + `/postbook/v2/RetrievePnr`;

    const token = await authenticate(request.Authentication.CredentialType);
    const pnrResponse = await axios.post(importPnrUrl, importPNRRequest, {
      headers: { Authorization: `Bearer ${token}` },
    });
    saveLogInFile("IMPORT-PNR.RS.JSON", pnrResponse.data);

    const result = pnrResponse.data?.data?.journey?.[0];

    // ? same as cancellation request
    const { requestBody, error } = createAirCancellationRequestBodyForCommonAPI(
      request,
      result
    );
    if (error) return { error };
    saveLogInFile("SPLIT-PNR.RQ.JSON", requestBody);
    const url =
      Config[request?.Authentication?.CredentialType ?? "TEST"]
        .additionalFlightsBaseURL + "/postbook/v2/SplitPnr";

    const { data: response } = await axios.post(url, requestBody, {
      headers: { Authorization: `Bearer ${token}` },
    });
    saveLogInFile("SPLIT-PNR.RS.JSON", response);

    if (response?.errors?.length) return { error: response.errors[0] };
    const bookingResponse = convertBookingResponse(null, response, null, false);

    return { result: bookingResponse };
  } catch (error) {
    saveLogInFile("SPLIT-PNR.ERR.JSON", {
      data: error?.response?.data,
      message: error.message,
      stack: error.stack,
    });
    console.dir({ response: error?.response?.data }, { depth: null });
    return { error };
  }
};
