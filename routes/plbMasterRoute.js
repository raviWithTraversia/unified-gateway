const express = require("express");
const plb_route = express();
const bodyParser = require("body-parser");
plb_route.use(bodyParser.json());
plb_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const PLBMaster = require('./../controllers/plbMaster/plbMaster.controller');

plb_route.post(
    '/plb/store-plb-master',
    auth,
    PLBMaster.storePLBMaster
);

plb_route.get(
    '/plb/get-plb-by-plb-types/:PLBType/:companyId',
    auth,
    PLBMaster.getPLBMasterList
)


plb_route.patch(
    '/plb/update-plb-master/:id',
    auth,
    PLBMaster.updatePLBMaster
)


plb_route.delete(
    '/plb/plb-master-delete/:id',
    auth,
    PLBMaster.deletePLBMaster
)


plb_route.get(
    '/plb/copy-plb-master/:id',
    auth,
    PLBMaster.copyPLBMaster
)

// isDefault route for PLB master
plb_route.patch(
    '/plb/plb_master_is_default/:id',
    PLBMaster.PLBDefineIsDefault
)

module.exports = plb_route;