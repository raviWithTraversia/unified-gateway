const express = require("express");
const country_route = express();
const bodyParser = require("body-parser");
country_route.use(bodyParser.json());
country_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");

const Country = require('./../controllers/country/country.controller')


/**
 * @swagger
 * /api/country/all-country-list:
 *   get:
 *     summary: Country 
 *     tags:
 *       - Country State City
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Country not available
 *       500:
 *         description: Internal server error
 */

country_route.get(
    '/country/all-country-list' ,
    Country.countryList
);
module.exports = country_route