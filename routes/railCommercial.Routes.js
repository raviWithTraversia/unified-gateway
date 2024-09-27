const { Router } = require("express");

const RailCommercialController=require('../controllers/rail/railCommercial/railcommercial.controller')
const router = Router();
router.post("/rail/rail-commercial", RailCommercialController.createCommercialPlan);


module.exports = router;
