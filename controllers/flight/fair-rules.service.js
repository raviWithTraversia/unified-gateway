const { default: axios } = require("axios");
const { createFairRulesRequest } = require("../../helpers/fair-rule.helper");
const { Config } = require("../../configs/config");

module.exports.getFairRulesService = async function (request) {
  try {
    const { requestBody, error } = createFairRulesRequest(request);
    if (error) throw new Error(error);
    const fairRuleURL =
      Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
      "/fare/farerules";
    const { data: response } = await axios.post(fairRuleURL, requestBody);
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
