const express = require("express");
const seriesDepartureGroup_route = express();
const bodyParser = require("body-parser");
seriesDepartureGroup_route.use(bodyParser.json());
seriesDepartureGroup_route.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");
const seriesDepartureGroupController = require("../controllers/seriesDepartureGroup/seriesDepartureGroup.controller");
seriesDepartureGroup_route.post(
  "/seriesDepartureGroup/addSeriesDepartureGroup",
 seriesDepartureGroupController.addSeriesDepartureGroup
);

seriesDepartureGroup_route.get(
  "/seriesDepartureGroup/getSeriesDepartureGroup",
  seriesDepartureGroupController.getSeriesDepartureGroup
);

seriesDepartureGroup_route.patch(
    "/seriesDepartureGroup/updatedSeriesDepartureGroup",
    seriesDepartureGroupController.updatedSeriesDepartureGroup
  );
  



seriesDepartureGroup_route.get("/test", auth, function (req, res) {
  res.status(200).json({ status: "success", msg: "this is test responce" });
});

module.exports = seriesDepartureGroup_route;
