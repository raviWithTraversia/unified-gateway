const mongoose = require("mongoose");
const amendmentDetailsSchema = new mongoose.Schema(
  {
    amendmentId: {
      // AMD103425
      type: String,
      default: null,
    },
    assignToUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amendmentType: {  // Reschedule, Cancellation , Misc
      type: String,
      default: null,
    },
    amendmentStatus: {  // OPEN, COMPLETED , Under process, ABORTED, PENDING
      type: String,
      default: "OPEN",
    },
    AmendmentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    newCartId: {
      type: String, default: ""
    },
    paymentStatus: {  // NOT PROCESSED, COMPLETED , Under process, ABORTED,PENDING
      type: String,
      default: "Under process",
    },
    amendmentRemarks: {
      type: String,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    AgencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    BookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bookingId: {
      type: String,
      default: null,
    },
    prodBookingId: {
      // 1,2,3,4,5,6,7,8,9
      type: String,
      default: null,
    },
    provider: {
      type: String,
      default: null,
    },
    bookingType: {
      // The type of booking (e.g., "Staff", "Agency", etc.)
      type: String,
      default: null,
    },
    src: {
      type: String,
      default: null,
    },
    des: {
      type: String,
      default: null,
    },
    bookingDateTime: {
      type: Date,
      default: Date.now,
    },
    bookingStatus: {
      type: String,
      default: null,
      // enum: ['INCOMPLETE', 'FAILED','CONFIRMED','CANCELLED','PENDING',HOLD, HOLDRELEASED]
    },
    providerBookingId: {
      type: String,
      default: null,
    },
    bookingRemarks: {
      type: String,
      default: null,
    },
    paymentMethodType: {
      type: String,
      default: null,
    },
    paymentGateway: {
      paymentCharges: { type: Number, default: 0 },
      paymentMode: { type: String, default: null },
    },

    PNR: {
      type: String,
      default: null,
    },
    APnr: {
      type: String,
      default: null,
    },
    GPnr: {
      type: String,
      default: null,
    },

    bookingTotalAmount: {
      type: Number,
      default: 0,
    },
    PNRConfirmation: {
      type: String,
      default: null,
    },
    totalMealPrice: { type: Number, default: 0 },
    totalBaggagePrice: { type: Number, default: 0 },
    totalSeatPrice: { type: Number, default: 0 },
    sourceMedia: {
      type: String,
      default: null,
    },
    productType: {
      type: String,
      default: "Flight",
    },
    Supplier: {
      // KAfila, 1G, ACH
      type: String,
      default: null,
    },
    mailIssued: {
      type: Boolean,
      default: false,
    },
    PNRConfirmation: {
      type: String,
      default: null,
    },
    creationDate: {
      type: Date,
      default: Date.now(),
    },
    travelType: {
      type: String,
      enum: ["Domestic", "International"],
      default: "Domestic",
    },
    booking_Type: {
      type: String,
      enum: ["Automated", "Manual"],
      default: "Automated",
    },
    bookingCancelDate: {
      type: Date,
      default: null,
    },
    invoiceNo: {
      type: String,
      default: null,
    },
    invoicingDate: {
      type: Date,
      default: Date.now(),
    },
    PromoCode: {
      type: String,
      default: null,
    },
    universalPNR: {
      type: String,
      default: null,
    },
    cancelledRemarks: {
      type: String,
      default: null,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amendmentType: {
      type: String,
      default: null,
    },
    searchId: {
      type: String,
      default: null,
    },
    fareRules: {
      DESC: { type: String, default: null },
      CBHA: { type: Number, default: 0 },
      CWBHA: { type: Number, default: 0 },
      RBHA: { type: Number, default: 0 },
      RWBHA: { type: Number, default: 0 },
      SF: { type: Number, default: 0 },
    },
    bookingGST: {
      GSTNumber: { type: String, default: null },
      GSTEmail: { type: String, default: null },
      GSTHolderName: { type: String, default: null },
      GSTPhoneNumber: { type: String, default: null },
      GSTAddress: { type: String, default: null },
      GSTStateCode: { type: String, default: null },
    },
    itinerary: {
      UID: { type: String, default: null },
      BaseFare: { type: Number, default: null },
      Taxes: { type: Number, default: null },
      TotalPrice: { type: Number, default: null },
      GrandTotal: { type: Number, default: null },
      FareFamily: { type: String, default: null },
      IndexNumber: { type: Number, default: 0 },
      Provider: { type: String, default: null },
      ValCarrier: { type: String, default: null },
      LastTicketingDate: { type: String, default: null },
      TravelTime: { type: String, default: null },
      advanceAgentMarkup: {
        adult: {
          baseFare: { type: Number, default: 0 },
          taxesFare: { type: Number, default: 0 },
          feesFare: { type: Number, default: 0 },
          gstFare: { type: Number, default: 0 },
        },
        child: {
          baseFare: { type: Number, default: 0 },
          taxesFare: { type: Number, default: 0 },
          feesFare: { type: Number, default: 0 },
          gstFare: { type: Number, default: 0 },
        },
        infant: {
          baseFare: { type: Number, default: 0 },
          taxesFare: { type: Number, default: 0 },
          feesFare: { type: Number, default: 0 },
          gstFare: { type: Number, default: 0 },
        },
      },
      PriceBreakup: [
        {
          PassengerType: { type: String, default: null },
          NoOfPassenger: { type: Number, default: null },
          Tax: { type: Number, default: null },
          BaseFare: { type: Number, default: null },
          TaxBreakup: [
            {
              TaxType: { type: String, default: null },
              Amount: { type: Number, default: null },
            },
          ],
          CommercialBreakup: [
            {
              CommercialType: { type: String, default: null },
              onCommercialApply: { type: String, default: null },
              Amount: { type: Number, default: null },
              SupplierType: { type: String, default: null },
            },
          ],
          AgentMarkupBreakup: {
            BookingFee: { type: Number, default: null },
            Basic: { type: Number, default: null },
            Tax: { type: Number, default: null },
          },
        },
      ],
      Sectors: [
        {
          AirlineCode: { type: String, default: null },
          AirlineName: { type: String, default: null },
          Class: { type: String, default: null },
          CabinClass: { type: String, default: null },
          FltNum: { type: String, default: null },
          FlyingTime: { type: String, default: null },
          TravelTime: { type: String, default: null },
          layover: { type: String, default: null },
          Departure: {
            Terminal: { type: String, default: null },
            Date: { type: Date, default: null },
            Time: { type: Date, default: null },
            Day: { type: Date, default: null },
            DateTimeStamp: { type: Date, default: null },
            Code: { type: String, default: null },
            Name: { type: String, default: null },
            CityCode: { type: String, default: null },
            CityName: { type: String, default: null },
            CountryCode: { type: String, default: null },
            CountryName: { type: String, default: null },
          },
          Arrival: {
            Terminal: { type: String, default: null },
            Date: { type: String, default: null },
            Time: { type: String, default: null },
            Day: { type: Date, default: null },
            DateTimeStamp: { type: String, default: null },
            Code: { type: String, default: null },
            Name: { type: String, default: null },
            CityCode: { type: String, default: null },
            CityName: { type: String, default: null },
            CountryCode: { type: String, default: null },
            CountryName: { type: String, default: null },
          },
        },
      ],
      IsFareUpdate: { type: String, default: true },
      IsAncl: { type: String, default: false },
      TraceId: { type: String, default: null },
    },
    modifyBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifyAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const AmendmentDetails = mongoose.model(
  "AmendmentDetails",
  amendmentDetailsSchema
);
module.exports = AmendmentDetails;
