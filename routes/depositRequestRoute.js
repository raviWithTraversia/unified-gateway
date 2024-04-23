const express = require("express");
const credit_route = express();
const bodyParser = require("body-parser");
credit_route.use(bodyParser.json());
credit_route.use(bodyParser.urlencoded({extended:true}));
const creditRequest = require('../controllers/credit/creditRequest.controller');
const creditRequestValidator = require('../validation/creditRequest.validation');
const auth = require("../middleware/auth");

credit_route.post('/credit/add-credit-request', creditRequest.storeCreditRequest);
credit_route.post('/credit/wallettopup', creditRequest.wallettopup);

credit_route.get(
    '/credit/get-all-credit-request', 
    auth,
    creditRequest.getAllCreditRequest
)

credit_route.get(
    '/credit/get-credit-by-compnay/:companyId' ,
    auth, 
    creditRequest.getCreditByCompanyId
)

credit_route.get(
    '/credit/get-credit-by-agent/:companyId' ,
    auth, 
    creditRequest.getCreditByAgentId
)
credit_route.patch(
    '/credit/approv-reject-credit/:creditRequestId',
    auth,
    creditRequest.approveRejectCredit
);




module.exports = credit_route;