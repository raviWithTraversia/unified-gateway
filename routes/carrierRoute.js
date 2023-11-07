const express = require("express");
const carrier_route = express();
const bodyParser = require("body-parser");
carrier_route.use(bodyParser.json());
carrier_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");

const carrierController = require('./../controllers/carrier/carrier.controller');


/**
 * @swagger
 * /api/carrier/get-carrier-list:
 *   get:
 *     summary: Carrier List Data 
 *     tags:
 *       - Carrier
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Country not available
 *       500:
 *         description: Internal server error
 */

carrier_route.get(
    '/carrier/get-carrier-list' ,
    auth,
    carrierController.getCarrierList
)

module.exports = carrier_route;