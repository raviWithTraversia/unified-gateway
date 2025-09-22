const express = require("express");
const phonePe = express();
const bodyParser = require("body-parser");
phonePe.use(bodyParser.json());
phonePe.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");
const {phonePeInitiatePayment,phonePeSuccess} = require('../controllers/phonePe/phonePe.controller');
const { phonePeWebhoockUrlIntegration } = require("../controllers/phonePe/phonePe.service");

phonePe.post('/api/paymentGateway/phonePe', auth,phonePeInitiatePayment);
phonePe.get('/api/flight/phonepe/wallet/success', phonePeSuccess);
phonePe.get("/phonepe/webhook", phonePeWebhoockUrlIntegration);

// phonePe.post('/paymentGateway/easeBussResponce', auth, easeBuzzController.easeBuzzResponce);

module.exports = phonePe;
