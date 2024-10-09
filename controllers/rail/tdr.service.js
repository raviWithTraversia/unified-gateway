const { default: axios } = require("axios");

module.exports.fetchTxnHistory = async (request) => {
  try {
  } catch (error) {}
};
module.exports.fileTDR = async (request) => {
  try {
    const { Authentication, userId, txnId } = request;
    let url = `https://www.ws.irctc.co.in/eticketing/webservices/tabkhservices/historySearchByTxnId/${userId}/${txnId}`;
    if (Authentication.CredentialType === "LIVE")
      url = `https://www.ws.irctc.co.in/eticketing/webservices/tabkhservices/historySearchByTxnId/${userId}/${txnId}`;
    const { data: response } = await axios.get(url);
    return { result: response };
  } catch (error) {
    console.log({ error });
    return { error: error.message, result: error?.response?.data };
  }
};
