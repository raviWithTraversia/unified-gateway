const express = require("express");
const product_route = express();
const bodyParser = require("body-parser");
product_route.use(bodyParser.json());
product_route.use(bodyParser.urlencoded({extended:true}));
const Product = require('../controllers/product/product.controller');

const {productValidation} = require('../validation/product.validation');
const productValidator = require('../validation/product.validation');



/**
 * @swagger
 * paths:
 *  /api/product:
 *    post:
 *      security:
 *      - bearerAuth: []
 *      summary: Add Product
 *      tags: [Add Product]
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

product_route.post('/product' ,  productValidation ,Product.storeProduct);


/**
 * @swagger
 * /api/get-product:
 *   get:
 *     summary: Get all product
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: product list not available
 *       500:
 *         description: Internal server error
 */
product_route.get('/get-product' , Product.getProduct);

/**
 * @swagger
 * paths:
 *  /api/update-product/652668b5f907cef72e7ef26c:
 *    patch:
 *      security:
 *      - bearerAuth: []
 *      summary: Update Product
 *      tags: [Update Product]
 *      description: Update a product
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               productName:
 *                 type: string
 *                 example: "Updated Product Name"
 *      responses:
 *        "200":
 *          description: Product updated successfully
 *        "401":
 *          description: User unauthorized
 *        "500":
 *          description: Server error
 */

product_route.patch
    (
    '/update-product/:productId' ,
     Product.updateProduct
    );


/**
 * @swagger
 * /api/delete-product/6535f9432f082e753a5329f1:
 *   delete:
 *     summary: Get delete product by product id
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: product deleted successfully
 *       500:
 *         description: Internal server error
 */
product_route.delete('/delete-product/:productId' , Product.deleteProduct);

module.exports = product_route;



