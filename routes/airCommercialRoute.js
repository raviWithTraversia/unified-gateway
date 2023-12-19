const express = require("express");
const air_commercial_route = express();
const bodyParser = require("body-parser");
air_commercial_route.use(bodyParser.json());
air_commercial_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");

const airCommercialController = require('./../controllers/airCommercial/airCommercial.controller');

air_commercial_route.post(
    '/commercial/air-commercial-store' ,
    auth,
    airCommercialController.storeAirCommercial
);

air_commercial_route.get(
    '/commercial/air-commercial-coloumn-get',
    auth,
    airCommercialController.getColoumnData
)

air_commercial_route.get(
    '/commercial/air-commercial-row-get',
    auth,
    airCommercialController.getRowData
)

air_commercial_route.post(
    '/commercial/add-commercial-type',
    auth,
    airCommercialController.commercialTypeAdd
)

air_commercial_route.get(
    '/commercial/air-commercial-detail',
    auth,
    airCommercialController.commercialDetailList
)


air_commercial_route.post(
    '/commercial/commercial-add-row-coloumn',
    auth,
    airCommercialController.addRowColoumn
)


air_commercial_route.post(
    '/commercial/commercial-update-matrix',
    auth,
    airCommercialController.updateMatrix
)


// Get AirCommercialList
air_commercial_route.get(
    '/commercial/air-commercial-get-list/:airCommercialPlanId',
    auth,
    airCommercialController.getAirCommercialListByCommercialId
)


// Add Commercial Filter include and exclude
air_commercial_route.post(
    '/commercial/add-commercial-filter',
    auth,
    airCommercialController.addCommercialFilterInEx
)


air_commercial_route.get(
    '/commercial/air-commercial-include-exclude-list',
    auth,
    airCommercialController.getCommercialIncExc
)

module.exports = air_commercial_route;