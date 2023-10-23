const express = require("express");
const credit_route = express();
const bodyParser = require("body-parser");
credit_route.use(bodyParser.json());
credit_route.use(bodyParser.urlencoded({extended:true}));
const creditRequest = require('../controllers/credit/creditRequest.controller');
const creditRequestValidator = require('../validation/creditRequest.validation');

/**
 * @swagger
 * paths:
 *  /api/add-credit-request:
 *    post:
 *      security:
 *      - bearerAuth: []
 *      summary: For add credit request
 *      tags: [Add credit request]
 *      description: Add credit request
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *               companyId:
 *                 type: mongoose.Schema.Types.ObjectId
 *               date:
 *                 type: date
 *               duration:
 *                 type: string
 *               purpose:
 *                 type: string
 *               amount:
 *                 type: number
 *               utilizeAmount:
 *                 type: number
 *               remarks:
 *                 type: string
 *               expireDate:
 *                 type: date
 *               createdDate:
 *                 type: date
 *               createdBy:
 *                 type: mongoose.Schema.Types.ObjectId
 *               requestedAmount:
 *                 type: number   
 *      responses:
 *        "200":
 *          description: credit added Sucessfully
 *        "401":
 *          description: user unutharized
 *        "500":
 *          description: server error
 */
credit_route.post('/add-credit-request' , 
creditRequestValidator.creditValidation , 
creditRequest.storeCreditRequest);



/**
 * @swagger
 * /api/get-all-credit-request:
 *   get:
 *     summary: Get all credit requests
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Credit request not available
 *       500:
 *         description: Internal server error
 */

credit_route.get('/get-all-credit-request' , 
creditRequest.getAllCreditRequest)


/**
 * @swagger
 * /api/get-credit-by-compnay/651f88e66be7808dd4bbdd70:
 *   get:
 *     summary: Get  credit requests by company id
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Credit request not available
 *       500:
 *         description: Internal server error
 */
credit_route.get('/get-credit-by-compnay/:companyId' , 
creditRequest.getCreditByCompanyId)





module.exports = credit_route;