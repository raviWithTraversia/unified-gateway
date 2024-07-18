const express = require("express");
const invoiceGenerator_route = express();
const bodyParser = require("body-parser");
invoiceGenerator_route.use(bodyParser.json());
invoiceGenerator_route.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");
const invoiceGeneratorControlatler = require('../controllers/invoiceGenerator/invoiceGenerator.controller');

invoiceGenerator_route.post('/invoiceGenerator', auth, invoiceGeneratorControlatler.invoiceGenerator);

module.exports = invoiceGenerator_route;