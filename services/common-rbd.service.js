const { default: axios } = require("axios");
const { Config } = require("../configs/config");
const {
  createRBDRequestBody,
  createRBDResponse,
} = require("../helpers/common-rbd.helper");
const { saveLogInFile } = require("../utils/save-log");
const { authenticate } = require("../helpers/authentication.helper");

module.exports.getCommonRBD = async (request) => {
  try {
    console.dir({ request }, { depth: null });
    const { requestBody, error: requestError } = createRBDRequestBody(request);
    saveLogInFile("rbd-request.json", requestBody);
    if (requestError) throw new Error("Failed to create RBD request body");
    const rbdURL =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
      "/prebook/v2/GetRBDs";
    // "/rbd/getrbd";

    const token = await authenticate(request.Authentication.CredentialType);
    const { data: response } = await axios.post(rbdURL, requestBody, {
      headers: { Authorization: `Bearer ${token}` },
    });
    saveLogInFile("rbd-response.json", response);

    if (!response.data?.journey?.[0]) throw new Error("No Data Available");
    return {
      result: createRBDResponse(response.data.journey[0]),
    };
  } catch (err) {
    console.dir({ err }, { depth: null });
    return { error: err?.response?.data?.message || err.message };
  }
};
