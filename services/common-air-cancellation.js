const { default: axios } = require("axios");
const { Config } = require("../configs/config");
const {
  convertBookingResponse,
} = require("../helpers/common-air-booking.helper");
const {
  createAirCancellationRequestBodyForCommonAPI,
} = require("../helpers/common-air-cancellation.helper");
const { saveLogInFile } = require("../utils/save-log");

module.exports.commonAirBookingCancellation = async function (request) {
  try {
    const { requestBody, error } =
      createAirCancellationRequestBodyForCommonAPI(request);
    if (error) return { error };
    saveLogInFile("cancellation-request.json", requestBody);
    const url =
      Config[request?.SearchRequest?.Authentication?.CredentialType ?? "TEST"]
        .additionalFlightsBaseURL + "/cancel/cancelPNR";

    const { data: response } = await axios.post(url, requestBody);
    return { result: response?.data };
  } catch (error) {
    console.log({ error });
    console.dir({ response: error?.response?.data }, { depth: null });
    throw new Error(error.message);
  }
};
