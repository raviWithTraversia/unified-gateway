const { default: axios } = require("axios");
const { Config } = require("../../configs/config");
const TDRRequest = require("../../models/tdr-request.model");

module.exports.fetchTxnHistory = async (request) => {
  try {
    const { Authentication, userId = "WKAFL00000", txnId } = request;
    let url = `${
      Config[Authentication?.CredentialType ?? "TEST"].IRCTC_BASE_URL
    }/eticketing/webservices/tabkhservices/historySearchByTxnId/${userId}/${txnId}`;
    const auth = "Basic V0tBRkwwMDAwMDpUZXN0aW5nMQ==";

    const { data: response } = await axios.get(url, {
      headers: { Authorization: auth },
    });
    return { result: response };
  } catch (error) {
    return { error: error.message, result: error?.response?.data ?? "" };
  }
};
module.exports.fileTDR = async (request) => {
  try {
    const { Authentication, txnId, passengerToken, reasonIndex } = request;
    let url = `${
      Config[Authentication?.CredentialType ?? "TEST"].IRCTC_BASE_URL
    }/eticketing/webservices/tatktservices/fileTDR/${txnId}/${passengerToken}/${reasonIndex}`;
    const auth = "Basic V0tBRkwwMDAwMDpUZXN0aW5nMQ==";

    const tdrRequest = await TDRRequest.create({
      userId: Authentication.UserId,
      companyId: Authentication.CompanyId,
      agencyId: Authentication.Agency,
      txnId,
      passengerToken,
      reasonIndex,
      irctcUserId: "WKAFL00000",
    });
    const { data: response } = await axios.get(url, {
      headers: { Authorization: auth },
    });
    tdrRequest.irctcTdrResponse = response;
    if (response.error) {
      tdrRequest.status = "Failed";
      tdrRequest.failReason = response.error;
    }
    await tdrRequest.save();
    return { result: tdrRequest };
  } catch (error) {
    return { error: error.message, result: error?.response?.data ?? "" };
  }
};
