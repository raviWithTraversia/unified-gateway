const { default: axios } = require("axios");
const { Config } = require("../../configs/config");

const {
  createAirPricingRequestBodyForCommonAPI,
} = require("../../helpers/additional-air-pricing.helper");

module.exports.getRDB = async (request) => {
  try {
    const requestBody = createAirPricingRequestBodyForCommonAPI(request);
    const { data: response } = await axios.post(
      Config[Config.MODE].additionalFlightsBaseURL + "/getrbd",
      requestBody
    );
    return response;
  } catch (err) {
    console.log({ err });
  }
};
