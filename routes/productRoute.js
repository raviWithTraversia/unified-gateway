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
 *      summary: For add product
 *      tags: [Add Product]
 *      description: for add product
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *               productName:
 *                 type: string
 *      responses:
 *        "200":
 *          description: Product added successfully
 *        "401":
 *          description: user unutharized
 *        "500":
 *          description: server error
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
 *      summary: For product update
 *      tags: [Update Product]
 *      description: for product update
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *               productName:
 *                 type: string
 *      responses:
 *        "200":
 *          description: Product updated successfully
 *        "401":
 *          description: user unutharized
 *        "500":
 *          description: server error
 */
product_route.patch('/update-product/:productId' , Product.updateProduct);


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



