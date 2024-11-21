const { Router } = require("express");
const {
  fetchRailReports,
} = require("../controllers/rail/rail-reports.controller");

const railController=require('../controllers/rail/rail.controller')
const router = Router();

router.post("/rail-reports", fetchRailReports);
router.get('/rail/getBillingData', railController.getBillingRailData)
router.post("/rail/updateBillPost",railController.updateBillPost)
module.exports = router;
