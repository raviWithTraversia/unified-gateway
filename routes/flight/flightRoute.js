
const express = require("express");
const flight_route = express();
const bodyParser = require("body-parser");

// flight_route.use(bodyParser.json());
// flight_route.use(bodyParser.urlencoded({extended:true}));

flight_route.use(bodyParser.json({ limit: '100mb' }));
flight_route.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

const flight = require('../../controllers/flight/flight.controller');

flight_route.post('/flight/search' , flight.getSearch);
flight_route.post('/Pricing/AirPricing' , flight.airPricing);
flight_route.post('/Flight/startBooking' , flight.startBooking);
flight_route.post('/flight/ssr' , flight.specialServiceReq);
flight_route.post('/flight/fullCancelation' , flight.fullCancelation);
flight_route.post('/flight/partialCancelation' , flight.partialCancelation);
flight_route.post('/flight/fullCancelationCharge' , flight.fullCancelationCharge);
flight_route.post('/flight/partialCancelationCharge' , flight.partialCancelationCharge);
module.exports = flight_route;