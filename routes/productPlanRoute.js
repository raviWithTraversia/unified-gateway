const express = require("express");
const product_plan_route = express();
const bodyParser = require("body-parser");
product_plan_route.use(bodyParser.json());
product_plan_route.use(bodyParser.urlencoded({extended:true}));
const ProductPlan = require('../controllers/productPlan/productPlan.controller');
const auth = require("../middleware/auth");
//const productValidator = require('../validation/product.validation');


// Product Plan route created by alam Shah

 /**
 * @swagger
 * paths:
 *  /api/product/product-plan:
 *    post:
 *      security:
 *      - bearerAuth: []
 *      summary: Add Product Plan
 *      tags:  
 *          - Product Plan
 *      description: Add a product plan
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               productPlanName:
 *                 type: string
 *                 example: "Gold Plan"
 *               companyId:
 *                 type: string
 *                 example: "6538c030475692887584081e"
 *               product:
 *                 type: array
 *                 example:
 *                 - productId: "6524e5ef01aa7477c0ae9461"
 *                 - productId: "6524e5ef01aa7477c0ae9462"
 *      responses:
 *        "200":
 *          description: Product plan added successfully
 *        "401":
 *          description: User unauthorized
 *        "500":
 *          description: Server error
 */


 product_plan_route.post(
    '/product/product-plan', 
    auth,
    ProductPlan.addProductPlan
);


/**
 * @swagger
 * /api/product/all-product-plan:
 *   get:
 *     summary: Get all-product-plan list
 *     tags:  
 *          - Product Plan
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: product plan list not available
 *       500:
 *         description: Internal server error
 */
product_plan_route.get(
    '/product/all-product-plan/:companyId' ,
    auth,
    ProductPlan.getAllProductPlan
);



/**
 * @swagger
 * /api/product/update-product-plan/{productPlanId}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Update Product Plan
 *     tags:
 *       - Product Plan
 *     description: Update a product plan
 *     parameters:
 *       - in: path
 *         name: productPlanId
 *         required: true
 *         description: The ID of the product plan to be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productPlanName:
 *                 type: string
 *                 example: "Updated Product Plan Name"
 *               product:
 *                 type: array
 *                 example:
 *                 - productId: "6524e5ef01aa7477c0ae9461"
 *                 - productId: "6524e5ef01aa7477c0ae9462"
 *     responses:
 *       '200':
 *         description: Product plan updated successfully
 *       '401':
 *         description: Unauthorized. Please provide a valid token.
 *       '500':
 *         description: Internal server error. Something went wrong on our end.
 */


product_plan_route.patch(
    '/product/update-product-plan/:producPlanId' ,
    auth,
     ProductPlan.productPlanUpdateById
);


product_plan_route.get(
    '/product/all-product-plan-detail/:companyId' ,
    auth,
    ProductPlan.getAllProductPlanDetail
);

module.exports = product_plan_route;



