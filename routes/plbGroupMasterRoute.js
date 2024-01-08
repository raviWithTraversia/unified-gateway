const express = require("express");
const plb_group_route = express();
const bodyParser = require("body-parser");
plb_group_route.use(bodyParser.json());
plb_group_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const PLBGroup = require('../controllers/plbGroupMaster/plbGroupMaster.controller');

plb_group_route.post(
    '/plb/create-plb-group',
    auth,
    PLBGroup.addPLBMasterGroup
);

plb_group_route.patch(
    '/plb/update-plb-group-master/:plbGroupId',
    auth,
    PLBGroup.updatePLBGroup
)

plb_group_route.delete(
    '/plb/delete-plb-group-master/:id',
    auth,
    PLBGroup.deletePLBGroupMaster
)

plb_group_route.get(
    '/plb/plb-group-list/:companyId',
    auth,
    PLBGroup.getPLBGroupMasterList
)

plb_group_route.get(
    '/plb/plb-group-has-plb-master/:PLBGroupId',
    auth,
    PLBGroup.getPLBGroupHasMaster
)

plb_group_route.patch(
    '/plb/plb_master_is_define_default/:id',
    PLBGroup.isDefaultDefinePLBMaster
)

module.exports = plb_group_route;