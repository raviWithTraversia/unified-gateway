const { default: axios } = require("axios");
const Company = require("../../models/Company");
const User = require("../../models/User");
const RailCancellation = require("../../models/Irctc/rail-cancellation");

module.exports.cancelRailBooking = async function (request) {
  try {
    const {
      reservationId,
      txnId,
      passengerToken,
      Authentication,
      user,
      company,
      remark,
      staff,
    } = request;
    const auth = "Basic V0tBRkwwMDAwMDpUZXN0aW5nMQ==";
    let url = `https://stagews.irctc.co.in/eticketing/webservices/tatktservices/cancel/${reservationId}/${txnId}/${passengerToken}`;
    if (Authentication?.CredentialType === "LIVE")
      url = `https://stagews.irctc.co.in/eticketing/webservices/tatktservices/cancel/${reservationId}/${txnId}/${passengerToken}`;

    const requestExists = await RailCancellation.exists({ reservationId });
    if (requestExists)
      return {
        IsSucess: false,
        message: "request already exists",
      };
    const { data: response } = await axios.get(url, {
      headers: { Authorization: auth },
    });
    console.log({ response });
    const railCancellation = await RailCancellation.create({
      ...response,
      userId: user._id,
      companyId: company._id,
      reservationId,
      passengerToken,
      txnId,
      isSuccess: !!response.success,
      travelInsuranceRefundAmount: Number(response.travelinsuranceRefundAmount),
      amountCollected: Number(response.amountCollected),
      cashDeducted: Number(response.cashDeducted),
      cancelledDate: Date(response.cancelledDate),
      gstFlag: !!response.gstFlag,
      timeStamp: Date(response.timeStamp),
      noOfPsgn: Number(response.noOfPsgn),
      remark: remark ?? "",
      staff: staff ?? "",
    });
    return {
      IsSucess: true,
      message: "cancellation requested",
      cancellationDetails: railCancellation,
    };
  } catch (error) {
    console.log({ error });
    return {
      IsSucess: false,
      message: "something went wrong",
      error: error.message,
    };
  }
};

module.exports.validatePsgnToken = (token) => {
  console.log({ token });
  if (token?.length !== 6)
    return { error: "invalid length, token must be 6 character long" };
  const validTokens = token
    ?.split("")
    ?.filter?.((item) => ["Y", "N"].includes(item));
  console.log({ validTokens });
  if (validTokens?.length !== 6)
    return {
      error: "invalid passenger token, only Y and N characters allowed",
    };
  return { isValid: true };
};
