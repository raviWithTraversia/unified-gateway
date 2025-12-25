const { default: axios } = require("axios");
const { Config } = require("../configs/config");

async function authenticate(credentialType) {
  try {
    const baseURL = Config[credentialType].additionalFlightsBaseURL;

    const authRS = await axios.post(baseURL + "/auth/login", {
      Username: "UAE",
      userId: "UAE",
      password: "mypassword",
    });

    const token = authRS.data?.token;

    return token;
  } catch (err) {
    console.log("Authentication Error:", err.message);
  }
}

module.exports = { authenticate };
