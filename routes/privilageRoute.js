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
 *  /api/privilage/add-privilage:
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
 *                 example: "6538c030475692887584081e"
 *               privilagePlanName:
 *                 type: string
 *                 example: "Gold Plan"
 *               productPlanId:
 *                 type: string
 *                 example: "6538c0344756928875840835"
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

privilage_route.post('/privilage/add-privilage' , privilageValidation.privilageValidation , PrivilageController.storePrivilagePlan);

/**
 * @swagger
 * /api/privilage/privilage-list/:comapnyId:
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
privilage_route.get('/privilage/privilage-list/:comapnyId' , PrivilageController.getAllPrivilage);

module.exports = privilage_route;