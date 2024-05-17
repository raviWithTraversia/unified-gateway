const express = require("express");
const easeBuzz_route = express();
const bodyParser = require("body-parser");
easeBuzz_route.use(bodyParser.json());
easeBuzz_route.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");
const easeBuzzController = require('./../controllers/easeBuzzController/easeBuzz.controller');

easeBuzz_route.post('/paymentGateway/easeBuzz', auth, easeBuzzController.easeBuzz);
easeBuzz_route.post('/paymentGateway/easeBussResponce', auth, easeBuzzController.easeBuzzResponce);

module.exports = easeBuzz_route;
