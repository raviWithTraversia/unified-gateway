const { default: axios } = require("axios");
const { Config } = require("../configs/config");

async function authenticate(credentialType) {
  const baseURL = Config[credentialType].additionalFlightsBaseURL;

  const authRS = await axios.post(baseURL + "/auth/login", {
    userId: "UAE",
    password: "mypassword",
  });

  const token = authRS.data?.token;

  return token;
}

module.exports = { authenticate };
