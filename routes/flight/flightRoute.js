const express = require("express");
const flight_route = express();
const bodyParser = require("body-parser");
const auth = require("../../middleware/auth");

// flight_route.use(bodyParser.json());
// flight_route.use(bodyParser.urlencoded({extended:true}));

flight_route.use(bodyParser.json({ limit: "100mb" }));
flight_route.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

const flight = require("../../controllers/flight/flight.controller");
flight_route.post("/flight/search", auth, flight.getSearch);
flight_route.post("/Pricing/AirPricing", auth, flight.airPricing);
flight_route.post("/Flight/RBD", auth, flight.getRBD);
flight_route.post("/Flight/fair-rules", auth, flight.getFairRules);
flight_route.post("/Flight/startBooking", auth, flight.startBooking);
flight_route.post("/flight/ssr", auth, flight.specialServiceReq);
flight_route.post("/flight/generic-cart", auth, flight.genericcart);
flight_route.post("/flight/fullCancelation", auth, flight.fullCancelation);
flight_route.post("/flight/pnr/ticket", auth, flight.getPnrTicket);
flight_route.post(
  "/flight/partialCancelation",
  auth,
  flight.partialCancelation
);
flight_route.post(
  "/flight/fullCancelationCharge",
  auth,
  flight.fullCancelationCharge
);
flight_route.post(
  "/flight/partialCancelationCharge",
  auth,
  flight.partialCancelationCharge
);
flight_route.post("/flight/updateBookingStatus",auth, flight.updateBookingStatus);
flight_route.post(
  "/flight/updatePendingBookingStatus",
  auth,
  flight.updatePendingBookingStatus
);

flight_route.post(
  "/flight/updateConfirmBookingStatus",
  flight.updateConfirmBookingStatus
);

flight_route.post("/flight/amendment", auth, flight.amendmentDetails);
flight_route.post("/flight/allAmendment", auth, flight.getAllAmendment);
flight_route.post(
  "/flight/assignAmendmentUser",
  auth,
  flight.assignAmendmentUser
);
flight_route.post(
  "/flight/create-amendment-cart",
  auth,
  flight.amendmentCartCreate
);
flight_route.post("/flight/amadeusTest", flight.amadeusTest);
flight_route.get(
  "/flight/deleteAmendmentDetail",
  auth,
  flight.deleteAmendmentDetail
);
flight_route.post("/flight/amadeusTest", flight.amadeusTest);
flight_route.post("/flight/import-pnr", flight.importPNR);
flight_route.post("/flight/getAllTravellers", auth, flight.getAllTravellers);
flight_route.post("/flight/addTravellers", auth, flight.addTravellers);
flight_route.get("/flight/fixed-fare",flight.getFixedFare)
flight_route.post("/flight/commercial-for-pk-fare",flight.getCommercialForPkFareController)
module.exports = flight_route;
