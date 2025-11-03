const { default: axios } = require("axios");
const {
  createFairRulesRequest,
} = require("../helpers/common-fair-rule.helper");
const { Config } = require("../configs/config");
const { saveLogInFile } = require("../utils/save-log");

module.exports.getCommonFairRules = async function (request) {
  try {
    const { requestBody, error } = createFairRulesRequest(request);
    saveLogInFile("fare-rule-request.json", requestBody);
    if (error) throw new Error(error);
    const fairRuleURL =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
      "/prebook/v2/FareRules";
    // "/fare/farerules";
    const { data: response } = await axios.post(fairRuleURL, requestBody);
    saveLogInFile("fare-rule-response.json", response);

    const journey = response.data?.journey?.[0];
    if (!journey) throw new Error("No Data Available");

    return {
      result: {
        Origin: journey.origin,
        Destination: journey.destination,
        SearchID: journey.journeyKey,
        SessionKey: journey.sessionKey,
        FareRules: journey?.fareRules ?? [],
      },
    };
  } catch (err) {
    console.log({ err });
    return { error: err.message };
  }
};
