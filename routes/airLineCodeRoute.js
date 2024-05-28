const express = require("express");
const air_line_code_route = express();
const bodyParser = require("body-parser");
air_line_code_route.use(bodyParser.json());
air_line_code_route.use(bodyParser.urlencoded({extended:true}));
const AirLineController = require('./../controllers/airLineCode/airLineCodeController')
const auth = require("../middleware/auth");


air_line_code_route.get(
    '/airline/get-airline-code',
    auth,
    AirLineController.getAirLineCode
);

air_line_code_route.post('/airline-code/custumereCare',AirLineController.getAirLineCustumereCare)
module.exports = air_line_code_route