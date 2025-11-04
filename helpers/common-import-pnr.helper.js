const { default: axios } = require("axios");
const { v4: uuidv4 } = require("uuid");
const { Config } = require("../configs/config");
const { convertItineraryForKafila } = require("./common-search.helper");
const user = require("../models/User");
const {
  getApplyAllCommercial,
} = require("../controllers/flight/flight.commercial");
const { getVendorList } = require("./credentials");
const { saveLogInFile } = require("../utils/save-log");

async function importPNRHelper(request) {
  try {
    const { pnr, provider, Authentication } = request;
    if (!pnr || !provider || !Authentication) {
      throw new Error(
        "Invalid Request: pnr, provider and Authentication are required"
      );
    }

    const importPNRRequest = {
      typeOfTrip: "ONEWAY",
      travelType: "DOM",
      credentialType: Authentication?.CredentialType,
      // systemEntity: "x",
      // systemName: "x",
      // corpCode: "x",
      // requestorCode: "x",
      // empCode: "x",
      traceId: Authentication?.TraceId || uuidv4(),
      companyId: Authentication?.CompanyId,
      recLoc: {
        type: "GDS",
        pnr,
      },
      provider,
      vendorList: getVendorList(),
    };
    saveLogInFile("import-pnr-request.json", importPNRRequest);
    const url =
      Config[Authentication.CredentialType ?? "TEST"].additionalFlightsBaseURL +
      `/postbook/v2/RetrievePnr`;
    // `/pnr/importPNR`;
    // console.log({ importURL: url });

    const pnrResponse = await axios.post(url, importPNRRequest);
    const result = pnrResponse.data;
    saveLogInFile("pnr-response.json", result);
    const journey = result.data?.journey?.[0];
    const itinerary = journey?.itinerary?.[0];
    const isInternationalTrip = itinerary.airSegments.some(
      (segment) =>
        segment.arrival?.countryCode != segment.departure?.countryCode
    );

    let convertedItinerary = convertItineraryForKafila({
      itinerary,
      idx: 1,
      response: result.data,
      uniqueKey: result.data.uniqueKey,
    });

    try {
      convertedItinerary = await getApplyAllCommercial(
        Authentication,
        isInternationalTrip ? "International" : "Domestic",
        [convertedItinerary]
      );

      if (convertedItinerary?.length)
        convertedItinerary = convertedItinerary[0];
    } catch (error) {
      console.log({ errorApplyingCommercial: error });
      return {
        error: `Error Applying Commercials: ${error.message}`,
      };
    }
    const segmentGroup = groupSegments(itinerary.airSegments);
    const Passengers = convertPaxDetailsForKafila(
      journey.travellerDetails,
      segmentGroup
    );
    let iternaryObj = null;
    const userFindTmc = await user
      .findById(Authentication.UserId)
      .populate("company_ID");
    userFindTmc?.company_ID?.type == "TMC"
      ? (iternaryObj = convertedItinerary?.response[0])
      : (iternaryObj = convertedItinerary);

    return {
      result: {
        Status: journey?.bookingStatus || "failed",
        PNR:
          journey?.recLoc?.find?.((details) => details?.type === "GDS")?.pnr ??
          null,
        Itinerary: iternaryObj,
        Passengers,
        // data: result.data,
      },
    };
  } catch (error) {
    console.dir({ errRes: error.response?.data }, { depth: null });
    console.log({ errorInImportPNRHelper: error });
    return {
      error: {
        message:
          error.response?.data?.reason ||
          error.response?.data?.message ||
          error.message,
      },
    };
  }
}

function groupSegments(segments) {
  const group = {};
  segments.forEach((segment) => {
    if (!group[segment.group]) group[segment.group] = [];
    group[segment.group].push(segment);
  });
  return group;
}

function convertPaxDetailsForKafila(paxList, segmentGroup) {
  const paxDetails = paxList.map((pax, idx) => {
    const convertedPax = {
      PaxType: pax.type,
      passengarSerialNo: idx + 1,
      Title: pax.title ?? "",
      FName: pax.firstName,
      LName: pax.lastName ?? "",
      Gender: pax.gender ?? "",
      Dob: pax.dob ?? "",
      Meal: (pax.mealPreferences ?? []).map((meal) => ({
        SsrDesc: meal?.name || "",
        SsrCode: meal?.code || "",
        Price: meal?.amount || 0,
        Currency: meal?.currency || "",
        Paid: meal?.paid || false,
        SsrDesc: meal?.desc || "",
        key: meal?.key || "" || "",
        Src: meal?.origin || "",
        Des: meal?.destination || "",
        FCode: meal?.airlineCode || "",
        FNo: meal?.flightNumber || "",
        Trip: meal?.wayType || 0,
      })),
      Baggage: (pax.baggagePreferences ?? []).map((baggage) => ({
        SsrDesc: baggage?.name || "",
        SsrCode: baggage?.code || "",
        Price: baggage?.amount || 0,
        Currency: baggage?.currency || "",
        Paid: baggage?.paid || false,
        SsrDesc: baggage?.desc || "",
        key: baggage?.key || "" || "",
        Src: baggage?.origin || "",
        Des: baggage?.destination || "",
        FCode: baggage?.airlineCode || "",
        FNo: baggage?.flightNumber || "",
        Trip: baggage?.wayType || 0,
      })),
      FastForward: (pax.ffwdPreferences ?? []).map((fastForward) => ({
        SsrDesc: fastForward?.name || "",
        SsrCode: fastForward?.code || "",
        Price: fastForward?.amount || 0,
        Currency: fastForward?.currency || "",
        Paid: fastForward?.paid || false,
        SsrDesc: fastForward?.desc || "",
        key: fastForward?.key || "" || "",
        Src: fastForward?.origin || "",
        Des: fastForward?.destination || "",
        FCode: fastForward?.airlineCode || "",
        FNo: fastForward?.flightNumber || "",
        Trip: fastForward?.wayType || 0,
      })),
      Seat: (pax?.seatPreferences ?? []).map((seat) => ({
        SeatCode: seat.code,
        TotalPrice: seat?.amount || 0,
        Currency: seat?.currency || "",
        Paid: seat?.paid || false,
        SsrDesc: seat?.desc || "",
        OI: seat?.key || "",
        Src: seat?.origin || "",
        Des: seat?.destination || "",
        FCode: seat?.airlineCode || "",
        FNo: seat?.flightNumber || "",
        Trip: seat?.wayType || 0,
      })),
      Optional: {
        TicketDetails: (pax?.eTicket ?? []).map((ticket, idx) => ({
          TicketNumber: ticket.eTicketNumber,
          SRC: segmentGroup?.[idx.toString()]?.[0]?.departure?.code ?? "",
          DES: segmentGroup?.[idx.toString()]?.at?.(-1)?.arrival?.code ?? "",
        })),
        EMD: (pax?.emd ?? []).map((emd, idx) => ({
          EMDNumber: emd.EMDNumber ?? "",
          IssuedDate: emd.IssueDate ?? "",
          Amount: emd.amount ?? 0,
          Currency: emd.currency ?? "",
          Type: emd.type ?? "",
          Origin: emd.origin ?? "",
          Destination: emd.destination ?? "",
          Status: emd.status ?? "",
        })),
        PassportNo: pax?.passportDetails?.number ?? "",
        PassportExpiryDate: pax?.passportDetails?.expiry ?? "",
        FrequentFlyerNo: pax?.frequentFlyer?.ffNumber ?? "",
        Nationality: pax?.passportDetails?.issuingCountry ?? "",
        ResidentCountry: pax?.passportDetails?.issuingCountry ?? "",
      },
    };
    return convertedPax;
  });
  return paxDetails;
}

module.exports = {
  importPNRHelper,
  convertPaxDetailsForKafila,
};
