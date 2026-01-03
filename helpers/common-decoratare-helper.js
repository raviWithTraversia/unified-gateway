
const {commonProviderMethodDate}=require('../controllers/commonFunctions/common.function')

const commonFunctionDecorator = (body) => {

    const journey = body.journey[0];
    const itinerary = journey.itinerary[0];
    const gst = body.gstDetails
    const travellers = journey.travellerDetails;

    const root = {};
    root.SearchRequest = {};

    // ----------------------------------------------------
    //  SEGMENT GROUPING
    // ----------------------------------------------------

  
    root.SearchRequest.Authentication = makeAuthentication(body.authentication);

    root.SearchRequest.Segments = createAirBookingRequestBodyForCommonAPI(itinerary);
    const segmentGroups = {};



    let typeOfTrip = body.typeOfTrip;
    let travelType = body.travelType === "DOM" ? "Domestic" : "International";

    root.paymentMethodType = "Wallet";

    const paxDetails = { ADT: 0, CHD: 0, INF: 0 };

    itinerary.priceBreakup.forEach(p => {
        paxDetails[p.passengerType] = p.noOfPassenger;
    });

    root.SearchRequest.PaxDetail = {
        Adults: paxDetails.ADT,
        Child: paxDetails.CHD,
        Infants: paxDetails.INF,
        Youths: 0
    };

    // ----------------------------------------------------
    //  OTHER MAIN FIELDS
    // ----------------------------------------------------
    root.SearchRequest.TypeOfTrip = typeOfTrip;
    root.SearchRequest.Flexi = 0;
    root.SearchRequest.Direct = 3;
    root.SearchRequest.ClassOfService = itinerary?.airSegments?.[0]?.cabinClass || "";
    root.SearchRequest.Airlines = [];
    root.SearchRequest.TravelType = travelType;
    root.SearchRequest.FareFamily = [];
    root.SearchRequest.RefundableOnly = false;

    // ----------------------------------------------------
    // AUTHENTICATION (from body)
    // ----------------------------------------------------

    root.PassengerPreferences = {
        GstData: {
            gstNumber: gst.gstNumber || "",
            gstName: gst.companyName || "",
            gstmobile: gst.workPhone || "",
            gstEmail: gst.emailAddress || "",
            gstAddress: gst.addressLine1 || "",
            GSTState: gst.provinceState || "",
            GSTPinCode: gst.postalCode || "",
            isAgentGst: false
        },

        // First passenger email/mobile
        PaxEmail: travellers?.[0]?.contactDetails?.email || "",
        PaxMobile: travellers?.[0]?.contactDetails?.mobile || "",

        Passengers: []
    };

    // ---------------------------------------
    // MAP TRAVELLERS TO REQUIRED FORMAT
    // ---------------------------------------
    travellers.forEach((t, index) => {

        const passengerTypeMap = {
            "ADT": "Adult",
            "CHD": "Child",
            "INF": "Infant"
        };

        root.PassengerPreferences.Passengers.push({
            PaxType: t.type,
            passengarType: passengerTypeMap[t.type] || "",
            passengarSerialNo: index + 1,

            Title: t.title || "",
            FName: t.firstName || "",
            LName: t.lastName || "",

            Gender: t.gender === "M" ? "Male" : "Female",
            Dob: t.dob || "",
            viewOnlyIssuedDate: t.passportDetails?.issueDate || "",
            viewOnlyExpiryDate: t.passportDetails?.expiryDate || "",

            Optional: {
                ticketDetails: root.SearchRequest?.Segments.map((ele) => {
                    return {
                        "ticketNumber": "",
                        "src": ele?.Origin,
                        "des": ele?.Destination
                    }

                }), // blank for now

                PassportNo: t.passportDetails?.number || "",
                PassportExpiryDate: `${t.passportDetails?.expiryDate}T18:30:00.000Z` || "",
                PassportIssuedDate: `${t.passportDetails?.issueDate}T18:30:00.000Z` || "",
                FrequentFlyerNo: "",
                Nationality: t.nationality || "",
                ResidentCountry: t.contactDetails?.countryCode || "IN",
                invalidPassportExpiryDate: false,

            },


            Meal: (t.mealPreferences || []).map(m => ({
                Trip: m.wayType ?? 0,
                FCode: m.airlineCode ?? "",
                FNo: m.flightNumber ?? "",
                SsrCode: m.code ?? "",
                SsrDesc: m.desc ?? "",
                Complmnt: m.paid ?? false,
                Currency: m.currency ?? "",
                Price: m.amount ?? 0,
                Src: m.origin ?? "",
                Des: m.destination ?? "",
                SsrFor: "",
                OI: ""
            })),

            Seat: (t.seatPreferences || []).map(s => ({
                FCode: s.airlineCode ?? "",
                FNo: s.flightNumber ?? "",
                FType: "",
                Deck: "",
                Compartemnt: "",
                Group: "",
                SeatCode: s.code ?? "",
                Avlt: true,
                SeatRow: parseInt((s.code || "0").split("-")[0]) || 0,
                Currency: s.currency ?? "INR",
                SsrDesc: "",
                Price: s.amount ?? 0,
                TotalPrice: s.amount ?? 0,
                DDate: "",
                Src: s.origin ?? "",
                Des: s.destination ?? "",
                OI: "",
                Paid: s.paid ?? false
            })),

            Baggage: (t.baggagePreferences || []).map(b => ({
                Trip: b.wayType ?? 0,
                FCode: b.airlineCode ?? "",
                FNo: b.flightNumber ?? "",
                SsrCode: b.code ?? "",
                SsrDesc: b.desc ?? "",
                Complmnt: b.paid ?? false,
                Currency: b.currency ?? "INR",
                Price: b.amount ?? 0,
                rePrice: 0,
                Src: b.origin ?? "",
                Des: b.destination ?? "",
                SsrFor: "Journey",
                OI: b.name ?? ""
            })),


            Special: t.specialPreferences || null,
            FastForward: [],

            status: "",
            totalBaggagePrice: (t.baggagePreferences || []).reduce((a, b) => a + Number(b.amount), 0) || 0,
            totalMealPrice: (t.mealPreferences || []).reduce((a, b) => a + Number(b.amount), 0) || 0,
            totalSeatPrice: (t.seatPreferences || []).reduce((a, b) => a + Number(b.amount), 0) || 0,
            totalFastForwardPrice: 0
        });
    });

    root.ItineraryPriceCheckResponses = makeItineraryPriceCheckResponses(body);

    root.isHoldBooking = false,
        root.paymentGateway = {
            "paymentCharges": 0,
            "paymentMode": ""
        }

    return root;
};

// itinerary-decorator.js
// gdsMapper.js
  
function makeAuthentication(authentication){
    return {
    "CompanyId": authentication.companyId??"6555f84c991eaa63cb171a9f",
    "UserId": authentication.userId??"65cdfd5203e867cfc4153aa9",
    "BookedBy": authentication.bookedBy??"6555f84d991eaa63cb171aa9",
    "CredentialType": authentication.credentialType??"TEST",
    "SalesChannel": authentication.salesChannel??null,
    "TraceId": authentication.traceId,
    "AgencyId": authentication.agencyId
  }
}
// ----------------- Helpers: time, date, sums -----------------
function safeNum(v) { return Number(v || 0); }

function parseToMinutes(timeStr) {
    if (!timeStr) return 0;
    const s = String(timeStr).trim();
    if (s.includes("d") && s.includes("h") && s.includes("m")) {
        const d = parseInt(s.split("d")[0]) || 0;
        const hh = parseInt((s.split("d:")[1] || "").split("h")[0]) || 0;
        const mm = parseInt((s.split("h:")[1] || "").split("m")[0]) || 0;
        return d * 1440 + hh * 60 + mm;
    }
    if (s.includes("h") && s.includes("m")) {
        const hh = parseInt(s.split("h")[0]) || 0;
        const mm = parseInt((s.split("h:")[1] || "").split("m")[0]) || 0;
        return hh * 60 + mm;
    }
    if (s.includes(":")) {
        const [hh, mm] = s.split(":").map(x => parseInt(x) || 0);
        return hh * 60 + mm;
    }
    return parseInt(s) || 0;
}

function minutesToFullFormat(mins) {
    const d = Math.floor(mins / 1440);
    const h = Math.floor((mins % 1440) / 60);
    const m = mins % 60;
    return `${d}d:${String(h).padStart(2, '0')}h:${String(m).padStart(2, '0')}m`;
}
function minutesToHHMM(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// convert dd-mm-yyyy to ISO 'YYYY-MM-DD'
function ddMmYyyyToIso(d) {
    if (!d) return "";
    const parts = String(d).split("-");
    if (parts.length !== 3) return d;
    const [yyyy,mm,dd] = parts;
    return `${yyyy}-${mm}-${dd}`;
}

// format date+time into ISO if possible (accepts dd-mm-yyyy and time like 20:45)
function makeIsoDate(dateStr, timeStr) {
    const dateIso = ddMmYyyyToIso(dateStr);
    if (!dateIso) return "";
    const t = timeStr ? String(timeStr).trim() : "00:00";
    // best-effort: if time already contains T, return
    if (t.includes("T")) return t;
    // return full timestamp
    return `${dateIso}T${t}:00`;
}

// small sum helper for arrays of objects with 'amount' or 'price' fields
function sum(arr) {
    if (!Array.isArray(arr)) return 0;
    return arr.reduce((s, it) => {
        if (!it) return s;
        const v = Number(it.amount ?? it.price ?? it.value ?? 0);
        return s + (isNaN(v) ? 0 : v);
    }, 0);
}

// simple airline mapping (extendable)
const AIRLINE_MAP = {
    "UL": "SriLankan Airlines",
    "AI": "Air India",
    "EK": "Emirates",
    "QR": "Qatar Airways",
    "SG": "SpiceJet",
    // add more as needed
};

// ----------------- Core decorators / builders -----------------

function buildPriceBreakupEntries(priceBreakupInput, itiHostTokens) {
    // Ensure ADT/CHD/INF order and robust fields
    const map = {};
    (priceBreakupInput || []).forEach(pb => {
        const k = String(pb.passengerType || "").toUpperCase();
        map[k] = pb;
    });

    const makeItem = (pb) => {
        if (!pb) return {};
        return {
            PassengerType: pb.passengerType || "",
            NoOfPassenger: safeNum(pb.noOfPassenger),
            Tax: safeNum(pb.tax),
            BaseFare: safeNum(pb.baseFare),
            TaxBreakup: (pb.taxBreakup || []).map(t => ({ TaxType: t.taxType || "", Amount: safeNum(t.amount) })),
            // Per user request: do NOT compute CommercialBreakup — keep empty array
            CommercialBreakup: [],
            AirPenalty: pb.airPenalty || [],
            AgentMarkupBreakup: { BookingFee: 0, Basic: 0, Tax: 0 },
            key: pb.key || null,
            OI: [
                { FAT: null, FSK: (itiHostTokens && itiHostTokens[0]) ? String(itiHostTokens[0]) : "" }
            ]
        };
    };

    return [
        makeItem(map["ADT"] || map["ADT "] || {}),
        makeItem(map["CHD"] || {}),
        makeItem(map["INF"] || {})
    ];
}

// compute layover between two segments (in minutes) given their arrival & next departure ISO
function layoverMinutes(arrISO, nextDepISO) {
    if (!arrISO || !nextDepISO) return 0;
    const a = new Date(arrISO);
    const b = new Date(nextDepISO);
    const diff = (b - a) / 60000; // minutes
    return diff > 0 ? Math.round(diff) : 0;
}

// build sector object per desired spec
function buildSector(seg, modifiedTravelTime) {
    const flyMin = parseToMinutes(seg.flyingTime || seg.travelTime);
    const travelMin = parseToMinutes(seg.travelTime || seg.flyingTime);
    const depISO = makeIsoDate(seg.departure?.date, seg.departure?.time);
    const arrISO = makeIsoDate(seg.arrival?.date, seg.arrival?.time);
    const airlineCode = seg.airlineCode || seg.operatingCarrier?.code || "";
    const airlineName = AIRLINE_MAP[airlineCode] || seg.airlineName || "";

    return {
        IsConnect: !!seg.transitTime,
        AirlineCode: airlineCode,
        AirlineName: airlineName,
        Class: seg.classOfService || seg.fareType || "",
        CabinClass: seg.cabinClass || "",
        BookingCounts: "",
        NoSeats: Number(seg.noOfSeats) || 0,
        FltNum: seg.flightNumber || "",
        EquipType: seg.equipmentType || "",
        FlyingTime: minutesToFullFormat(flyMin),
        TravelTime: minutesToFullFormat(travelMin),
        TechStopOver: Array.isArray(seg.technicalStops) ? seg.technicalStops.length : (seg.transitTime ? 1 : 0),
        layover: seg.transitTime?.layoverDes || "",
        Status: seg.status || "",
        OperatingCarrier: seg.operatingCarrier?.code ? seg.operatingCarrier.code : seg.operatingCarrier || seg.operatingCarrier || null,
        MarketingCarrier: seg.brand && Object.keys(seg.brand).length ? seg.brand : null,
        BaggageInfo: seg.baggageInfo || "",
        HandBaggage: seg.cabinBaggage || "",
        TransitTime: seg.transitTime || null,
        MealCode: seg.mealCode || null,
        Key: seg.segRef || "",
        Distance: seg.distance || "",
        ETicket: seg.eTicket || "No",
        ChangeOfPlane: seg.changeOfPlane || "",
        ParticipantLevel: seg.participantLevel || "",
        OptionalServicesIndicator: !!seg.optionalServices,
        AvailabilitySource: seg.availabilitySource || "",
        Group: `${seg.group - 1}` ?? "",
        LinkAvailability: seg.linkAvailability || false,
        PolledAvailabilityOption: seg.polledAvailabilityOption || "",
        FareBasisCode: seg.fareBasis || "",
        HostTokenRef: seg.hostTokenRef || "",
        APISRequirementsRef: seg.apisRequirementsRef || "",
        Departure: {
            Terminal: seg.departure?.terminal || "",
            Date: depISO ? depISO.split("T")[0] : "",
            Time: seg.departure?.time || "",
            Day: seg.departureDay || null,
            DateTimeStamp: depISO || "",
            Code: seg.departure?.code || "",
            Name: seg.departure?.name || "",
            CityCode: seg.departure?.cityCode || seg.departure?.code || "",
            CityName: seg.departure?.cityName || "",
            CountryCode: seg.departure?.countryCode || "",
            CountryName: seg.departure?.countryName || ""
        },
        Arrival: {
            Terminal: seg.arrival?.terminal || "",
            Date: arrISO ? arrISO.split("T")[0] : "",
            Time: seg.arrival?.time || "",
            Day: seg.arrivalDay || null,
            DateTimeStamp: arrISO || "",
            Code: seg.arrival?.code || "",
            Name: seg.arrival?.name || "",
            CityCode: seg.arrival?.cityCode || seg.arrival?.code || "",
            CityName: seg.arrival?.cityName || "",
            CountryCode: seg.arrival?.countryCode || "",
            CountryName: seg.arrival?.countryName || ""
        },
        OI: null,
        modifiedTravelTime: modifiedTravelTime || minutesToHHMM(flyMin),
        travelDaysCount: Math.floor(parseToMinutes(seg.travelTime || seg.flyingTime) / 1440),
        modifiedLayoverTime: "",
        airlineLogo: `https://agentapi.kafilaholidays.in/assets/logo/${airlineCode || "XX"}.png`
    };
}

// build SelectedFlight object from an itinerary (synthesizes Itinerary sub-array etc.)
function buildSelectedFlightFromIti(iti, sectors, baseFare, taxes, totalPrice) {
    const firstSector = sectors[0] || {};
    const lastSector = sectors[sectors.length - 1] || {};
    const durMinutes = sectors.reduce((s, sec) => {
        // parse modifiedTravelTime as HH:MM if possible
        const mm = parseToMinutes(sec.FlyingTime) || parseToMinutes(sec.TravelTime) || 0;
        return s + mm;
    }, 0);

    const Itinerary = sectors.map((s, i) => ({
        Id: i,
        Src: s.Departure?.Code || "",
        SrcName: s.Departure?.CityName || "",
        Des: s.Arrival?.Code || "",
        DesName: s.Arrival?.CityName || "",
        FLogo: "",
        FCode: s.AirlineCode || "",
        FName: s.AirlineName || "",
        FNo: s.FltNum || "",
        DDate: s.Departure?.Date ? `${s.Departure.Date}T${s.Departure.Time || "00:00"}:00` : "",
        ADate: s.Arrival?.Date ? `${s.Arrival.Date}T${s.Arrival.Time || "00:00"}:00` : "",
        DTrmnl: s.Departure?.Terminal || "",
        ATrmnl: s.Arrival?.Terminal || "",
        DArpt: s.Departure?.Name || "",
        AArpt: s.Arrival?.Name || "",
        Dur: s.FlyingTime || s.TravelTime || "",
        layover: s.layover || "",
        Seat: s.NoSeats || 0,
        FClass: s.Class || "",
        PClass: s.CabinClass || "",
        FBasis: s.FareBasisCode || "",
        FlightType: s.EquipType || "",
        OI: null
    }));

    return {
        PId: 0,
        Id: Math.floor(Math.random() * 1000),
        TId: 0,
        FCode: firstSector.AirlineCode || "",
        FName: firstSector.AirlineName || "",
        FNo: firstSector.FltNum || "",
        DDate: firstSector.Departure?.Date ? `${firstSector.Departure.Date}T${firstSector.Departure.Time || "00:00"}:00` : "",
        ADate: lastSector.Arrival?.Date ? `${lastSector.Arrival.Date}T${lastSector.Arrival.Time || "00:00"}:00` : "",
        Dur: minutesToHHMM(durMinutes),
        Stop: Math.max(0, sectors.length - 1),
        Seats: firstSector.NoSeats || 0,
        Sector: sectors.map(s => s.Departure?.Code || "").filter(Boolean).join(","),
        Itinerary,
        Fare: {
            GrandTotal: totalPrice,
            BasicTotal: baseFare,
            YqTotal: 0,
            TaxesTotal: taxes,
            Adt: { Basic: baseFare, Yq: 0, Taxes: taxes, Total: totalPrice },
            Chd: null,
            Inf: null,
            OI: []
        },
        FareRule: {},
        Alias: iti.airSegments?.[0]?.fareFamily || "MAIN",
        FareType: iti.airSegments?.[0]?.fareType || "Economy",
        PFClass: `${(iti.airSegments?.[0]?.cabinClass || "").toLowerCase()}-${iti.airSegments?.[0]?.classOfService || ""}-${iti.airSegments?.[0]?.fareBasis || ""}`,
        OI: {}
    };
}

// ----------------- Main mapping function (Option 3, but CommercialBreakup not handled) -----------------
function makeItineraryPriceCheckResponses(body) {
    const responses = [];
    const journeys = Array.isArray(body.journey) ? body.journey : [];
    const travellers = journeys?.[0]?.travellerDetails || [];
    // totals
    const totalMealPrice = travellers.reduce((s, t) => s + sum(t.mealPreferences), 0);
    const totalSeatPrice = travellers.reduce((s, t) => s + sum(t.seatPreferences), 0);
    const totalBaggagePrice = travellers.reduce((s, t) => s + sum(t.baggagePreferences), 0);
    const totalFastForwardPrice = travellers.reduce((s, t) => s + sum(t.fastForwardPreferences), 0);

    journeys.forEach((journey, journeyIndex) => {
        const itins = Array.isArray(journey.itinerary) ? journey.itinerary : [];
        itins.forEach((iti, idx) => {
            const airSegments = Array.isArray(iti.airSegments) ? iti.airSegments : [];
            const priceBreakupInput = Array.isArray(iti.priceBreakup) ? iti.priceBreakup : [];
            const BaseFare = safeNum(iti.baseFare);
            const Taxes = safeNum(iti.taxes);
            const TotalPrice = safeNum(iti.totalPrice) || (BaseFare + Taxes);
            const GrandTotal = TotalPrice;

            // prepare host tokens & PB entries
            const orderedPB = buildPriceBreakupEntries(priceBreakupInput, iti.hostTokens);

            // sectors: compute modifiedTravelTime per sector as HH:MM of flyingTime
            const sectors = [];
            for (let i = 0; i < airSegments.length; i++) {
                const seg = airSegments[i];
                const modifiedTravelTime = minutesToHHMM(parseToMinutes(seg.flyingTime || seg.travelTime));
                sectors.push(buildSector(seg, modifiedTravelTime));
            }

            // calculate total minutes across segments (flyingTime or travelTime) for itinerary summary
            const totalMinutes = (airSegments || []).reduce((acc, seg) => acc + parseToMinutes(seg.flyingTime || seg.travelTime), 0);
            const TravelTime = minutesToFullFormat(totalMinutes);
            const modifiedTravelTime = minutesToHHMM(totalMinutes);

            // compute layovers: sum positive layover minutes & formatted modifiedLayoverTime (largest layover formatted)
            let totalLayoverMins = 0;
            let layoverList = [];
            for (let i = 0; i < sectors.length - 1; i++) {
                const a = sectors[i].Arrival?.DateTimeStamp || makeIsoDate(airSegments[i].arrival?.date, airSegments[i].arrival?.time);
                const b = sectors[i + 1].Departure?.DateTimeStamp || makeIsoDate(airSegments[i + 1].departure?.date, airSegments[i + 1].departure?.time);
                const lm = layoverMinutes(a, b);
                if (lm > 0) {
                    totalLayoverMins += lm;
                    layoverList.push(lm);
                }
            }
            const maxLay = layoverList.length ? Math.max(...layoverList) : 0;
            const modifiedLayoverTime = maxLay ? minutesToHHMM(maxLay) : "";

            // fareDifference (smart)
            const fareDifference = {
                FareDifference: 0,
                NewFare: TotalPrice,
                OldFare: TotalPrice,
                Journeys: [
                    {
                        Security: "",
                        IPaxkey: `MCFBRFQ-|${priceBreakupInput?.[0]?.passengerType || "ADT"}`,
                        TotalFare: TotalPrice,
                        BasicTotal: BaseFare,
                        YqTotal: 0,
                        TaxTotal: Taxes,
                        Segments: [
                            {
                                PaxType: priceBreakupInput?.[0]?.passengerType || "ADT",
                                TaxBreakup: [
                                    { CType: "", CCode: "", Amt: BaseFare },
                                    { CType: "CUTE", CCode: "CUT", Amt: 0 },
                                    { CType: "RCS", CCode: "RCS", Amt: 0 },
                                    { CType: "IN", CCode: "IN", Amt: 0 }
                                ]
                            },
                            {}, {}
                        ]
                    }
                ]
            };

            // SelectedFlight
            const selectedFlight = buildSelectedFlightFromIti(iti, sectors, BaseFare, Taxes, TotalPrice);

            // Param.Sector list
            const paramSectors = sectors.map(s => ({
                Src: s.Departure.Code || "",
                Des: s.Arrival.Code || "",
                DDate: s.Departure.Date || ""
            }));

            // Build final object — replicate Type-A structure keys (many fields)
            const obj = {
                UniqueKey: iti.uId ? String(iti.uId).replace(/-/g, "").slice(0, 9) : String(Math.floor(Math.random() * 1e9)),
                FreeSeat: false,
                FreeMeal: totalMealPrice === 0,
                SessionKey: iti.sessionKey || "",
                CarbonEmission: iti.carbonEmission || "",
                InPolicy: iti.inPolicy || false,
                IsRecommended: iti.isRecommended || false,
                UID: iti.uId || "",
                BaseFare: BaseFare,
                Taxes: Taxes,
                TotalPrice: TotalPrice,
                OfferedPrice: TotalPrice,
                GrandTotal: GrandTotal,
                Currency: iti.currency || (body.currency || "INR"),
                FareType: iti.airSegments?.[0]?.fareType || "RP",
                Stop: Math.max(0, sectors.length - 1),
                IsVia: (sectors.length > 1),
                TourCode: iti.tourCode || "",
                PricingMethod: iti.pricingMethod || "Guaranteed",
                FareFamily: iti.airSegments?.[0]?.fareFamily || "Regular Fare",
                PromotionalFare: iti.promotionalFare || false,
                FareFamilyDN: iti.fareFamilyDN || null,
                PromotionalCode: iti.promotionalCode || "",
                PromoCodeType: iti.promoCodeType || "",
                RefundableFare: !!iti.refundable,
                IndexNumber: idx,
                Provider: iti.provider || "1A",
                ValCarrier: iti.valCarrier || iti.airSegments?.[0]?.airlineCode || "",
                LastTicketingDate: iti.lastTicketingDate || "",
                TravelTime: TravelTime,
                PriceBreakup: orderedPB,
                Sectors: sectors,
                FareRule: iti.fareRule || (iti.refundable ? { Refund: "Refundable" } : { Refund: "Non-Refundable" }),
                HostTokens: iti.hostTokens || null,
                Key: iti.key || "",
                SearchID: iti.searchId || "",
                TRCNumber: iti.trcNumber || null,
                TraceId: body.Authentication?.TraceId || "",
                OI: iti.OI || null,
                SelectedFlight: selectedFlight,
                FareDifference: fareDifference,
                Error: {
                    Status: null, Result: null, ErrorMessage: "", ErrorCode: null,
                    Location: "SELL", WarningMessage: "", IsError: false, IsWarning: false
                },
                IsFareUpdate: false,
                IsAncl: false,
                Param: {
                    Trip: iti.tripType || "D1",
                    Adt: (priceBreakupInput.find(p => p.passengerType === "ADT")?.noOfPassenger) || 0,
                    Chd: (priceBreakupInput.find(p => p.passengerType === "CHD")?.noOfPassenger) || 0,
                    Inf: (priceBreakupInput.find(p => p.passengerType === "INF")?.noOfPassenger) || 0,
                    Sector: paramSectors,
                    PF: iti.pf || "",
                    PC: iti.airSegments?.[0]?.cabinClass?.toLowerCase() || "economy",
                    Routing: iti.routing || "ALL",
                    Ver: "1.0.0.0",
                    Auth: { AgentId: body.auth?.agentId || "", Token: body.auth?.token || "" },
                    Env: body.env || "D",
                    Module: "B2B",
                    OtherInfo: {
                        PromoCode: body.promoCode || "",
                        FFlight: "",
                        FareType: iti.fareType || "",
                        TraceId: body.traceId || "",
                        IsUnitTesting: false,
                        TPnr: false,
                        FAlias: null,
                        IsLca: false,
                        ServerId: null,
                        vendorList: body.vendorList || null
                    }
                },
                GstData: {
                    IsGst: !!body.gstDetails,
                    GstDetails: {
                        Name: body.gstDetails?.companyName || "",
                        Address: body.gstDetails?.addressLine1 || "",
                        Email: body.gstDetails?.emailAddress || "",
                        Mobile: body.gstDetails?.workPhone || "",
                        Pin: body.gstDetails?.postalCode || "",
                        State: body.gstDetails?.provinceState || "",
                        Type: "",
                        Gstn: body.gstDetails?.gstNumber || "",
                        isAgentGst: false
                    }
                },
                HostTokens: iti.hostTokens || [],
                Key: iti.key || "",
                SearchID: iti.searchId || "",
                advanceAgentMarkup: {
                    adult: { baseFare: 0, taxesFare: 0, feesFare: 0, gstFare: 0 },
                    child: { baseFare: 0, taxesFare: 0, feesFare: 0, gstFare: 0 },
                    infant: { baseFare: 0, taxesFare: 0, feesFare: 0, gstFare: 0 }
                },
                oldModifiedTotalPrice: TotalPrice,
                modifiedRefundableFlag: iti.refundable ? "R" : "N",
                seatsAvlCounts: sectors.reduce((acc, s) => acc + (s.NoSeats || 0), 0),
                offeredPrice: TotalPrice,
                modifiedTotalPrice: TotalPrice,
                sectorCountString: sectors.length <= 1 ? "Non-Stop" : `${Math.max(0, sectors.length - 1)} Stops`,
                totalLayOverTime: totalLayoverMins || 0,
                isFreeMeal: totalMealPrice === 0,
                isFreeSeat: totalSeatPrice === 0,
                modifiedTravelTime: modifiedTravelTime,
                commaSepratedStops: sectors.map(s => s.Arrival?.Code).filter(Boolean),
                commaSepratedLayoverTime: layoverList.map(m => minutesToHHMM(m)),
                travelDaysCount: Math.floor(totalMinutes / 1440),
                fareFamiliyCheckBoolean: false,
                viewAllFareFamility: false,
                DomainURl: body.domainUrl || "",
                SourceName: body.sourceName || "Web",
                travelType: body.travelType || "DOM",
                typeOfTrip: body.typeOfTrip || "ONEWAY",
                fareRules: iti.fareRules || null,
                BookingId: iti.bookingId || "",
                totalMealPrice,
                totalBaggagePrice,
                totalSeatPrice,
                totalFastForwardPrice
            };

            // attach modifiedLayoverTime to each sector if available (best-effort mapping)
            sectors.forEach((s, i) => {
                const next = sectors[i + 1];
                if (next) {
                    const lm = layoverMinutes(s.Arrival?.DateTimeStamp || "", next.Departure?.DateTimeStamp || "");
                    s.modifiedLayoverTime = lm ? minutesToHHMM(lm) : "";
                } else s.modifiedLayoverTime = "";
            });

            responses.push(obj);
        });
    });

    return responses;
}

// export for Node


// /////////update pkFare bookingApi///////////////////////////////////////////////////////////////////

const commonFunctionUpdateBooking = (body) => {



    let root = {
        "Authentication": makeAuthentication(body?.authentication),
        "TypeOfTrip": "ONEWAY",
        "cartId": body?.cartID,
        "PaxInfo": passengerInfoDecorator(body),
        "BookingInfo": BookingInfoDecorator(body),
    }




    return root




}


const passengerInfoDecorator = (body) => {
    let JourneyDetail = body?.journey[0]
    const itinerary = JourneyDetail?.itinerary[0];
    const segments = createAirBookingRequestBodyForCommonAPI(itinerary)

    let bodyforPassenger = JourneyDetail?.travellerDetails
    return {

        "PaxEmail": bodyforPassenger?.[0]?.contactDetails?.email || "",
        "PaxMobile": bodyforPassenger?.[0]?.contactDetails?.mobile || "",
        "Passengers": bodyforPassenger.map((passenger) => {


            return {
                "PaxType": passenger?.type,
                "Title": "",
                "FName": passenger?.firstName,
                "LName": passenger?.lastName,
                "Gender": passenger?.gender ?? "",
                "Dob": "",
                "Optional": {
                    // "TicketNumber": passenger.eTicket.map((ticket) => {
                    //     return {
                    //         ticketNumber: ticket?.eTicketNumber,
                    //         status: ticket.status
                    //     }
                    // }),
                    ticketDetails: segments.map((ele) => {
                        return {
                            "ticketNumber": passenger.eTicket?.[0]?.eTicketNumber,
                            "src": ele?.Origin,
                            "des": ele?.Destination
                        }

                    }),
                    "PassportNo": "",
                    "PassportExpiryDate": "",
                    "FrequentFlyerNo": "",
                    "Nationality": "",
                    "ResidentCountry": "",
                    EMDDetails:convertEMD(passenger.emd)
                },
                "Meal": [],
                "Baggage": (passenger.baggagePreferences || []).map(b => ({
                    Trip: b.wayType ?? 0,
                    FCode: b.airlineCode ?? "",
                    FNo: b.flightNumber ?? "",
                    SsrCode: b.code ?? "",
                    SsrDesc: b.desc ?? "",
                    Complmnt: b.paid ?? false,
                    Currency: b.currency ?? "INR",
                    Price: b.amount ?? 0,
                    rePrice: 0,
                    Src: b.origin ?? "",
                    Des: b.destination ?? "",
                    SsrFor: "Journey",
                    OI: b.name ?? ""
                })),
                "Special": null,
                "Seat": [],
                "IsActive": true,
                "Reschedule": null
            }
        })

    }
}

function BookingInfoDecorator(body) {
    const journeys = body?.journey || [];


    return journeys.map((j, index) => {
        // Extract PNRS
        const gdsPnr = j.recLoc?.find(x => x.type === "GDS")?.pnr || "";
        const bookingId = j.recLoc?.find(x => x.type === "UAPI")?.pnr || commonProviderMethodDate(new Date());

        // Generate a dummy Booking ID (you can change later)
        // const bookingId = ``;


        return {
            Src: j.origin || "",
            Des: j.destination || "",
            CurrentStatus: returnStatus(j.bookingStatus) || "",
            BookingStatus: returnStatus(j.bookingStatus) || "",
            IsRescheduled: false,
            BookingRemark: j.bookingRemarks || "",
            BookingId: bookingId,
            APnr: gdsPnr,
            GPnr: gdsPnr,

            // Since body has no payment info → we create defaults
            PaymentInfo: {
                PaymentStatus: j.paymentStatus === "Paid",
                PaymentMsg: j.paymentStatus || "",
                PaymentId: "",
                Amount: j.itinerary?.[0]?.totalPrice || 0,
                PaymentMode: body?.Authentication?.CredentialType || "UNKNOWN"
            },

            // SalePurchase defaults (no data in body)
            SalePurchase: {
                TStatus: true,
                PAmt: j.itinerary?.[0]?.totalPrice || 0,
                SAmt: j.itinerary?.[0]?.totalPrice || 0,
                Diff: 0,
                ATDetails: {
                    BookingStatus: j.bookingStatus || "",
                    Pnr: gdsPnr,
                    PaymentStatus: j.paymentStatus || "",
                    PaidStatus: null,
                    Account: "",
                    QuotedAmt: j.itinerary?.[0]?.totalPrice || 0,
                    CollectedAmt: j.itinerary?.[0]?.totalPrice || 0,
                    QuotedAmtRT: 0,
                    CollectedAmtRT: 0,
                    Error: ""
                }
            }
        };
    });
}


// helper  root.SearchRequest.Segments = [];
const createAirBookingRequestBodyForCommonAPI = (itinerary) => {
    const segmentGroups = {};
    let segMents = []

    itinerary.airSegments.forEach(seg => {
        if (!segmentGroups[seg.group]) {
            segmentGroups[seg.group] = [];
        }
        segmentGroups[seg.group].push(seg);
    });

    const onwardGroup = segmentGroups["1"];
    const returnGroup = segmentGroups["2"];

    // ---------------------------------------------------
    //  ONWARD SEGMENT
    // ----------------------------------------------------
    if (onwardGroup) {
        const first = onwardGroup[0].departure;
        const last = onwardGroup[onwardGroup.length - 1].arrival;

        const parts = first.date.split("-"); // dd-mm-yyyy

        segMents.push({
            Origin: first.code,
            Destination: last.code,
            OriginName: first.cityName,
            DestinationName: last.cityName,
            DepartureDate: `${parts[2]}-${parts[1]}-${parts[0]}`,
            DepartureTime: "00:01",
            DepartureTimeTo: "23:59",
            ClassOfService: onwardGroup[0].cabinClass
        });

        if (first.countryCode !== last.countryCode) {
            travelType = "INTERNATIONAL";
        }
    }

    // ----------------------------------------------------
    //  RETURN SEGMENT
    // ----------------------------------------------------
    if (returnGroup) {
        typeOfTrip = "ROUNDTRIP";

        const first = returnGroup[0].departure;
        const last = returnGroup[returnGroup.length - 1].arrival;

        const parts = first.date.split("-");

        segMents.push({
            Origin: first.code,
            Destination: last.code,
            OriginName: first.cityName,
            DestinationName: last.cityName,
            DepartureDate: `${parts[2]}-${parts[1]}-${parts[0]}`,
            DepartureTime: "00:01",
            DepartureTimeTo: "23:59",
            ClassOfService: returnGroup[0].cabinClass
        });
    }

    return segMents

}


const returnStatus = (status = "") => {
    const s = status.toUpperCase();  // convert everything to UPPERCASE

    switch (s) {
        case "CONFIRM":
            return "CONFIRMED";
        case "FAILED":
            return "FAILED";
        case "HOLD":
            return "HOLD";
        case "PENDING":
            return "PENDING";
        case "CANCELLED":
            return "CANCELLED";   // X is common for Cancelled
        default:
            return "PENDING";   // default always Pending
    }
};

function convertEMD(emdList = []) {
    const convertDate = (dateStr) => {
        // Convert 27NOV25 to 2025-11-27
        const day = dateStr.substring(0, 2);
        const monthStr = dateStr.substring(2, 5).toUpperCase();
        const year = "20" + dateStr.substring(5, 7);

        const monthMap = {
            JAN: "01", FEB: "02", MAR: "03", APR: "04",
            MAY: "05", JUN: "06", JUL: "07", AUG: "08",
            SEP: "09", OCT: "10", NOV: "11", DEC: "12",
        };

        return `${year}-${monthMap[monthStr]}-${day}`;
    };

    return emdList.map((e) => {
        return {
            originRef: "21",
            destinationRef: "21",
            EMDNumber: e.emdNumber,
            IssuedDate: convertDate(e.issuedDate),
            amount: e.amount,
            breakup: {
                base: Math.round(e.amount * 0.90), // 90% base
                tax: Math.round(e.amount * 0.10),  // 10% tax
            },
            currency: "INR",
            type: e.type?.toLowerCase() || "",
            origin: e.departure,
            destination: e.arrival,
            status: e.status === "HK" ? "confirmed" : "pending",
        };
    });
}

// -------------------- Output --------------------
module.exports = { commonFunctionDecorator, commonFunctionUpdateBooking,makeAuthentication }
