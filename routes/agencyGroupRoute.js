const express = require("express");
const agency_group_route = express();
const bodyParser = require("body-parser");
agency_group_route.use(bodyParser.json());
agency_group_route.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");

const agencyGroupController = require("./../controllers/agencyGroup/agencyGroup.controller");

agency_group_route.post(
  "/agencyGroup/addAgencyGroup",
  auth,
  agencyGroupController.addAgencyGroup
);
agency_group_route.get(
  "/agencyGroup/getAgencyGroup",
  auth,
  agencyGroupController.getAgencyGroup
);
agency_group_route.patch(
  "/agencyGroup/editAgencyGroup",
  auth,
  agencyGroupController.editAgencyGroup
);
agency_group_route.delete(
  "/agencyGroup/deleteAgencyGroup",
  auth,
  agencyGroupController.deleteAgencyGroup
);
agency_group_route.patch(
  "/agencyGroup/assignAgencyGroup",
  auth,
  agencyGroupController.assignAgencyGroup
);

agency_group_route.get(
  "/agencyGroup/getAssignAgencyGroup",
  auth,
  agencyGroupController.getAssignAgencyGroup
);



module.exports = agency_group_route;
