const express = require("express");
const commercial_air_plan_route = express();
const bodyParser = require("body-parser");
commercial_air_plan_route.use(bodyParser.json());
commercial_air_plan_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");

const commercialAirPlan = require('./../controllers/commercialAirPlan/commercialAirPlan.controller');


// route store commercial air plan

/**
 * @swagger
 * paths:
 *  /api/commercial/store-commercial-air-plan:
 *    post:
 *      security:
 *      - bearerAuth: []
 *      summary: Commercial Air Plan Store
 *      tags: 
 *         - Commercial
 *      description: Add commercial air plan
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               commercialPlanName:
 *                 type: "string"
 *                 example: "Testing new Plan"
 *               companyId:
 *                 type: string
 *                 example: "6538c030475692887584081e"
 *               modifiedBy:
 *                 type: string
 *                 example: "6538c0314756928875840820"
 *               modifiedDate:
 *                 type: string
 *                 example: "2023-11-25"
 *      responses:
 *        "200":
 *          description: Commercial air plan stored successfully
 *        "401":
 *          description: Unauthorized access
 *        "500":
 *          description: Server error
 */
commercial_air_plan_route.post(
    '/commercial/store-commercial-air-plan' ,
    auth,
    commercialAirPlan.storeCommercialAirPlan
);

// route get commercial air plan by companyId

/**
 * @swagger
 * /api/commercial/get-commercial-air-plan/{companyId}:
 *   get:
 *     summary: Get commercial air plan by companyId
 *     tags:
 *       - Commercial
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         description: The ID of the commercial air plan for which the commercial air plan is requested.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Commercial air plan not available for the specified company ID.
 *       '500':
 *         description: Internal server error
 */
commercial_air_plan_route.get(
    '/commercial/get-commercial-air-plan/:companyId',
    auth,
    commercialAirPlan.getCommercialAirPlanByCompanyId
)

// route patch for update commercial air plan by commercialAirPlanId

/**
 * @swagger
 * paths:
 *  /api/commercial/update-commercial-air-plan/{commercialAirPlanId}:
 *    patch:
 *      security:
 *      - bearerAuth: []
 *      summary: Update Commercial Air Plan
 *      tags: 
 *         - Commercial
 *      description: Update an existing commercial air plan
 *      parameters:
 *        - in: path
 *          name: commercialAirPlanId
 *          required: true
 *          description: The ID of the commercial air plan to update.
 *          schema:
 *            type: string
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               commercialPlanName:
 *                 type: string
 *                 example: "Testing new Plan"
 *               status:
 *                 type: boolean
 *                 example: false
 *               companyId:
 *                 type: string
 *                 example: "6538c030475692887584081e"
 *      responses:
 *        "200":
 *          description: Commercial air plan updated successfully
 *        "401":
 *          description: Unauthorized access
 *        "500":
 *          description: Server error
 */
commercial_air_plan_route.patch(
    '/commercial/update-commercial-air-plan/:commercialAirPlanId',
    auth,
    commercialAirPlan.updateCommercialAirPlan
)

// Route patch for defaine IsDefault commercial air plan by commercialAirPlanId

/**
 * @swagger
 * paths:
 *  /api/commercial/isdefine-commercial-air-plan-update/{commercialAirPlanId}:
 *    patch:
 *      security:
 *      - bearerAuth: []
 *      summary: Update IsDefine Commercial Air Plan
 *      tags: 
 *         - Commercial
 *      description: Update the "IsDefine" property of an existing commercial air plan
 *      parameters:
 *        - in: path
 *          name: commercialAirPlanId
 *          required: true
 *          description: The ID of the commercial air plan to update.
 *          schema:
 *            type: string
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               companyId:
 *                 type: string
 *                 example: "6538c030475692887584081e"
 *      responses:
 *        "200":
 *          description: Commercial air plan updated successfully
 *        "401":
 *          description: Unauthorized access
 *        "500":
 *          description: Server error
 */

commercial_air_plan_route.patch(
    '/commercial/isdefine-commercial-air-plan-update/:commercialAirPlanId',
    auth,
    commercialAirPlan.isDefaultCommercialAirPlan
)

module.exports = commercial_air_plan_route;