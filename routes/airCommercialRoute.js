const express = require("express");
const air_commercial_route = express();
const bodyParser = require("body-parser");
air_commercial_route.use(bodyParser.json());
air_commercial_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");

const airCommercialController = require('./../controllers/airCommercial/airCommercial.controller');

air_commercial_route.post(
    '/commercial/air-commercial-store' ,
    auth,
    airCommercialController.storeAirCommercial
);

module.exports = air_commercial_route;