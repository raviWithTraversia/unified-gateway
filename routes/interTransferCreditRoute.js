const express = require("express");
const interTransferCredit_route = express();
const bodyParser = require("body-parser");
interTransferCredit_route.use(bodyParser.json());
interTransferCredit_route.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");
const interTransferCreditController = require('../controllers/interTransferCredit/interTransfer.controller')

interTransferCredit_route.post('/transfer/interTransferCredit', auth, interTransferCreditController.interTransferCredit);

module.exports = interTransferCredit_route;