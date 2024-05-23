const express = require("express");
const ledger_route = express();
const bodyParser = require("body-parser");
ledger_route.use(bodyParser.json());
ledger_route.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");
const ledgetController = require('../controllers/ledget/ledger.controller')

ledger_route.post(
    '/getledger',
    ledgetController.getAllledger
)

ledger_route.post(
    '/transactionReport',
    ledgetController.transactionReport
)

ledger_route.get('/test', auth, function (req, res) {
    res.status(200).json({ status: "success", msg: "this is test responce" });
});



// PanCard
// layout_route.post(
//     '/layout/pancard-detail',
//     layoutController.checkPanCardDataExist
//     )

module.exports = ledger_route;