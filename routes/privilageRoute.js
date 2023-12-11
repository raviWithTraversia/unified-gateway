const express = require("express");
const privilage_route = express();
const bodyParser = require("body-parser");
privilage_route.use(bodyParser.json());
privilage_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
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
 *      tags:  
 *          - Privilage
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

privilage_route.post(
    '/privilage/add-privilage' ,
     auth,
      PrivilageController.storePrivilagePlan
);

/**
 * @swagger
 * /api/privilage/privilage-list/{companyId}:
 *   get:
 *     summary: Get privilege list by company ID
 *     tags:
 *       - Privilage
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         description: The ID of the company for which privilege list is requested.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Privilege list not available for the specified company.
 *       '500':
 *         description: Internal server error
 */

privilage_route.get(
    '/privilage/privilage-list/:comapnyId' ,
   // auth,
     PrivilageController.getAllPrivilage    
    );

  
/**
 * @swagger
 * /api/privilage/privilage-list-by-product-plan-id/{productPlanId}:
 *   get:
 *     summary: Get privilege list by product plan ID
 *     tags:
 *       - Privilage
 *     parameters:
 *       - in: path
 *         name: productPlanId
 *         required: true
 *         description: The ID of the product plan for which the privilege list is requested.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Privilege list not available for the specified product plan.
 *       '500':
 *         description: Internal server error
 */

    
privilage_route.get(
    '/privilage/privilage-list-by-product-plan-id/:productPlanId' ,
    auth,
    PrivilageController.privilagePlanByProductId    
    );    

//Get privilagePlanHasPermission by privilagePlanId Route

/**
 * @swagger
 * /api/privilage/privilage-list-by-privilage-plan-id/{privilagePlanId}:
 *   get:
 *     summary: Get privilege list by privilage plan ID
 *     tags:
 *       - Privilage
 *     parameters:
 *       - in: path
 *         name: privilagePlanId
 *         required: true
 *         description: The ID of the privilage plan for which the privilege list is requested.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Privilege list not available for the specified privilage plan.
 *       '500':
 *         description: Internal server error
 */

privilage_route.get(
    '/privilage/privilage-list-by-privilage-plan-id/:privilagePlanId' ,
    auth,
    PrivilageController.privilagePlanHasPermission
    );


// Patch request

/**
 * @swagger
 * paths:
 *  /api/privilage/privilage-plan-update/{privilagePlanId}:
 *    patch:
 *      security:
 *      - bearerAuth: []
 *      summary: Update Privilage Plan
 *      tags:
 *          - Privilage
 *      description: Update a privilege plan
 *      parameters:
 *        - in: path
 *          name: privilagePlanId
 *          required: true
 *          description: The ID of the privilege plan to update.
 *          schema:
 *            type: string
 *            example: "6538c030475692887584081e"
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                companyId:
 *                  type: string
 *                  example: "6538c030475692887584081e"
 *                privilagePlanName:
 *                  type: string
 *                  example: "Gold Plan"
 *                productPlanId:
 *                  type: string
 *                  example: "653b9059004569a18e2bf2eb"
 *                permission:
 *                  type: array
 *                  example: 
 *                  - permissionId: "65279684247eec0c6d53df94"
 *                  - permissionId: "65279684247eec0c6d53df95"
 *      responses:
 *        "200":
 *          description: Privilege plan updated successfully
 *        "401":
 *          description: User unauthorized
 *        "500":
 *          description: Server error
 */

privilage_route.patch(
    '/privilage/privilage-plan-update/:privilagePlanId' ,
    auth,
    PrivilageController.updatePrivilagePlan
    )


privilage_route.patch(
    '/privilage/privilage-isdefault-update/:privilagePlanId',
    auth,
    PrivilageController.isDefaultPrivilagePlan
)    

module.exports = privilage_route;