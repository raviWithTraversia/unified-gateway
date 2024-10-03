const { default: axios } = require("axios");
const Company = require("../../models/Company");
const User = require("../../models/User");

module.exports.cancelRailBooking = async function (request) {
  try {
    const { reservationId, txnId, passengerToken, Authentication } = request;
    const auth = "Basic V0tBRkwwMDAwMDpUZXN0aW5nMQ==";
    let url = `https://stagews.irctc.co.in/eticketing/webservices/tatktservices/cancel/${reservationId}/${txnId}/${passengerToken}`;
    if (Authentication?.CredentialType === "LIVE")
      url = `https://stagews.irctc.co.in/eticketing/webservices/tatktservices/cancel/${reservationId}/${txnId}/${passengerToken}`;

    const { data: response } = await axios.get(url, {
      headers: { Authorization: auth },
    });
    return { IsSucess: true, message: "cancellation requested", response };
  } catch (error) {
    return {
      IsSucess: false,
      message: "something went wrong",
      error: error.message,
    };
  }
};

module.exports.validatePsgnToken = (token) => {
  if (token?.length !== 6)
    return { error: "invalid length, token must be 6 character long" };
  const validTokens = token?.filter?.((item) => ["Y", "N"].includes(item));
  if (validTokens?.length !== 6)
    return {
      error: "invalid passenger token, only Y and N characters allowed",
    };
  return { isValid: true };
};
