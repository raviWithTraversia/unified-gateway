const express = require("express");
const product__plan_route = express();
const bodyParser = require("body-parser");
product__plan_route.use(bodyParser.json());
product__plan_route.use(bodyParser.urlencoded({extended:true}));
const ProductPlan = require('../controllers/productPlan/productPlan.controller');

const productValidator = require('../validation/product.validation');


// Product Plan route created by alam Shah

 /**
 * @swagger
 * paths:
 *  /api/product-plan:
 *    post:
 *      security:
 *      - bearerAuth: []
 *      summary: Add Product Plan
 *      tags: [Add Product Plan]
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
 *                 example: "651f88e66be7808dd4bbdd70"
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


product__plan_route.post('/product-plan' , productValidator.productPlanValidation ,ProductPlan.addProductPlan);


/**
 * @swagger
 * /api/all-product-plan:
 *   get:
 *     summary: Get all-product-plan list
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: product plan list not available
 *       500:
 *         description: Internal server error
 */
product__plan_route.get('/all-product-plan' , ProductPlan.retriveProductPlan);



/**
 * @swagger
 * paths:
 *  /api/update-product-plan/6535f8c10bf61741d3617400:
 *    patch:
 *      security:
 *      - bearerAuth: []
 *      summary: Update Product Plan
 *      tags: [Update Product Plan]
 *      description: Update a product plan
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               productPlanName:
 *                 type: string
 *                 example: "Updated Product Plan Name"
 *      responses:
 *        "200":
 *          description: Product plan updated successfully
 *        "401":
 *          description: User unauthorized
 *        "500":
 *          description: Server error
 */

product__plan_route.patch('/update-product-plan/:producPlantId' , ProductPlan.updateProductPlan);


module.exports = product__plan_route;



