const express = require("express");
const state_route = express();
const bodyParser = require("body-parser");
state_route.use(bodyParser.json());
state_route.use(bodyParser.urlencoded({extended:true}));

const State = require('./../controllers/state/state.controller')

/**
 * @swagger
 * /api/get-state-list/6538c03847569288758408b8:
 *   get:
 *     summary: Get state requests by counrtyId
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: State not available
 *       500:
 *         description: Internal server error
 */
state_route.get('/get-state-list/:countryId' , State.stateListByCountry);
module.exports = state_route