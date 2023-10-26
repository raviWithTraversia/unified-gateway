const express = require("express");
const city_route = express();
const bodyParser = require("body-parser");
city_route.use(bodyParser.json());
city_route.use(bodyParser.urlencoded({extended:true}));

const City = require('./../controllers/city/city.controller')

/**
 * @swagger
 * /api/get-city-list/6538c05d4756928875842b14:
 *   get:
 *     summary: Get City requests by stateId
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: CIty not available
 *       500:
 *         description: Internal server error
 */
city_route.get('/get-city-list/:stateId' , City.cityListByState);
module.exports = city_route