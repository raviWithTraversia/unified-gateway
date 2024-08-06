const express = require("express");
const invoiceGenerator_route = express();
const bodyParser = require("body-parser");
invoiceGenerator_route.use(bodyParser.json());
invoiceGenerator_route.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");
const invoiceGeneratorControlatler = require('../controllers/invoiceGenerator/invoiceGenerator.controller');

invoiceGenerator_route.post('/invoiceGenerator', auth, invoiceGeneratorControlatler.invoiceGenerator);
invoiceGenerator_route.get('/transactionList',auth,invoiceGeneratorControlatler.transactionList);
invoiceGenerator_route.get('/pgTransactionList',auth,invoiceGeneratorControlatler.pgTransaction);
invoiceGenerator_route.get('/ledgerListWithFilter',invoiceGeneratorControlatler.ledgerListWithFilter);

module.exports = invoiceGenerator_route;