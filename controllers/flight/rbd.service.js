const { default: axios } = require("axios");
const { Config } = require("../../configs/config");
const {
  createRBDRequestBody,
  createRBDResponse,
} = require("../../helpers/rbd.helper");

module.exports.getFlightRDB = async (request) => {
  try {
    const requestBody = createRBDRequestBody(request);
    const { data: response } = await axios.post(
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
        "/rbd/getrbd",
      requestBody
    );
    if (!response.journey[0]) throw new Error("No Data Available");
    console.dir({ response }, { depth: null });
    return { result: createRBDResponse(response) };
  } catch (err) {
    console.log({ err });
    return { error: err.message };
  }
};
