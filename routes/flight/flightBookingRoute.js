const express = require("express");
const flight_booking_route = express();
const bodyParser = require("body-parser");
flight_booking_route.use(bodyParser.json({ limit: '100mb' }));
flight_booking_route.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
// flight_booking_route.use(bodyParser.json());
// flight_booking_route.use(bodyParser.urlencoded({extended:true}));
const flight = require('../../controllers/flightBooking/flightBooking.controller');

flight_booking_route.post('/flightbooking/idcreation', flight.getIdCreation);
flight_booking_route.post('/flightbooking/allBooking', flight.getAllBooking);
flight_booking_route.get('/flightbooking/PendingBooking',flight.PendingBooking);
flight_booking_route.post('/flightbooking/getBookingByBookingId', flight.getBookingByBookingId);
flight_booking_route.post('/flightbooking/getBookingCalendarCount', flight.getBookingCalendarCount);
flight_booking_route.post('/flightbooking/getDeparturesList', flight.getDeparturesList);
flight_booking_route.post('/flightbooking/getBookingBill', flight.getBookingBill);
flight_booking_route.post('/flightbooking/getSalesReport', flight.getSalesReport);
flight_booking_route.post('/flightbooking/getBookingByPaxDetails', flight.getBookingByPaxDetails);
flight_booking_route.get('/flightbooking/getBillingData', flight.getBillingData);
flight_booking_route.post('/flightbooking/updateBillPost', flight.updateBillPost);
flight_booking_route.post('/flightbooking/manuallyUpdateBookingStatus', flight.manuallyUpdateBookingStatus);
flight_booking_route.post('/flightbooking/manuallyUpdateMultipleBookingStatus', flight.manuallyUpdateMultipleBookingStatus);
flight_booking_route.post('/sendCadDeailonMail',flight.SendCardOnMail)
flight_booking_route.put('/updateAdvanceMarkup',flight.UpdateAdvanceMarkup)
flight_booking_route.put('/update/bookingStatus',flight.updateBookingStatus);




module.exports = flight_booking_route;