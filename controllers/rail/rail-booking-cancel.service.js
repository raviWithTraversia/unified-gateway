const { default: axios } = require("axios");
const Company = require("../../models/Company");
const User = require("../../models/User");
const RailCancellation = require("../../models/Irctc/rail-cancellation");
const moment = require("moment");
const { Config } = require("../../configs/config");
const bookingDetailsRail = require("../../models/Irctc/bookingDetailsRail");

const chargesBefore48Hours = {
  "1A": 240,
  EC: 240,
  CC: 240,
  "2A": 200,
  "3A": 180,
  "3E": 180,
  SL: 120,
  "2S": 60,
};

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

    const requestExists = await RailCancellation.exists({
      reservationId,
      passengerToken,
    });
    if (requestExists)
      return {
        IsSucess: false,
        Message:
          "Request Already Exists With Same Reservation Id And Passenger Token",
      };
    const { data: response } = await axios.get(url, {
      headers: { Authorization: auth },
    });
    console.log({ response });
    if (String(response.success) !== "true") {
      return {
        IsSucess: false,
        Message: response.message,
        Result: response,
      };
    }

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

    const booking = await bookingDetailsRail.findOne({ reservationId });
    const tokenList = passengerToken.split("");
    booking.psgnDtlList = booking.psgnDtlList.map((passenger, idx) => ({
      ...passenger,
      ...(tokenList[idx] === "Y" && { currentStatus: "CAN" }),
    }));

    const isFullCancelled =
      passengerToken === "YYYYYY" ||
      tokenList.filter((t) => t === "Y").length === booking.psgnDtlList.length;
    if (isFullCancelled) booking.bookingStatus = "CANCELED";
    await booking.save();
    return {
      IsSucess: true,
      Message: "Cancellation Requested",
      Result: railCancellation,
    };
  } catch (error) {
    console.log({ error });
    return {
      IsSucess: false,
      Message: "Something Went Wrong",
      Error: error.message,
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

module.exports.calculateCancellationCharges = ({ passengerToken, booking }) => {
  try {
    const now = moment();
    const boardingDate = moment(booking.boardingDate, "DD-MM-YYYY hh:mm:ss");
    const timeDifference = boardingDate.diff(now, "h");

    console.log({ timeDifference, now, boardingDate: booking.boardingDate });

    const { journeyClass, psgnDtlList: passengerList } = booking;

    if (!chargesBefore48Hours[journeyClass])
      return {
        error: `Refund Not Allowed For Journey ${journeyClass} Class`,
      };

    // ? chart prepared
    if (timeDifference < 4)
      return {
        error:
          "Cannot Cancel This Booking, Cause Chart Has Been Prepared For This Booking, Please Follow TDR Instructions For Cancelling This Booking",
      };

    const passengerTokenList = passengerToken.split("");
    const cancelJourneyFor = passengerList.filter(
      (passenger, idx) => passengerTokenList[idx] === "Y"
    );
    const result = cancelJourneyFor.map(({ passengerNetFare }) =>
      calculateCharges({
        journeyClass,
        timeDifference,
        netFare: passengerNetFare,
      })
    );
    console.log({ result });
    return {
      result,
    };
  } catch (error) {
    console.log({ error });
    return { error: "Something Went Wrong, While Cancelling Your Booking" };
  }
};

module.exports.verifyOTP = async (request) => {
  try {
    const { Authentication, cancellationId, pnr, otp } = request;
    const requestType = 2; // 2 -> verify OTP , 1 -> resend OTP
    let url = `${
      Config[Authentication?.CredentialType ?? "TEST"].IRCTC_BASE_URL
    }/eticketing/webservices/tatktservices/canOtpAuthentication/${pnr}/${cancellationId}/${requestType}?otpcode=${otp}`;
    const auth = "Basic V0tBRkwwMDAwMDpUZXN0aW5nMQ==";

    const { data: response } = await axios.get(url, {
      headers: { Authorization: auth },
    });
    if (response.messageInfo?.toLowerCase?.() !== "otp verified")
      return { error: response };
    await RailCancellation.findOneAndUpdate(
      { cancellationId },
      { isRefundOTPVerified: true }
    );
    return { result: response };
  } catch (error) {
    console.log({ error });
    return { error: error?.response || error.message };
  }
};

module.exports.resendOTP = async (request) => {
  try {
    const { Authentication, cancellationId, pnr } = request;
    const requestType = 1; // 2 -> verify OTP , 1 -> resend OTP
    let url = `${
      Config[Authentication?.CredentialType ?? "TEST"].IRCTC_BASE_URL
    }/eticketing/webservices/tatktservices/canOtpAuthentication/${pnr}/${cancellationId}/${requestType}`;

    const auth = "Basic V0tBRkwwMDAwMDpUZXN0aW5nMQ==";
    const { data: response } = await axios.get(url, {
      headers: { Authorization: auth },
    });
    return { result: response };
  } catch (error) {
    return { error: error?.response?.data || error.message };
  }
};

function calculateCharges({ journeyClass, netFare, timeDifference }) {
  console.log({ journeyClass, netFare, timeDifference });
  const minimumCharges =
    chargesBefore48Hours[journeyClass] +
    chargesBefore48Hours[journeyClass] *
      ((Config?.CancellationGSTRate || 5) / 100);
  let cancellationCharges = minimumCharges;
  if (timeDifference > 48) cancellationCharges = minimumCharges;
  // ? 48 hours - 12 hours of departure
  else if (timeDifference > 12)
    cancellationCharges = Math.max(minimumCharges, netFare * 0.25);
  // ? 12 hours - 4 hours of departure
  else if (timeDifference > 4)
    cancellationCharges = Math.max(minimumCharges, netFare * 0.5);

  return { cancellationCharges };
}
// const now = moment();
// const boardingDate = moment("07-11-2024 14:05:00.0 IST", "DD-MM-YYYY hh:mm:ss");
// const timeDifference = boardingDate.diff(now, "h");

// console.log({
//   now: now.toString(),
//   boardingDate: boardingDate.toString(),
//   timeDifference,
// });
