const express = require("express");
const countryDial_route = express();
const bodyParser = require("body-parser");
countryDial_route.use(bodyParser.json());
countryDial_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");

const countryDialController = require('./../controllers/countryDialCode/countryDialCode.controller')


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

countryDial_route.get(
    '/countryDial/getCountryDialCode' ,
    countryDialController.getCountryDialCode
);
module.exports = countryDial_route