const { default: axios } = require("axios");
const { Config } = require("../configs/config");
const passengerPreferenceModel=require('../models/booking/PassengerPreference')
const BookingDetails=require('../models/booking/BookingDetails')
const transaction=require('../models/transaction')
const ledger=require('../models/Ledger')
const agentConfig=require('../models/AgentConfig')
const {getTdsAndDsicount} = require("../controllers/commonFunctions/common.function");
const {
  createPnrTicketRequestBody,
  createRBDResponse,
} = require("../helpers/common-rbd.helper");
const { saveLogInFile } = require("../utils/save-log");

const {convertItineraryForKafila} = require("../helpers/common-search.helper");
const {convertPaxDetailsForKafila}=require("../helpers/common-import-pnr.helper");

module.exports.getCommonPnrTicket = async (request) => {
  var errorMessage=""
  try {
    const requestBody = await createPnrTicketRequestBody(request);

    if (!Array.isArray(requestBody)) {
      throw new Error("Invalid request body: Expected an array");
    }

    const promises = requestBody.map(async (requestsForApiBody) => {
      try {
        const rbdURL =
          Config[request.Authentication.CredentialType].additionalFlightsBaseURL +
          "/pnr/ticket";

        const { data: response } = await axios.post(rbdURL, requestsForApiBody);

        if (!response?.data) throw new Error("No Data Available");

        const { journey, uniqueKey } = response.data;
        const itinerary = journey[0]?.itinerary[0];

        const convertedItinerary = convertItineraryForKafila({
          itinerary,
          idx: 1,
          response: response.data,
          uniqueKey,
        });

        const segmentGroup = groupSegments(itinerary.airSegments);
        const Passengers = convertPaxDetailsForKafila(journey[0].travellerDetails, segmentGroup);

        return {
          success: true,
          result: {
            Status: journey[0]?.status?.pnrStatus || "failed",
            PNR: journey[0]?.recLocInfo?.find?.((details) => details?.type === "GDS")?.pnr ?? null,
            Itinerary: convertedItinerary,
            Passengers,
          },
        };
      } catch (error) {
        // console.error("API Call Error:", error.message);
        errorMessage=error.message

        return { success: false, error: error.message };
      }
    });

    const results = await Promise.allSettled(promises);
    console.log(results)

    const successfulResults = await Promise.all(
      results
        .filter(({ status, value }) => status === "fulfilled" && value.success)
        .map(({ value }) => holdBookingProcessPayment(value.result))
    );

    return { result: successfulResults };
  } catch (err) {
    console.error("Error:", err);
    return { error:errorMessage || err.message };
  }
};

  

  function groupSegments(segments) {
    const group = {};
    segments.forEach((segment) => {
      if (!group[segment.group]) group[segment.group] = [];
      group[segment.group].push(segment);
    });
    return group;
  }


  async function holdBookingProcessPayment(items) {
    const item={
      "Status": "Confirm",
      "PNR": "OS9OOQ",
      "Itinerary": {
          "UniqueKey": "852920308",
          "FreeSeat": false,
          "FreeMeal": true,
          "SessionKey": "",
          "CarbonEmission": "165.670168KG CO2",
          "InPolicy": false,
          "IsRecommended": true,
          "UID": "9029c8c1-eb88-4585-904d-e51939d637d5",
          "BaseFare": 0,
          "Taxes": 0,
          "TotalPrice": 0,
          "OfferedPrice": 0,
          "GrandTotal": 0,
          "Currency": "INR",
          "FareType": "RP",
          "Stop": 1,
          "IsVia": true,
          "TourCode": "",
          "PricingMethod": "",
          "FareFamily": "Regular Fare",
          "PromotionalFare": false,
          "FareFamilyDN": null,
          "PromotionalCode": "",
          "PromoCodeType": "",
          "RefundableFare": false,
          "IndexNumber": 1,
          "Provider": "1A",
          "ValCarrier": "SV",
          "LastTicketingDate": "",
          "TravelTime": "",
          "PriceBreakup": [
              {},
              {},
              {}
          ],
          "Sectors": [
              {
                  "IsConnect": false,
                  "AirlineCode": "SV",
                  "AirlineName": "",
                  "Class": "",
                  "CabinClass": "",
                  "BookingCounts": "",
                  "NoSeats": "",
                  "FltNum": "761",
                  "EquipType": "773",
                  "FlyingTime": "",
                  "TravelTime": "",
                  "TechStopOver": null,
                  "layover": "",
                  "Status": "",
                  "OperatingCarrier": null,
                  "MarketingCarrier": null,
                  "BaggageInfo": "",
                  "HandBaggage": "",
                  "TransitTime": null,
                  "MealCode": null,
                  "key": "1",
                  "Distance": "",
                  "ETicket": "No",
                  "ChangeOfPlane": "",
                  "ParticipantLevel": "",
                  "OptionalServicesIndicator": false,
                  "AvailabilitySource": "",
                  "Group": "0",
                  "LinkAvailability": false,
                  "PolledAvailabilityOption": "",
                  "FareBasisCode": "",
                  "HostTokenRef": "{\"status\":\"HK\"}",
                  "APISRequirementsRef": "",
                  "Departure": {
                      "Terminal": "3",
                      "Date": "2025-02-22",
                      "Time": "18:30",
                      "Day": "Saturday",
                      "DateTimeStamp": "2025-02-22T18:30:00",
                      "Code": "DEL",
                      "Name": "Indira Gandhi International Airport",
                      "CityCode": "DEL",
                      "CityName": "Delhi",
                      "CountryCode": "IN",
                      "CountryName": "India"
                  },
                  "Arrival": {
                      "Terminal": "4",
                      "Date": "2025-02-22",
                      "Time": "21:05",
                      "Day": "Saturday",
                      "DateTimeStamp": "2025-02-22T21:05:00",
                      "Code": "RUH",
                      "Name": "King Khalid International Airport",
                      "CityCode": "RUH",
                      "CityName": "Riyadh",
                      "CountryCode": "SA",
                      "CountryName": "Saudi Arabia"
                  },
                  "OI": [],
                  "ProductClass": ""
              },
              {
                  "IsConnect": false,
                  "AirlineCode": "SV",
                  "AirlineName": "",
                  "Class": "",
                  "CabinClass": "",
                  "BookingCounts": "",
                  "NoSeats": "",
                  "FltNum": "592",
                  "EquipType": "320",
                  "FlyingTime": "",
                  "TravelTime": "",
                  "TechStopOver": null,
                  "layover": "",
                  "Status": "",
                  "OperatingCarrier": null,
                  "MarketingCarrier": null,
                  "BaggageInfo": "",
                  "HandBaggage": "",
                  "TransitTime": null,
                  "MealCode": null,
                  "key": "2",
                  "Distance": "",
                  "ETicket": "No",
                  "ChangeOfPlane": "",
                  "ParticipantLevel": "",
                  "OptionalServicesIndicator": false,
                  "AvailabilitySource": "",
                  "Group": "0",
                  "LinkAvailability": false,
                  "PolledAvailabilityOption": "",
                  "FareBasisCode": "",
                  "HostTokenRef": "{\"status\":\"HK\"}",
                  "APISRequirementsRef": "",
                  "Departure": {
                      "Terminal": "4",
                      "Date": "2025-02-23",
                      "Time": "00:05",
                      "Day": "Sunday",
                      "DateTimeStamp": "2025-02-23T00:05:00",
                      "Code": "RUH",
                      "Name": "King Khalid International Airport",
                      "CityCode": "RUH",
                      "CityName": "Riyadh",
                      "CountryCode": "SA",
                      "CountryName": "Saudi Arabia"
                  },
                  "Arrival": {
                      "Terminal": "1",
                      "Date": "2025-02-23",
                      "Time": "03:00",
                      "Day": "Sunday",
                      "DateTimeStamp": "2025-02-23T03:00:00",
                      "Code": "DXB",
                      "Name": "Dubai International Airport",
                      "CityCode": "DXB",
                      "CityName": "Dubai",
                      "CountryCode": "AE",
                      "CountryName": "United Arab Emirates"
                  },
                  "OI": [],
                  "ProductClass": ""
              }
          ],
          "FareRule": null,
          "HostTokens": null,
          "Key": "",
          "SearchID": "ee6051da-22f0-4b54-b668-ad83abc05989",
          "TRCNumber": null,
          "TraceId": "8e75c80b-b87c-4b1c-b2aa-e20aca8af367",
          "OI": null,
          "apiItinerary": {
              "PId": 1,
              "Id": 1,
              "TId": 1,
              "FCode": "SV",
              "FNo": "761",
              "DDate": "2025-02-22T18:30:00",
              "ADate": "2025-02-23T03:00:00",
              "Dur": "",
              "Stop": 1,
              "Sector": "DEL,DXB",
              "Itinerary": [
                  {
                      "Id": 0,
                      "Src": "DEL",
                      "SrcName": "Delhi",
                      "Des": "RUH",
                      "DesName": "Riyadh",
                      "FLogo": "",
                      "FCode": "SV",
                      "FNo": "761",
                      "DDate": "2025-02-22T18:30:00",
                      "ADate": "2025-02-22T21:05:00",
                      "DTrmnl": "3",
                      "ATrmnl": "4",
                      "DArpt": "Indira Gandhi International Airport",
                      "AArpt": "King Khalid International Airport",
                      "Dur": "",
                      "layover": "",
                      "FBasis": "",
                      "FlightType": "",
                      "OI": null
                  },
                  {
                      "Id": 1,
                      "Src": "RUH",
                      "SrcName": "Riyadh",
                      "Des": "DXB",
                      "DesName": "Dubai",
                      "FLogo": "",
                      "FCode": "SV",
                      "FNo": "592",
                      "DDate": "2025-02-23T00:05:00",
                      "ADate": "2025-02-23T03:00:00",
                      "DTrmnl": "4",
                      "ATrmnl": "1",
                      "DArpt": "King Khalid International Airport",
                      "AArpt": "Dubai International Airport",
                      "Dur": "",
                      "layover": "",
                      "FBasis": "",
                      "FlightType": "",
                      "OI": null
                  }
              ],
              "Fare": {
                  "GrandTotal": 0,
                  "BasicTotal": 0,
                  "YqTotal": 0,
                  "TaxesTotal": 0,
                  "Adt": null,
                  "Chd": null,
                  "Inf": null,
                  "OI": null
              },
              "FareRule": null,
              "Alias": "Regular Fare",
              "FareType": null,
              "PFClass": null,
              "OI": null,
              "Offer": null,
              "Deal": {
                  "NETFARE": 0,
                  "TDISC": 0,
                  "TDS": 0,
                  "GST": 0,
                  "DISCOUNT": {
                      "DIS": 0,
                      "SF": 0,
                      "PDIS": 0,
                      "CB": 0
                  }
              }
          }
      },
      "Passengers": [
          {
              "PaxType": "ADT",
              "passengarSerialNo": 1,
              "Title": "",
              "FName": "SUDEEP MR",
              "LName": "SINGH",
              "Gender": "",
              "Dob": "01/01/1996",
              "Meal": [],
              "Baggage": [],
              "Seat": [],
              "Optional": {
                  "TicketDetails": [
                      {
                          "TicketNumber": "0655904341323",
                          "SRC": "DEL",
                          "DES": "DXB"
                      }
                  ],
                  "EMD": [],
                  "PassportNo": "TR12345678",
                  "PassportExpiryDate": "2025-00-28",
                  "FrequentFlyerNo": "",
                  "Nationality": "IN",
                  "ResidentCountry": "IN"
              }
          }
      ]
  }
    // Check if booking is confirmed
    if (item.Status !== "Confirm") {
      return {};
    }
  
    // Fetch booking details
    const bookingData = await BookingDetails.findOne({ GPnr: item?.PNR });
    if (!bookingData) return "Booking data not found";
  
    // Fetch agent configuration
    const getAgentConfig = await agentConfig.findOne({ userId: bookingData?.userId });
    if (!getAgentConfig) return "Agent configuration not found";
  
    // Calculate credit limit and check balance
    const maxCreditLimit = getAgentConfig.maxcreditLimit ?? 0;
    // const checkCreditLimit = maxCreditLimit + creditTotal;
  
    if (maxCreditLimit < bookingData.bookingTotalAmount) {
      return "Your Balance is not sufficient";
    }
  
    // Update booking status
    await BookingDetails.findByIdAndUpdate(
      bookingData._id,
      { $set: { bookingStatus: "CONFIRMED", APnr: item?.PNR } },
      { new: true }
    );
  
    // Deduct balance from agent's credit limit
    const newBalance = maxCreditLimit - bookingData.bookingTotalAmount;
    await agentConfig.updateOne(
      { userId: getAgentConfig.userId },
      { maxcreditLimit: newBalance }
    );
  
    // Generate ledger and transaction entries
    const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000);
    const gtTsAdDnt = await getTdsAndDsicount(bookingData.itinerary);
  
    await Promise.all([
      ledger.create({
        userId: getAgentConfig.userId,
        companyId: getAgentConfig.companyId,
        ledgerId: ledgerId,
        transactionAmount: bookingData.bookingTotalAmount,
        currencyType: "INR",
        fop: "CREDIT",
        deal: gtTsAdDnt.ldgrdiscount,
        tds: gtTsAdDnt.ldgrtds,
        transactionType: "DEBIT",
        runningAmount: newBalance,
        remarks: "Booking amount deducted from your account.",
        transactionBy: getuserDetails._id,
        cartId: bookingData.bookingId,
      }),
      transaction.create({
        userId: getAgentConfig.userId,
        companyId: getAgentConfig.companyId,
        trnsNo: Math.floor(100000 + Math.random() * 900000),
        trnsType: "DEBIT",
        paymentMode: "CL",
        trnsStatus: "success",
        transactionBy: getAgentConfig.userId,
        bookingId: bookingData.bookingId,
      }),
    ]);
  
    // Fetch and update passenger preferences
    const getPassengersPreference = await passengerPreferenceModel.findOne({ bid: bookingData._id });
    if (!getPassengersPreference) return { message: "Passenger preferences not found" };
  
    const { Passengers } = getPassengersPreference;
    if (!Passengers || !Passengers.length) return { message: "No passengers found" };
  
    const segmentMap = {};
    Passengers.forEach((passenger) => {
      passenger.Optional.ticketDetails.forEach((ticket, idx) => {
        segmentMap[`${ticket.src}-${ticket.des}`] = idx;
      });
    });
  
    await Promise.all(
      Passengers.map(async (passenger) => {
        const selectedPax = item.Passengers.find(
          (p) => p.FName === passenger.FName && p.LName === passenger.LName
        );
  
        if (!selectedPax) return passenger;
  
        passenger.Status = "CONFIRMED";
        passenger.Optional.EMDDetails = [
          ...(passenger.Optional.EMDDetails || []),
          ...(selectedPax.Optional?.EMDDetails || []),
        ];
  
        if (selectedPax?.Optional?.TicketDetails?.length) {
          selectedPax.Optional.TicketDetails.forEach((ticket) => {
            const segmentIdx = segmentMap[`${ticket.SRC}-${ticket.DES}`];
            if (segmentIdx != null) {
              passenger.Optional.ticketDetails[segmentIdx].ticketNumber = ticket.TicketNumber;
            } else {
              passenger.Optional.ticketDetails.push(ticket);
            }
          });
        }
        return passenger;
      })
    );
  
    await getPassengersPreference.save();
    return item;
  }
  
