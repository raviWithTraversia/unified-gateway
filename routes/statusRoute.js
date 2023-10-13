const express = require("express");
const status_route = express();
const bodyParser = require("body-parser");
status_route.use(bodyParser.json());
status_route.use(bodyParser.urlencoded({extended:true}));
const registrationController = require('../controllers/registration/registration.controller')
const auth = require("../middleware/auth");