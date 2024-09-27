const { default: axios } = require("axios");
const { Config } = require("../../configs/config");
const {
  createRBDRequestBody,
  createRBDResponse,
} = require("../../helpers/rbd.helper");

module.exports.getFlightRDB = async (request) => {
  try {
    console.dir({ request }, { depth: null });
    const requestBody = createRBDRequestBody(request);
    console.dir({ requestBody }, { depth: null });
    const rbdURL =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
      "/rbd/getrbd";
    console.log({ rbdURL });
    const { data: response } = await axios.post(rbdURL, requestBody);
    console.dir({ response }, { depth: null });
    if (!response.data?.journey?.[0]) throw new Error("No Data Available");
    return { result: createRBDResponse(response.data?.journey?.[0]) };
  } catch (err) {
    console.dir({ err }, { depth: null });
    return { error: err.message };
  }
};
