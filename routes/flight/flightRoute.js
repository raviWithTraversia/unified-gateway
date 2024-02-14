const express = require("express");
const flight_route = express();
const bodyParser = require("body-parser");
flight_route.use(bodyParser.json());
flight_route.use(bodyParser.urlencoded({extended:true}));
const flight = require('../../controllers/flight/flight.controller');

flight_route.post('/flight/search' , flight.getSearch);
flight_route.post('/Pricing/AirPricing' , flight.airPricing);

module.exports = flight_route;