const express = require("express");
const rail_route = express();
const bodyParser = require("body-parser");
rail_route.use(bodyParser.json());
rail_route.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");
const railController = require('./../controllers/rail/rail.controller');

rail_route.get('/rail/railSearch', auth, railController.railSearch);
rail_route.post('/rail/stationName', auth, railController.getTrainStation);

// easeBuzz_route.post('/paymentGateway/easeBussResponce', auth, easeBuzzController.easeBuzzResponce);

module.exports = rail_route;
