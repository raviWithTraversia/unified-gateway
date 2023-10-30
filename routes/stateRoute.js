const express = require("express");
const state_route = express();
const bodyParser = require("body-parser");
state_route.use(bodyParser.json());
state_route.use(bodyParser.urlencoded({extended:true}));

const State = require('./../controllers/state/state.controller')

/**
 * @swagger
 * /api/state/get-state-list/{countryId}:
 *   get:
 *     summary: Get state requests by country ID
 *     tags:
 *       - Country State City
 *     parameters:
 *       - in: path
 *         name: countryId
 *         required: true
 *         description: The ID of the country for which state requests are made.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: State information is not available
 *       '500':
 *         description: Internal server error
 */

state_route.get('/state/get-state-list/:countryId' , State.stateListByCountry);
module.exports = state_route