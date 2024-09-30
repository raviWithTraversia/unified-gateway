const { Router } = require("express");

const RailCommercialController=require('../controllers/rail/railCommercial/railcommercial.controller')
const router = Router();
router.post("/rail/rail-commercial-create", RailCommercialController.createCommercialPlan);
router.get("/rail/rail-commercial-findAll/:companyId",RailCommercialController.FindTmcCommercial)
router.get("/rail/rail-commercial-findOne/:id",RailCommercialController.FindOneCommercial)
router.patch("/rail/rail-commercial-update/:id",RailCommercialController.updateOneCommercial)




module.exports = router;
