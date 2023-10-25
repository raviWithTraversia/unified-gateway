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
 *      summary: For add privilage
 *      tags: [Add privilage]
 *      description: for add privilage
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *               companyId: 
 *                 type: mongoose.Schema.Types.ObjectId
 *               privilagePlanName:
 *                 type: string 
 *               productPlanId:
 *                 type: mongoose.Schema.Types.ObjectId 
 *               permission: 
 *                 type: mongoose.Schema.Types.ObjectId
 *      responses:
 *        "200":
 *          description: Privilage added Sucessfully
 *        "401":
 *          description: user unutharized
 *        "500":
 *          description: server error
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