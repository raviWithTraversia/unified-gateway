const express = require("express");
const privilage_route = express();
const bodyParser = require("body-parser");
privilage_route.use(bodyParser.json());
privilage_route.use(bodyParser.urlencoded({extended:true}));

const PrivilageController = require('../controllers/privilage/privilage.plan.controller');
const privilageValidation = require('../validation/privilage.validation');

// Route process for privilage by alam Shah

/**
 * @swagger
 * paths:
 *  /api/privilage:
 *    post:
 *      security:
 *      - bearerAuth: []
 *      summary: Add Privilage
 *      tags: [Add Privilage]
 *      description: Add a privilege
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               companyId:
 *                 type: string
 *                 example: "651f88e66be7808dd4bbdd70"
 *               privilagePlanName:
 *                 type: string
 *                 example: "Gold Plan"
 *               productPlanId:
 *                 type: string
 *                 example: "6527c433614fd1befd4d5ef0"
 *               permission:
 *                 type: array
 *                 example: 
 *                 - permissionId: "65279684247eec0c6d53df94"
 *                 - permissionId: "65279684247eec0c6d53df95"
 *      responses:
 *        "200":
 *          description: Privilage added successfully
 *        "401":
 *          description: User unauthorized
 *        "500":
 *          description: Server error
 */

privilage_route.post('/privilage' , privilageValidation.privilageValidation , PrivilageController.storePrivilagePlan);

/**
 * @swagger
 * /api/privilage-list/651f88e66be7808dd4bbdd70:
 *   get:
 *     summary: Get privilage-list by company id
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: privilage-list not available
 *       500:
 *         description: Internal server error
 */
privilage_route.get('/privilage-list/:comapnyId' , PrivilageController.getAllPrivilage);

module.exports = privilage_route;