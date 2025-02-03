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

module.exports.getCommonPnrTicket = async (request,res) => {
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

    const successfulResults = await Promise.all(
      results
        .filter(({ status, value }) => status === "fulfilled" && value.success)
        .map(({ value }) => holdBookingProcessPayment(value.result))
    );

    return { result: [...successfulResults]};
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


  async function holdBookingProcessPayment(item) {
    
    // Check if booking is confirmed
    if (item.Status !== "Confirm") {
      return "Hold From Api Side";
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
  
    let titles = ["Mr", "MR", "mr", "Mrs", "Miss", "Dr", "Ms"];
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
    
    const gtTsAdDnt = await getTdsAndDsicount([bookingData.itinerary]); 
  
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
        transactionBy: getAgentConfig.userId,
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
    const getPassengersPreference = await passengerPreferenceModel.findOne({ bookingId: bookingData.bookingId });
    console.log(getPassengersPreference,"getPassengersPreference");
    if (!getPassengersPreference) return  "Passenger preferences not found"
  
    const { Passengers } = getPassengersPreference;
    if (!Passengers || !Passengers.length) return  "No passengers found" 
  
    const segmentMap = {};
    Passengers.forEach((passenger) => {
      passenger.Optional.ticketDetails.forEach((ticket, idx) => {
        segmentMap[`${ticket.src}-${ticket.des}`] = idx;
      });
    });
  
    await Promise.all(
      Passengers.map(async (passenger) => {
        const selectedPax = item.Passengers.find(
          (p) => p.FName.split(" ").filter(word => !titles.includes(word)).join(" ") == passenger.FName.toUpperCase() && p.LName == passenger.LName.toUpperCase()
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
  
