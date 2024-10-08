const { default: axios } = require("axios");
const Company = require("../../models/Company");
const User = require("../../models/User");
const RailCancellation = require("../../models/Irctc/rail-cancellation");
const moment = require("moment");

const chargesBefore48Hours = {
  "1A": 240,
  EC: 240,
  "2A": 200,
  "3A": 180,
  "3E": 180,
  SL: 120,
  "2S": 60,
  // CC: 0,
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
        message:
          "Request Already Exists With Same Reservation Id And Passenger Token",
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
      message: "Cancellation Requested",
      cancellationDetails: railCancellation,
    };
  } catch (error) {
    console.log({ error });
    return {
      IsSucess: false,
      message: "Something Went Wrong",
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

module.exports.calculateCancellationCharges = ({ passengerToken, booking }) => {
  try {
    const now = moment();
    const boardingDate = moment(booking.boardingDate, "DD-MM-YYYY hh:mm:ss");
    const timeDifference = boardingDate.diff(now, "h");

    console.log({ timeDifference, now, boardingDate: booking.boardingDate });

    const { journeyClass, psgnDtlList: passengerList } = booking;
    const passengerTokenList = passengerToken.split("");
    const cancelJourneyFor = passengerList.filter(
      (p, idx) => passengerTokenList[idx] === "Y"
    );
    const netFare = cancelJourneyFor.reduce(
      (acc, passenger) => acc + passenger.passengerNetFare,
      0
    );
    let cancellationCharges = netFare;
    if (!chargesBefore48Hours[journeyClass])
      return { error: `Invalid Journey class ${journeyClass}` };

    const minimumCharge =
      chargesBefore48Hours[journeyClass] * cancelJourneyFor.length;
    //  ? before 48 hours of departure
    if (timeDifference > 48) cancellationCharges = minimumCharge;
    // ? 48 hours - 12 hours of departure
    else if (timeDifference > 12)
      cancellationCharges = Math.max(minimumCharge, netFare * 0.25);
    // ? 12 hours - 4 hours of departure
    else if (timeDifference > 4)
      cancellationCharges = Math.max(minimumCharge, netFare * 0.5);
    // ? chart prepared
    else
      return {
        error:
          "Cannot Cancel This Booking, Cause Chart Has Been Prepared, Please Follow TDR Instructions For Cancelling This Booking",
      };
    return { cancellationCharges };
  } catch (error) {
    console.log({ error });
    return { error: "Something Went Wrong, While Cancelling Your Ticket" };
  }
};

// const now = moment();
// const boardingDate = moment("07-11-2024 14:05:00.0 IST", "DD-MM-YYYY hh:mm:ss");
// const timeDifference = boardingDate.diff(now, "h");

// console.log({
//   now: now.toString(),
//   boardingDate: boardingDate.toString(),
//   timeDifference,
// });
