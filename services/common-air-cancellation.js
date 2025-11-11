const { default: axios } = require("axios");
const { Config } = require("../configs/config");
const {
  convertBookingResponse,
} = require("../helpers/common-air-booking.helper");
const {
  createAirCancellationRequestBodyForCommonAPI,
  createAirCancellationChargeRequestBodyForCommonAPI,
} = require("../helpers/common-air-cancellation.helper");
const { saveLogInFile } = require("../utils/save-log");
const { getVendorList } = require("../helpers/credentials");

module.exports.commonAirBookingCancellation = async function (request) {
  try {
    let result = null;
    if (request.cancelType !== "ALL") {
      const importPNRRequest = {
        typeOfTrip: "ONEWAY",
        travelType: "DOM",
        credentialType: request.Authentication?.CredentialType,
        traceId: request.Authentication?.TraceId || uuidv4(),
        companyId: request.Authentication?.CompanyId,
        recLoc: {
          type: "GDS",
          pnr: request.PNR,
        },
        provider: request.Provider,
        vendorList: getVendorList(request.Authentication.CredentialType),
      };
      saveLogInFile("import-pnr-request.json", importPNRRequest);
      const importPnrUrl =
        Config[request.Authentication.CredentialType ?? "TEST"]
          .additionalFlightsBaseURL + `/postbook/v2/RetrievePnr`;

      const pnrResponse = await axios.post(importPnrUrl, importPNRRequest);
      result = pnrResponse.data?.data?.journey?.[0];
    }

    const { requestBody, error } = createAirCancellationRequestBodyForCommonAPI(
      request,
      result
    );
    if (error) return { error };
    saveLogInFile("cancellation-request.json", requestBody);
    const url =
      Config[request?.Authentication?.CredentialType ?? "TEST"]
        .additionalFlightsBaseURL + "/postbook/v2/CancelPnr";
    // .additionalFlightsBaseURL + "/cancel/cancelPNR";

    const { data: response } = await axios.post(url, requestBody);
    saveLogInFile("cancellation-response.json", response);

    if (response?.errors?.length) return { error: response.errors[0] };
    return { result: response?.data, requestBody };
  } catch (error) {
    saveLogInFile("cancellation-error.json", error?.response?.data);
    console.dir({ response: error?.response?.data }, { depth: null });
    return { error };
    // throw new Error(error.message);
  }
};

module.exports.commonAirBookingCancellationCharge = async function (
  request,
  msg
) {
  const requestBody = await createAirCancellationChargeRequestBodyForCommonAPI(
    request
  );
  // if (error) return { error };
  saveLogInFile("cancellation-charge-request.json", requestBody);
  const url =
    Config[request?.Authentication?.CredentialType ?? "TEST"]
      .additionalFlightsBaseURL + "/postbook/v2/AirPenalty";
  // .additionalFlightsBaseURL + "/pnr/airPenalty";

  const { data: response } = await axios.post(url, requestBody);
  saveLogInFile("cancellation-charge-response.json", response);

  if (response?.errors?.length) return { error: response.errors[0] };
  // return { result: response?.data };
  return await convertResponseToAirCancellationCharge(
    request,
    response?.data?.journey,
    msg
  );
};

// function convertResponseToAirCancellationCharge(response,request){

// }

function convertResponseToAirCancellationCharge(input, journey, msg) {
  const adults = input.passengarList.filter(
    (elem) => elem.PAX_TYPE === "ADT"
  ).length;
  const childs = input.passengarList.filter(
    (elem) => elem.PAX_TYPE === "CHD"
  ).length;
  const infants = input.passengarList.filter(
    (elem) => elem.PAX_TYPE === "INF"
  ).length;

  const adultFare = calculateFare(journey, "ADT", adults, input.Itinerary);
  const childFare = calculateFare(journey, "CHD", childs, input.Itinerary);
  const infantFare = calculateFare(journey, "INF", infants, input.Itinerary);

  // You can return any one, or all combined
  return {
    data: {
      Req: {
        P_TYPE: "API",
        R_TYPE: "FLIGHT",
        R_NAME: "CANCEL",
        R_DATA: {
          ACTION: "CANCEL_CHARGE",
          BOOKING_ID: input.providerBookingId,
          CANCEL_TYPE: msg,
          REASON: input.Reason,
          TRACE_ID: input.Itinerary.map((elem) => elem.TraceId)[0],
        },
        AID: "",
        MODULE: "B2B",
        IP: "",
        TOKEN: "",
        ENV: "",
        Version: "",
      },
      Charges: {
        FlightCode: input.Itinerary.flatMap((itinerary) =>
          itinerary.Sectors.map((sector) => sector.AirlineCode)
        )[0],
        Pnr: input.PNR,
        SplitedPnr: null,
        Fare: adultFare.totalFare + childFare.totalFare + infantFare.totalFare,
        AirlineCancellationFee:
          adultFare.airCancelationFee +
          childFare.airCancelationFee +
          infantFare.airCancelationFee,
        AirlineRefund:
          adultFare.refundAmount +
          childFare.refundAmount +
          infantFare.refundAmount,
        ServiceFee:
          adultFare.cancelationServiceFee +
          childFare.cancelationServiceFee +
          infantFare.cancelationServiceFee,
        RefundableAmt:
          adultFare.refundAmount +
          childFare.refundAmount +
          infantFare.refundAmount -
          (adultFare.cancelationServiceFee +
            childFare.cancelationServiceFee +
            infantFare.cancelationServiceFee),
        IsCanceled: false,
        IsError: false,
        Description: null,
        CancelReason: null,
      },
      Error: null,
      Status: null,

      // adultFare,
      // childFare,
      // infantFare,
      // totalRefundAmount: adultFare.refundAmount + childFare.refundAmount + infantFare.refundAmount,
      // totalAirCancellationFee: adultFare.airCancelationFee + childFare.airCancelationFee + infantFare.airCancelationFee,
      // totalFare: adultFare.totalFare + childFare.totalFare + infantFare.totalFare
    },
  };
}

function calculateFare(journey, paxType, paxCount, itinerary) {
  let refundAmount = 0;
  let totalFare = 0;
  let airCancelationFee = 0;
  let cancelationServiceFee = 0;

  if (paxCount > 0) {
    journey.forEach((j) => {
      j.itinerary.forEach((i) => {
        i.priceBreakup.forEach((pb) => {
          if (pb.passengerType === paxType) {
            const paxWiseAmount = pb.baseFare + pb.tax;

            // Extract refund amount safely
            const penalty = pb.airPenalty.find(
              (p) => p.type === "Refund" || p.Ref
            );
            const refund = penalty?.amount ?? pb.airPenalty?.[1]?.Refund ?? 0;

            refundAmount = refund * paxCount;
            totalFare = paxWiseAmount * paxCount;
            airCancelationFee = totalFare - refundAmount;
          }
        });
      });
    });

    itinerary.forEach((i) => {
      i.PriceBreakup.forEach((pb) => {
        // console.log(pb)
        if (pb.PassengerType === paxType) {
          // const paxWiseAmount = pb.baseFare + pb.tax;
          // console.log(pb)
          // Extract refund amount safely
          const serviceFee = pb.CommercialBreakup.find(
            (p) => p.CommercialType === "FixedServiceFees" || p.Ref
          );
          cancelationServiceFee = (serviceFee?.Amount || 50) * paxCount;
        }
      });
    });
  }

  return { refundAmount, airCancelationFee, totalFare, cancelationServiceFee };
}
