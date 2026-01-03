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
  "RAC":60,
  "RWL":60,
  "WL":60,
  PQWL:62,
  "EV":240,
  "FC":200
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
    const auth = Authentication.CredentialType==="LIVE"?Config.LIVE.IRCTC_AUTH:Config.TEST.IRCTC_AUTH;
    let url = `${
      Config[Authentication?.CredentialType ?? "TEST"].IRCTC_BASE_URL
    }/eticketing/webservices/tatktservices/cancel/${reservationId}/${txnId}/${passengerToken}`;

    const existingRailCancellation = await RailCancellation.findOne({
      reservationId,
      passengerToken,
    });
    if (existingRailCancellation)
      return {
        IsSucess: true,
        Message: "Cancellation Request Already Exists",
        Result: existingRailCancellation,
      };
    const { data: response } = await axios.get(url, {
      headers: { Authorization: auth },
    });
    console.log({ response });
    if (String(response.success) !== "true") {
      return {
        IsSucess: false,
        Message: response.message || "Cancellation Request Failed",
        Result: response,
      };
    }
    
    const booking = await bookingDetailsRail.findOne({ reservationId });
    const railCancellation = await RailCancellation.create({
      ...response,
      userId: user._id,
      companyId: company._id,
      agencyId: booking.AgencyId,
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

    const tokenList = passengerToken.split("");
    const filterRailPaxList=booking.psgnDtlList.filter((element)=>element.currentStatus!='CAN')
    const isFullCancelled =
      passengerToken === "YYYYYY" ||
      tokenList.filter((t) => t === "Y").length === filterRailPaxList.length;

    const bookingStatus = isFullCancelled ? "CANCELLED" : "PARTIALLY CANCELLED";

    booking.bookingStatus = bookingStatus;
    booking.psgnDtlList = booking.psgnDtlList.map((passenger, idx) => {
      if (tokenList[idx] == "Y") {
        return {
          ...passenger,
          currentStatus: "CAN",
          cancellationId: response?.cancellationId,
          cancelTime: new Date().toISOString(),
          isRefundOTPVerified: false,
        };
      }
      return passenger;
    });
    

    // const isFullCancelled =
    //   passengerToken === "YYYYYY" ||
    //   tokenList.filter((t) => t === "Y").length === booking.psgnDtlList.length;
    // if (isFullCancelled) 
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
  //     if(timeDifference< 1/2){

  //     }

  //   // ? chart prepared
  //  else if (timeDifference < 4)
  //     return {
  //       error:
  //         "Cannot Cancel This Booking, Cause Chart Has Been Prepared For This Booking, Please Follow TDR Instructions For Cancelling This Booking",
  //     };

    const passengerTokenList = passengerToken.split("");
    const cancelJourneyFor = passengerList.filter(
      (passenger, idx) => passengerTokenList[idx] === "Y"
    );
    const result = cancelJourneyFor.map(({ passengerNetFare, currentStatus}) =>
      calculateCharges({
         journeyClass,
        timeDifference,
        netFare: passengerNetFare,
        bookingStatus:currentStatus
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
    const auth = Authentication.CredentialType==="LIVE"?Config.LIVE.IRCTC_AUTH:Config.TEST.IRCTC_AUTH;

    const { data: response } = await axios.get(url, {
      headers: { Authorization: auth },
    });
    if (response.messageInfo?.toLowerCase?.() !== "otp verified")
      return { error: response };
    await RailCancellation.findOneAndUpdate(
      { cancellationId },
      { isRefundOTPVerified: true }
    );

   await bookingDetailsRail.findOneAndUpdate(
    { pnrNumber: pnr, "psgnDtlList.cancellationId":cancellationId  }, 
    { 
      $set: {
        "psgnDtlList.$.isRefundOTPVerified": true, 
      }
    }, 
    { new: true }
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

    const auth = Authentication.CredentialType==="LIVE"?Config.LIVE.IRCTC_AUTH:Config.TEST.IRCTC_AUTH;
    const { data: response } = await axios.get(url, {
      headers: { Authorization: auth },
    });
    return { result: response };
  } catch (error) {
    return { error: error?.response?.data || error.message };
  }
};

function calculateCharges({ journeyClass, netFare, timeDifference, bookingStatus }) {
  const chargesBefore48Hours = {
    "1A": 240,
    EC: 240,
    CC: 180,
    "2A": 200,
    "3A": 180,
    "3E": 180,
    SL: 120,
    "2S": 60,
    RAC: 60,
    RLWL: 60,
    WL: 60,
    PQWL:62,
    EV:240,
    FC:200
  };

  console.log({ journeyClass, netFare, timeDifference, bookingStatus });

  const gstRate = Config?.CancellationGSTRate || 5;
  const minimumCharges =
    chargesBefore48Hours[journeyClass] +
    chargesBefore48Hours[journeyClass] * (gstRate / 100);

  let cancellationCharges = minimumCharges;

  if (["WL", "RLWL", "RAC","PQWL"].includes(bookingStatus)&&timeDifference > 1/2) {
    cancellationCharges =
      chargesBefore48Hours[bookingStatus] +
      chargesBefore48Hours[bookingStatus] * (gstRate / 100);
    // console.log(cancellationCharges, "Cancellation Charges for WL/RAC/RLWL");
  } 
  else if (timeDifference > 48) {
    cancellationCharges = minimumCharges;
  } else if (timeDifference > 12) {
    cancellationCharges = Math.max(minimumCharges, netFare * 0.25);
  } else if (timeDifference > 4) {
    cancellationCharges = Math.max(minimumCharges, netFare * 0.5);
  }
  else if(timeDifference < 4&&!["WL", "RLWL", "RAC","PQWL"].includes(bookingStatus)) return {
    error:
      "Cannot Cancel This Booking, Cause Chart Has Been Prepared For This Booking, Please Follow TDR Instructions For Cancelling This Booking",
  };
  else if(timeDifference < 1/2&&["WL", "RLWL", "RAC"].includes(bookingStatus))return{
    error:"No refund shall be granted for RAC/RLWL/WL or wait-listed tickets within thirty minutes of the scheduled departure"
  }


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
