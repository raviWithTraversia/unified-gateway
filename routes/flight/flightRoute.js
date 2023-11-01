const express = require("express");
const flight_route = express();
const bodyParser = require("body-parser");
flight_route.use(bodyParser.json());
flight_route.use(bodyParser.urlencoded({extended:true}));
const Flight = require('../../controllers/flight/flight.controller');

product_route.post('/flight/search' , Flight.search);