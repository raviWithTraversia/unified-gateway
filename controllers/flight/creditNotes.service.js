const flightcommercial = require("./flight.commercial");
const Company = require("../../models/Company");
const Users = require("../../models/User");
const Supplier = require("../../models/Supplier");
const agentConfig = require("../../models/AgentConfig");
const bookingDetails = require("../../models/booking/BookingDetails");
const CancelationBooking = require("../../models/booking/CancelationBooking");
const creditNotesData = require("../../models/CreditNotes");
const axios = require("axios");
const Logs = require("../../controllers/logs/PortalApiLogsCommon");
const uuid = require("uuid");
const NodeCache = require("node-cache");
const flightCache = new NodeCache();





const calculateRefundAndCharges = (totalAmount, numPassengers, cancelledPassengers) => {
  const baseFarePerPassenger = totalAmount / numPassengers;
  const cancellationChargePerPassenger = 500; 
  const cancellationCharges = cancelledPassengers * cancellationChargePerPassenger;
  const remainingAmount = baseFarePerPassenger * (numPassengers - cancelledPassengers);
  const refundAmount = remainingAmount - cancellationCharges;

  return {
    cancellationCharges,
    refundAmount
  };
};

const flightCreditNotes = async (data) => {
  const {
    Authentication,
    Provider,
    PNR,
    TravelType,
    bookingId,
    CancelType,
    Reason,
    Sector
  } = data;

  const fieldNames = [
    "Authentication",
    "Provider",
    "PNR",
    "TravelType",
    "bookingId",
    "CancelType",
    "Reason",
    "Sector"
  ];

  const missingFields = fieldNames.filter(
    (fieldName) => data[fieldName] === null || data[fieldName] === undefined
  );

  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(", ");
    return {
      response: null,
      isSometingMissing: true,
      data: `Missing or null fields: ${missingFieldsString}`,
    };
  }

  const companyId = Authentication.CompanyId;
  const userId = Authentication.UserId;

  if (!companyId || !userId) {
    return {
      response: "Company or User id field are required",
    };
  }

  // Check if company Id exists
  const checkCompanyIdExist = await Company.findById(companyId);
  if (!checkCompanyIdExist || checkCompanyIdExist.type !== "TMC") {
    return {
      response: "TMC Company id does not exist",
    };
  }

  // Fetch booking and passengers
  const booking = await bookingDetails.findById(bookingId).populate('passengers').exec();
  if (!booking) {
    return {
      response: "Booking not found",
    };
  }

  const totalAmount = bookingDetails.totalAmount; // Assuming total amount is stored in the booking
  const numPassengers = bookingDetails.passengers.length;

  // Find the existing credit note or create a new one
  let creditNote = await CreditNote.findOne({ bookingId: BookingId }).exec();
  if (!creditNote) {
    creditNote = new creditNotesData({
      creditNoteNo: `CN${Date.now()}`,
      userId,
      companyId,
      PNR,
      bookingDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      totalAmount,
      bookingId: BookingId,
      passengers: [],
      totalCancellationCharges: 0,
      totalRefundAmount: 0,
      totalServiceCharges: 0,
      status: 'Issued'
    });
  }

  // Update cancellation status for the passenger
  const cancelledPassengers = booking.passengers.filter(p => p.cancellationStatus === 'Cancelled').length;
  const { cancellationCharges, refundAmount } = calculateRefundAndCharges(totalAmount, numPassengers, cancelledPassengers);

  creditNote.totalCancellationCharges = cancellationCharges;
  creditNote.totalRefundAmount = refundAmount;

  for (const passenger of booking.passengers) {
    if (passenger.cancellationStatus === 'Cancelled') {
      creditNote.passengers.push(passenger);
    }
  }

  // Save credit note
  await creditNotesData.save();

  return {
    response: "Fetch Data Successfully",
    data: creditNotesData
  };
};


module.exports = {flightCreditNotes}


