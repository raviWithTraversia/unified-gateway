const { default: axios } = require("axios");
const {Config}=require('../../configs/config')
module.exports.fetchRailRefundDetails = async function (request) {
  try {
    const { reservationId, cancellationId, Authentication } = request;
    const auth = Authentication.CredentialType==="LIVE"?Config.LIVE.IRCTC_AUTH:Config.TEST.IRCTC_AUTH;
    let url = `${Config.TEST.IRCTC_BASE_URL}/eticketing/webservices/tatktservices/refunddetails/${reservationId}?agentCanId=${cancellationId}`;
    if (Authentication?.CredentialType === "LIVE")
      url = `${Config.LIVE.IRCTC_BASE_URL}/eticketing/webservices/tatktservices/refunddetails/${reservationId}?agentCanId=${cancellationId}`;
    const { data: response } = await axios.get(url, {
      headers: { Authorization: auth },
    });
    return {
      status: 200,
      result: {
        IsSucess: true,
        Message: "Refund Details Fetched",
        Data: response,
      },
    };
  } catch (error) {
    console.log({ error });
    return {
      status: 500,
      result: { IsSucess: false, Message: error.message, Error: true },
    };
  }
};
