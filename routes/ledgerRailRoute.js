const express = require("express");
const ledger_route = express();
const bodyParser = require("body-parser");
ledger_route.use(bodyParser.json());
ledger_route.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");
const ledgerRailController = require("../controllers/ledgerRails/ledgerRail.controller");

ledger_route.post("/getRailLedger", ledgerRailController.getAllledger);
ledger_route.post(
  "/getLedgerRailReport",
  ledgerRailController.fetchLedgerReport
);

ledger_route.post("/transactionReport", ledgerRailController.transactionReport);
ledger_route.post(
  "/agentBalenceReport",
  ledgerRailController.getAllledgerbyDate
);

ledger_route.get("/test", auth, function (req, res) {
  res.status(200).json({ status: "success", msg: "this is test responce" });
});

// PanCard
// layout_route.post(
//     '/layout/pancard-detail',
//     layoutController.checkPanCardDataExist
//     )

module.exports = ledger_route;
