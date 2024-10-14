const express = require("express");
const irctcBookingRoute = express();
const bodyParser = require("body-parser");
irctcBookingRoute.use(bodyParser.json());
irctcBookingRoute.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");
const irctcBookingController = require("../controllers/rail/irctcBooking.controller");

// irctcBookingRoute.post(
//   "/createIrctcBooking",
//   auth,
//   irctcBookingController.createIrctcBooking
// );
irctcBookingRoute.post(
  "/irctcPaymentSubmit",
  auth,
  irctcBookingController.irctcPaymentSubmit
);

irctcBookingRoute.get(
  "/boardingstationenq",
  auth,
  irctcBookingController.boardingstationenq
);

irctcBookingRoute.post(
  "/irctcAmountDeduction",
  auth,
  irctcBookingController.irctcAmountDeduction
);

irctcBookingRoute.post(
  "/irctc-invoice-generator",
  auth,
  irctcBookingController.RailinvoiceGenerator
);

irctcBookingRoute.post(
  "/irctc-credit-notes",
  auth,
  irctcBookingController.RailCreditNotes
);



module.exports = irctcBookingRoute;
