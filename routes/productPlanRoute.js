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
 *      summary: For add product plan
 *      tags: [Add product Plan]
 *      description: for add product plan
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *               productPlanName:
 *                 type: string
 *               companyId:
 *                 type: mongoose.Schema.Types.ObjectId  
 *               product:
 *                 type: mongoose.Schema.Types.ObjectId
 *      responses:
 *        "200":
 *          description: product plan added Sucessfully
 *        "401":
 *          description: user unutharized
 *        "500":
 *          description: server error
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
 *      summary: For update product plan
 *      tags: [Update product Plan]
 *      description: For update product plan
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *               productPlanName:
 *                 type: string
 *      responses:
 *        "200":
 *          description: product plan updated Sucessfully
 *        "401":
 *          description: user unutharized
 *        "500":
 *          description: server error
 */
product__plan_route.patch('/update-product-plan/:producPlantId' , ProductPlan.updateProductPlan);


module.exports = product__plan_route;



