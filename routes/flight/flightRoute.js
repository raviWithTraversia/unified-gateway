
const express = require("express");
const flight_route = express();
const bodyParser = require("body-parser");
const auth = require("../../middleware/auth");

// flight_route.use(bodyParser.json());
// flight_route.use(bodyParser.urlencoded({extended:true}));

flight_route.use(bodyParser.json({ limit: '100mb' }));
flight_route.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

const flight = require('../../controllers/flight/flight.controller');
flight_route.post('/flight/search', auth, flight.getSearch);
flight_route.post('/Pricing/AirPricing', auth, flight.airPricing);
flight_route.post('/Flight/startBooking', auth, flight.startBooking);
flight_route.post('/flight/ssr', auth, flight.specialServiceReq);
flight_route.post('/flight/generic-cart', auth, flight.genericcart);
flight_route.post('/flight/fullCancelation', auth, flight.fullCancelation);
flight_route.post('/flight/partialCancelation', auth, flight.partialCancelation);
flight_route.post('/flight/fullCancelationCharge', auth, flight.fullCancelationCharge);
flight_route.post('/flight/partialCancelationCharge', auth, flight.partialCancelationCharge);
flight_route.post('/flight/updateBookingStatus', auth, flight.updateBookingStatus);
flight_route.post('/flight/amendment', auth, flight.amendmentDetails);
flight_route.post('/flight/allAmendment', auth, flight.getAllAmendment);
flight_route.post('/flight/assignAmendmentUser', auth, flight.assignAmendmentUser);
flight_route.get('/flight/deleteAmendmentDetail', auth, flight.deleteAmendmentDetail);

module.exports = flight_route;