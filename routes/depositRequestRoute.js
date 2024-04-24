const express = require("express");
const deposit_route = express();
const bodyParser = require("body-parser");
deposit_route.use(bodyParser.json());
deposit_route.use(bodyParser.urlencoded({extended:true}));
const creditRequest = require('../controllers/credit/creditRequest.controller');
const creditRequestValidator = require('../validation/creditRequest.validation');
const auth = require("../middleware/auth");

deposit_route.post('/deposit/add-deposit-request', creditRequest.storeCreditRequest);
// deposit_route.post('/credit/wallettopup', creditRequest.wallettopup);

// deposit_route.get(
//     '/credit/get-all-credit-request', 
//     auth,
//     creditRequest.getAllCreditRequest
// )

// deposit_route.get(
//     '/credit/get-credit-by-compnay/:companyId' ,
//     auth, 
//     creditRequest.getCreditByCompanyId
// )

// deposit_route.get(
//     '/credit/get-credit-by-agent/:companyId' ,
//     auth, 
//     creditRequest.getCreditByAgentId
// )
// deposit_route.patch(
//     '/credit/approv-reject-credit/:creditRequestId',
//     auth,
//     creditRequest.approveRejectCredit
// );




module.exports = deposit_route;