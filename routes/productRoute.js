const express = require("express");
const product_route = express();
const bodyParser = require("body-parser");
product_route.use(bodyParser.json());
product_route.use(bodyParser.urlencoded({extended:true}));
const Product = require('../controllers/product/product.controller');
const auth = require("../middleware/auth");
const {productValidation} = require('../validation/product.validation');
//const productValidator = require('../validation/product.validation');



/**
 * @swagger
 * paths:
 *  /api/product/add-product:
 *    post:
 *      security:
 *      - bearerAuth: []
 *      summary: Add Product
 *      tags:  
 *          - Product 
 *      description: Add a product
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               productName:
 *                 type: string
 *                 example: "New Product Name"
 *      responses:
 *        "200":
 *          description: Product added successfully
 *        "401":
 *          description: User unauthorized
 *        "500":
 *          description: Server error
 */

product_route.post(
    '/product/add-product' ,
      productValidation ,
      auth,
      Product.storeProduct
);


/**
 * @swagger
 * /api/product/get-product:
 *   get:
 *     summary: Get all product
 *     tags:  
 *          - Product 
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: product list not available
 *       500:
 *         description: Internal server error
 */
product_route.get(
    '/product/get-product' ,
    auth,
     Product.getProduct
);

/**
 * @swagger
 * /api/product/update-product/{productId}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Update Product
 *     tags:
 *       - Product
 *     description: Update a product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product to be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 example: "Updated Product Name"
 *     responses:
 *       '200':
 *         description: Product updated successfully
 *       '401':
 *         description: Unauthorized. Please provide a valid token.
 *       '500':
 *         description: Internal server error. Something went wrong on our end.
 */


product_route.patch
    (
    '/product/update-product/:productId' ,
    auth,
     Product.updateProduct
    );


/**
 * @swagger
 * /api/product/delete-product/{productId}:
 *   delete:
 *     summary: Get delete product by product id
 *     tags:  
 *          - Product 
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: product deleted successfully
 *       500:
 *         description: Internal server error
 */
product_route.delete(
    '/product/delete-product/:productId' ,
    auth,
     Product.deleteProduct
);

module.exports = product_route;



