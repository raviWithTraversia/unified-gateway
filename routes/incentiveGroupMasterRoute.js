const express = require("express");
const incentive_group_route = express();
const bodyParser = require("body-parser");
incentive_group_route.use(bodyParser.json());
incentive_group_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const IncentiveGroupMaster = require('../controllers/incentiveGroupMaster/incentiveGroupMaster.controller');

incentive_group_route.post(
    '/incentive/create-incentive-group',
    auth,
    IncentiveGroupMaster.addIncMasterGroup
);

incentive_group_route.patch(
    '/incentive/update-incentive-group-master/:incentiveGroupId',
    auth,
    IncentiveGroupMaster.updateIncGroupMaster
)

incentive_group_route.delete(
    '/incentive/delete-incentive-group-master/:id',
    auth,
    IncentiveGroupMaster.deleteIncGroupMaster
)

incentive_group_route.get(
    '/incentive/incentive-group-list/:companyId',
    auth,
    IncentiveGroupMaster.getIncGroupMasterList
)

incentive_group_route.get(
    '/incentive/incentive-group-has-incentive-master/:incentiveGroupId',
    auth,
    IncentiveGroupMaster.getIncGroupHasIncMaster
)

incentive_group_route.patch(
    '/incentive/incentive-group-master-define-default/:id',
    auth,
    IncentiveGroupMaster.incentiveGroupDefault
)

module.exports = incentive_group_route;