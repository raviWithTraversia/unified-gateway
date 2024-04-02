const express = require("express");
const flight_booking_route = express();
const bodyParser = require("body-parser");
flight_booking_route.use(bodyParser.json());
flight_booking_route.use(bodyParser.urlencoded({extended:true}));
const balance = require('../controllers/balanceMange/balanceManageController');

flight_booking_route.post('/getBalance' , balance.getbalance);

module.exports = flight_booking_route;