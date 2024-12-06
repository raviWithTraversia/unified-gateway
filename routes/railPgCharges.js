const { Router } = require("express");
const auth=require('../middleware/auth')
const railPgCharges=require('../controllers/rail/railPgCharges/railPgCharges.controller')
const router = Router();
router.post(
    '/rail/addPgCharges',
    auth,
    railPgCharges.addPgCharges
);
router.patch(
    '/rail/updatePgCharges',
    auth,
    railPgCharges.editPgcharges
);
router.get(
    '/rail/calculateCharge',
    railPgCharges.calculatePgCharges
);
router.get(
    '/rail/getPgCharges',
    railPgCharges.getPgCharges
)




module.exports = router;