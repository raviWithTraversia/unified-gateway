const express = require("express");
const deposit_route = express();
const bodyParser = require("body-parser");
deposit_route.use(bodyParser.json());
deposit_route.use(bodyParser.urlencoded({ extended: true }));
const depositRequest = require('../controllers/depositRequest/depositRequest.controller');
const auth = require("../middleware/auth");

deposit_route.post('/deposit/add-deposit-request', depositRequest.storeDepositRequest);
// deposit_route.post('/credit/wallettopup', creditRequest.wallettopup);

deposit_route.get(
    '/deposit/get-all-deposit-request',
    depositRequest.getAllDepositRequest
)

deposit_route.get(
    '/deposit/get-deposit-by-compnay/:companyId',
    depositRequest.getDepositByCompanyId
)

deposit_route.get(
    '/deposit/get-deposit-by-agency/:companyId',
    depositRequest.getDepositByagencyId
)


deposit_route.patch(
    '/deposit/approv-reject-deposit/:creditRequestId', auth,
    depositRequest.approveRejectDeposit
);

deposit_route.post(
    '/deposit/depositAmountUsingExcel', auth,
    depositRequest.depositAmountUsingExcel
);


module.exports = deposit_route;