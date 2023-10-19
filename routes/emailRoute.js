const express = require("express");
const email_route = express();
const bodyParser = require("body-parser");
email_route.use(bodyParser.json());
email_route.use(bodyParser.urlencoded({extended:true}));
const emailController = require("../controllers/emailConfig/index.js");
const auth = require("../middleware/auth");


module.exports = email_route;

