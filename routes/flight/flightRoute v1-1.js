const express = require("express");
const flight_route = express();
const bodyParser = require("body-parser");
const auth = require("../../middleware/auth");

// flight_route.use(bodyParser.json());
// flight_route.use(bodyParser.urlencoded({extended:true}));

flight_route.use(bodyParser.json({ limit: "100mb" }));
flight_route.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

const flightV1_1 = require("../../controllers/flight/flight.controller v1-1");
flight_route.post("/flight/search", auth, flightV1_1.getSearch);
flight_route.post("/Pricing/AirPricing", auth, flightV1_1.airPricing);
flight_route.post("/Flight/RBD", auth, flightV1_1.getRBD);
flight_route.post("/Flight/fair-rules", auth, flightV1_1.getFairRules);
flight_route.post("/Flight/startBooking", auth, flightV1_1.startBooking);
flight_route.post("/flight/ssr", auth, flightV1_1.specialServiceReq);
flight_route.post("/flight/generic-cart", auth, flightV1_1.genericcart);
flight_route.post("/flight/fullCancelation", auth, flightV1_1.fullCancelation);
flight_route.post(
  "/flight/partialCancelation",
  auth,
  flightV1_1.partialCancelation
);
flight_route.post(
  "/flight/fullCancelationCharge",
  auth,
  flightV1_1.fullCancelationCharge
);
flight_route.post(
  "/flight/partialCancelationCharge",
  auth,
  flightV1_1.partialCancelationCharge
);
flight_route.post("/flight/updateBookingStatus", flightV1_1.updateBookingStatus);
flight_route.post(
  "/flight/updatePendingBookingStatus",
  flightV1_1.updatePendingBookingStatus
);

flight_route.post(
  "/flight/updateConfirmBookingStatus",
  flightV1_1.updateConfirmBookingStatus
);

flight_route.post("/flight/amendment", auth, flightV1_1.amendmentDetails);
flight_route.post("/flight/allAmendment", auth, flightV1_1.getAllAmendment);
flight_route.post(
  "/flight/assignAmendmentUser",
  auth,
  flightV1_1.assignAmendmentUser
);
flight_route.post(
  "/flight/create-amendment-cart",
  auth,
  flightV1_1.amendmentCartCreate
);
flight_route.post("/flight/amadeusTest", flightV1_1.amadeusTest);
flight_route.get(
  "/flight/deleteAmendmentDetail",
  auth,
  flightV1_1.deleteAmendmentDetail
);
flight_route.post("/flight/amadeusTest", flightV1_1.amadeusTest);
module.exports = flight_route;
