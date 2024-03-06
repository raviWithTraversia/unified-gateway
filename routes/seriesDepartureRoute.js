const express = require("express");
const seriesDeparture_route = express();
const bodyParser = require("body-parser");
seriesDeparture_route.use(bodyParser.json());
seriesDeparture_route.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");
const seriesDepartureGroupController = require("../controllers/seriesDeparture/seriesDeparture.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
seriesDeparture_route.post(
  "/seriesDeparture/addFixedDepartureTicket",
  upload.single('ticket'),
  seriesDepartureGroupController.addFixedDepartureTicket
);

seriesDeparture_route.get(
  "/seriesDeparture/getFixedDepartureTicket",
  seriesDepartureGroupController.getFixedDepartureTicket
);

seriesDeparture_route.patch(
  "/seriesDeparture/updateFixedDepartureTicket",
  seriesDepartureGroupController.updateFixedDepartureTicket
);


seriesDeparture_route.get("/test", auth, function (req, res) {
  res.status(200).json({ status: "success", msg: "this is test responce" });
});

module.exports = seriesDeparture_route;
