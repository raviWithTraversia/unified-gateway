const express = require("express");
const cabin_class_route = express();
const bodyParser = require("body-parser");
cabin_class_route.use(bodyParser.json());
cabin_class_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");

const CabinClass = require('../controllers/cabinClassMaster/cabinClassMaster.controller')

/**
 * @swagger
 * /api/cabin/get-all-cabin:
 *   get:
 *     summary: Retrieve a list of cabin classes
 *     tags:
 *       - Cabin
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of cabin classes
 *       404:
 *         description: Cabin class list not available
 *       500:
 *         description: Internal server error
 */

cabin_class_route.get(
    '/cabin/get-all-cabin' ,
    auth,
     CabinClass.cabinList
);
module.exports = cabin_class_route