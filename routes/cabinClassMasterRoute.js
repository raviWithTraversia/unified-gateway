const express = require("express");
const cabin_class_route = express();
const bodyParser = require("body-parser");
cabin_class_route.use(bodyParser.json());
cabin_class_route.use(bodyParser.urlencoded({extended:true}));

const CabinClass = require('../controllers/cabinClassMaster/cabinClassMaster.controller')

/**
 * @swagger
 * /api/cabin/get-all-cabin:
 *   get:
 *     summary: Get all cabin class master
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: cabin class list not available
 *       500:
 *         description: Internal server error
 */
cabin_class_route.get('/cabin/get-all-cabin' , CabinClass.cabinList);
module.exports = cabin_class_route