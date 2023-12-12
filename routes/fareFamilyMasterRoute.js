const express = require("express");
const fare_family_route = express();
const bodyParser = require("body-parser");
fare_family_route.use(bodyParser.json());
fare_family_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");

const fareFamilyMaster = require('./../controllers/fareFamilyMaster/fareFamilyMaster.controller')


/**
 * @swagger
 * /api/fare/fare-family-list:
 *   get:
 *     summary: Get Fare Family List
 *     tags:
 *       - Fare Family
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Fare Family List for the specified country is not available
 *       500:
 *         description: Internal server error
 */

fare_family_route.get(
    '/fare/fare-family-list/:companyId' , 
    auth,
    fareFamilyMaster.getFareFamilyListData
);



module.exports = fare_family_route