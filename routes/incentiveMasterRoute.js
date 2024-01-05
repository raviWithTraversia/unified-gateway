const express = require("express");
const incentive_master_route = express();
const bodyParser = require("body-parser");
incentive_master_route.use(bodyParser.json());
incentive_master_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const IncentiveMaster = require('./../controllers/incentiveMaster/incentiveMaster.controller');

incentive_master_route.post(
    '/incentive/store-incentive-master',
    auth,
    IncentiveMaster.storeIncentiveMaster
);

incentive_master_route.get(
    '/incentive/get-incentive-master-by-plb-types/:PLBType/:companyId',
    auth,
    IncentiveMaster.getIncentiveMasterList
)


incentive_master_route.patch(
    '/incentive/update-incentive-master/:id',
    auth,
    IncentiveMaster.updateIncentiveMaster
)


incentive_master_route.delete(
    '/incentive/incentive-master-delete/:id',
    auth,
    IncentiveMaster.deleteIncentiveMaster
)


incentive_master_route.get(
    '/incentive/copy-incentive-master/:id',
    auth,
    IncentiveMaster.copyIncentiveMaster
)

incentive_master_route.patch(
    '/incentive/define-incentive-master-default/:id',
    auth,
    IncentiveMaster.incentiveDefineIsDefault
)



module.exports = incentive_master_route;