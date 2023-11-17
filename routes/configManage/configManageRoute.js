const express = require("express");
const flight_route = express();
const bodyParser = require("body-parser");
flight_route.use(bodyParser.json());
flight_route.use(bodyParser.urlencoded({extended:true}));
const ConfigManage = require('../../controllers/configManage/configManage.controller');

flight_route.post('/config/airgstmandate' , ConfigManage.addairGSTMandate);