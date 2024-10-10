const { default: axios } = require("axios");
const { Config } = require("../../configs/config");

module.exports.fetchTxnHistory = async (request) => {
  try {
    const { Authentication, userId = "WKAFL00000", txnId } = request;
    let url = `${
      Config[Authentication?.CredentialType ?? "TEST"].IRCTC_BASE_URL
    }/eticketing/webservices/tabkhservices/historySearchByTxnId/${userId}/${txnId}`;
    const { data: response } = await axios.get(url);
    return { result: response };
  } catch (error) {
    return { error: error.message, result: error?.response?.data ?? "" };
  }
};
module.exports.fileTDR = async (request) => {
  try {
  } catch (error) {
    console.log({ error });
    return { error: error.message, result: error?.response?.data };
  }
};
