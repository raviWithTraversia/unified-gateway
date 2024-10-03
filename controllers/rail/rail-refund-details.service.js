const { default: axios } = require("axios");

module.exports.fetchRailRefundDetails = async function (request) {
  try {
    const { reservationId, cancellationId, Authentication } = request;
    const auth = "Basic V0tBRkwwMDAwMDpUZXN0aW5nMQ==";
    let url = `https://stagews.irctc.co.in/eticketing/webservices/tatktservices/refunddetails/${reservationId}?agentCanId=${cancellationId}`;
    if (Authentication?.CredentialType === "LIVE")
      url = `https://stagews.irctc.co.in/eticketing/webservices/tatktservices/refunddetails/${reservationId}?agentCanId=${cancellationId}`;
    const { data: response } = await axios.get(url, {
      headers: { Authorization: auth },
    });
    return {
      status: 200,
      result: { IsSucess: true, Message: "Refund Details Fetched", response },
    };
  } catch (error) {
    console.log({ error });
    return {
      status: 500,
      result: { IsSucess: false, Message: error.message, Error: true },
    };
  }
};
