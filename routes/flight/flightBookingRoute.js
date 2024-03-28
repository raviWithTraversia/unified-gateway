const express = require("express");
const flight_booking_route = express();
const bodyParser = require("body-parser");
flight_booking_route.use(bodyParser.json());
flight_booking_route.use(bodyParser.urlencoded({extended:true}));
const flight = require('../../controllers/flightBooking/flightBooking.controller');

flight_booking_route.post('/flightbooking/idcreation' , flight.getIdCreation);
flight_booking_route.post('/flightbooking/allBooking' , flight.getAllBooking);
flight_booking_route.post('/flightbooking/getBookingByBookingId' , flight.getBookingByBookingId);

module.exports = flight_booking_route;