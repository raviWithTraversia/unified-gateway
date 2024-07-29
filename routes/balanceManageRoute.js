const express = require("express");
const flight_booking_route = express();
const bodyParser = require("body-parser");
flight_booking_route.use(bodyParser.json());
flight_booking_route.use(bodyParser.urlencoded({ extended: true }));
const balance = require('../controllers/balanceMange/balanceManageController');
const auth = require("../middleware/auth");

flight_booking_route.post('/getBalance', balance.getbalance);
flight_booking_route.post('/manualDebitCredit', auth, balance.manualDebitCredit);
flight_booking_route.get('/getBalance-Tmc', balance.getBalanceTmc);


module.exports = flight_booking_route;