const express = require("express");
const agency_group_route = express();
const bodyParser = require("body-parser");
agency_group_route.use(bodyParser.json());
agency_group_route.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");

const agencyGroupController = require("./../controllers/agencyGroup/agencyGroup.controller");

agency_group_route.post(
  "/agencyGroup/getAgencyGroup",
  auth,
  agencyGroupController.getAgencyGroup
);
agency_group_route.get(
  "/agencyGroup/getAgencyGroup",
  auth,
  agencyGroupController.getAgencyGroup
);
agency_group_route.patch(
  "/agencyGroup/editAgencyGroup/",
  auth,
  agencyGroupController.editAgencyGroup
);
agency_group_route.delete(
  "/agencyGroup/deleteAgencyGroup",
  auth,
  agencyGroupController.deleteAgencyGroup
);

module.exports = agency_group_route;
