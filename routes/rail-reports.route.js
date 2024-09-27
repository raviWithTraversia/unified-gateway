const { Router } = require("express");
const {
  fetchRailReports,
} = require("../controllers/rail/rail-reports.controller");

const router = Router();

router.post("/rail-reports", fetchRailReports);
module.exports = router;
