const { default: axios } = require("axios");
const { Config } = require("../configs/config");
const {
  
  convertBookingResponse,
} = require("../helpers/common-air-booking.helper");
const { createAirCancellationRequestBodyForCommonAPI } = require("../helpers/common-air-cancellation.helper");

module.exports.commonAirBookingCancellation = async function (request) {
  try {
    const { requestBody, error } =
      createAirCancellationRequestBodyForCommonAPI(request);
    if (error) return { error }; 
    const url =
      Config[request?.SearchRequest?.Authentication?.CredentialType ?? "TEST"]
        .additionalFlightsBaseURL + "/cancel/cancelPNR";

    const { data: response } = await axios.post(url, requestBody);
    console.dir({ response }, { depth: null });
    return {result:response?.data}
  } catch (error) {
    console.log({ error });
    throw new Error(error.message);
  }
};
