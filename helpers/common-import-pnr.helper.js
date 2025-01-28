const { default: axios } = require("axios");
const { v4: uuidv4 } = require("uuid");
const { Config } = require("../configs/config");
const { convertItineraryForKafila } = require("./common-search.helper");

async function importPNRHelper(request) {
  try {
    const { pnr, provider } = request;

    const importPNRRequest = {
      typeOfTrip: "ONEWAY",
      credentialType: "TEST",
      travelType: "DOM",
      systemEntity: "x",
      systemName: "x",
      corpCode: "x",
      requestorCode: "x",
      empCode: "x",
      traceId: uuidv4(),
      journey: [
        {
          provider: provider,
          origin: "",
          destination: "",
          uid: uuidv4(),
          journeyKey: uuidv4(),
          itinerary: [
            {
              recordLocator: pnr,
            },
          ],
        },
      ],
    };
    const url = `${Config.TEST.additionalFlightsBaseURL}/pnr/importPNR`;
    console.log({ importURL: url });
    const pnrResponse = await axios.post(url, importPNRRequest);
    const result = pnrResponse.data;
    const journey = result.data.journey[0];
    const itinerary = journey.itinerary[0];
    console.log({ itinerary });
    const convertedItinerary = convertItineraryForKafila({
      itinerary,
      idx: 1,
      response: result.data,
      uniqueKey: result.data.uniqueKey,
    });
    const segmentGroup = groupSegments(itinerary.airSegments);
    const Passengers = convertPaxDetailsForKafila(
      journey.travellerDetails,
      segmentGroup
    );
    return {
      result: {
        Status: journey?.status?.pnrStatus || "failed",
        PNR:
          journey?.recLocInfo?.find?.((details) => details?.type === "GDS")
            ?.pnr ?? null,
        Itinerary: convertedItinerary,
        Passengers,
        // data: result.data,
      },
    };
  } catch (error) {
    console.dir({ errRes: error.response?.data }, { depth: null });
    console.log({ errorInImportPNRHelper: error });
    return { error: { message: error.message } };
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
