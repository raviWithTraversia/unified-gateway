const express = require("express");
const city_route = express();
const bodyParser = require("body-parser");
city_route.use(bodyParser.json());
city_route.use(bodyParser.urlencoded({extended:true}));
const City = require('./../controllers/city/city.controller')

/**
 * @swagger
 * /api/city/get-city-list/{stateId}:
 *   get:
 *     summary: Get City List by State ID
 *     tags:
 *       - Country State City
 *     parameters:
 *       - in: path
 *         name: stateId
 *         required: true
 *         description: The ID of the state for which the city list is requested.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: City list not available for the specified state.
 *       '500':
 *         description: Internal server error
 */

city_route.get(
    '/city/get-city-list/:stateId' ,
    City.cityListByState
);
module.exports = city_route