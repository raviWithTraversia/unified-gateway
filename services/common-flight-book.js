const { default: axios } = require("axios");
const { Config } = require("../configs/config");
const {
  createAirBookingRequestBodyForCommonAPI,
  convertBookingResponse,
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
    console.dir({ response }, { depth: null });
    return convertBookingResponse(request, response);
  } catch (error) {
    console.log({ error });
    throw new Error(error.message);
    // console.dir({ response: error?.response?.data }, { depth: null });
    // return { error: error.message };
  }
};
