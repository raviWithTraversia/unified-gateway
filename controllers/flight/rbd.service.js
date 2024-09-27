const { default: axios } = require("axios");
const { Config } = require("../../configs/config");
const {
  createRBDRequestBody,
  createRBDResponse,
} = require("../../helpers/rbd.helper");

module.exports.getFlightRDB = async (request) => {
  try {
    console.dir({ request }, { depth: null });
    const { requestBody, error: requestError } = createRBDRequestBody(request);
    if (requestError) throw new Error("Failed to create RBD request body");
    const rbdURL =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
      "/rbd/getrbd";
    const { data: response } = await axios.post(rbdURL, requestBody);
    if (!response.data?.journey?.[0]) throw new Error("No Data Available");
    return { result: createRBDResponse(response.data?.journey?.[0]) };
  } catch (err) {
    console.dir({ err }, { depth: null });
    return { error: err.message };
  }
};
