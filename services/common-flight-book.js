const { default: axios } = require("axios");
const { Config } = require("../configs/config");
const {
  createAirBookingRequestBodyForCommonAPI,
} = require("../helpers/common-air-booking.helper");

module.exports.commonFlightBook = async function (request) {
  try {
    const { requestBody, error } =
      createAirBookingRequestBodyForCommonAPI(request);
    if (error) return { error };
    const url =
      Config[request?.SearchRequest?.Authentication?.CredentialType ?? "TEST"]
        .additionalFlightsBaseURL + "/booking/airbooking";

    const { data: response } = await axios.post(url, requestBody);
    return { result: { response, requestBody } };
  } catch (error) {
    console.log({ error });
    console.dir({ response: error?.response?.data }, { depth: null });
    return { error: error.message };
  }
};
