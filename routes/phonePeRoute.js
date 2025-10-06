const express = require("express");
const phonePe = express();
const bodyParser = require("body-parser");
phonePe.use(bodyParser.json());
phonePe.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");
const {phonePeInitiatePayment,phonePeFlightWalletSuccess,phonePeRailWalletSuccess,phonePeFlightBookingSuccess} = require('../controllers/phonePe/phonePe.controller');
const { phonePeWebhoockUrlIntegration ,phonePeWebhoockLiveUrlIntegration} = require("../controllers/phonePe/phonePe.service");

phonePe.post('/api/paymentGateway/phonePe', auth,phonePeInitiatePayment);
phonePe.get('/api/flight/phonepe/wallet/success', phonePeFlightWalletSuccess);
phonePe.get('/api/rail/phonepe/wallet/success', phonePeRailWalletSuccess);
phonePe.get("/api/flight/phonepe/success",phonePeFlightBookingSuccess)
phonePe.post("/phonepe/webhook", phonePeWebhoockUrlIntegration);
phonePe.post("/api/phonepe/live/webhook", phonePeWebhoockLiveUrlIntegration);

// phonePe.post('/paymentGateway/easeBussResponce', auth, easeBuzzController.easeBuzzResponce);

module.exports = phonePe;
