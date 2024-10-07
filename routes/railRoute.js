const express = require("express");
const rail_route = express();
const bodyParser = require("body-parser");
rail_route.use(bodyParser.json());
rail_route.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");
const railController = require("./../controllers/rail/rail.controller");
const railBookingController = require("../controllers/rail/RailBooking.js/railbooking.controller");
const balance = require("../controllers/rail/railBalance/manualDebitCreditRails.controller");
rail_route.post("/rail/railSearch", auth, railController.railSearch);
rail_route.post(
  "/rail/railSearchBtwnDate",
  auth,
  railController.railSearchBtwnDate
);
rail_route.post("/rail/stationName", auth, railController.getTrainStation);
rail_route.post("/rail/railRoute", auth, railController.getTrainRoute);
rail_route.post("/rail/fareEnquiry", auth, railController.getFareEnquiry);
rail_route.post("/rail/manualDebitCredit", auth, balance.manualDebitCredit);
rail_route.post("/rail/bookingSave", railController.DecodeToken);
rail_route.post("/rail/start-booking", railBookingController.StartBookingRail);
rail_route.post(
  "/rail/get-all-booking",
  railBookingController.findRailAllBooking
);
rail_route.get("/getAgent-performance/:parentId",auth,balance.agentPerformanceReport)
rail_route.post("/rail/cancel-booking", railController.cancelBooking);

// easeBuzz_route.post('/paymentGateway/easeBussResponce', auth, easeBuzzController.easeBuzzResponce);

module.exports = rail_route;
