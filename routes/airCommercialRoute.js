const express = require("express");
const air_commercial_route = express();
const bodyParser = require("body-parser");
air_commercial_route.use(bodyParser.json());
air_commercial_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");

const airCommercialController = require('./../controllers/airCommercial/airCommercial.controller');

air_commercial_route.post(
    '/commercial/air-commercial-store',
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


// Get data for commercial include exclude list
air_commercial_route.get(
    // '/commercial/get-include-exclude/:commercialAirPlanId/:airCommercialId',
    '/commercial/get-include-exclude/',
    auth,
    airCommercialController.getComIncExludeList
)


// Get Matrix list
air_commercial_route.get(
    '/commercial/matrix-list/:comercialPlanId/:airCommercialPlanId',
    auth,
    airCommercialController.matrixList
)


// Delete Commercial Single
air_commercial_route.delete(
    '/commercial/delete-air-commercial/:airComId',
    auth,
    airCommercialController.deleteAirCommercial
)

// Get Single Commercial Data By Air COmmercial 
air_commercial_route.get(
    '/commercial/get-signle-air-commercial-list/:airComId',
    auth,
    airCommercialController.getSingleAirComList
)


// Get Commercial log
air_commercial_route.get(
    '/commercial/commercial-log/:commercialId',
    auth,
    airCommercialController.getCommercialLog
)

air_commercial_route.patch(
    '/commercial/updateAirCommercialFilter',
    auth,
    airCommercialController.updateAirCommercialFilter
)

module.exports = air_commercial_route;