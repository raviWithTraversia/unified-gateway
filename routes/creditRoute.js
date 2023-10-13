const express = require("express");
const credit_route = express();
const bodyParser = require("body-parser");
credit_route.use(bodyParser.json());
credit_route.use(bodyParser.urlencoded({extended:true}));
const creditRequest = require('../controllers/credit/creditRequest.controller');
const creditRequestValidator = require('../validation/creditRequest.validation');


credit_route.post('/add-credit-request' , 
creditRequestValidator.creditValidation , 
creditRequest.storeCreditRequest);

credit_route.get('/get-all-credit-request' , 
creditRequest.getAllCreditRequest)

credit_route.get('/get-credit-by-compnay/:companyId' , 
creditRequest.getCreditByCompanyId)





module.exports = credit_route;