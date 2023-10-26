const express = require("express");
const country_route = express();
const bodyParser = require("body-parser");
country_route.use(bodyParser.json());
country_route.use(bodyParser.urlencoded({extended:true}));

const Country = require('./../controllers/country/country.controller')


/**
 * @swagger
 * /api/all-country-list:
 *   get:
 *     summary: Get all country 
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Country not available
 *       500:
 *         description: Internal server error
 */

country_route.get('/all-country-list' , Country.countryList);
module.exports = country_route