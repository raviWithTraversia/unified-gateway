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
 *      summary: Add Credit Request
 *      tags: [Add credit request]
 *      description: Add credit request
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               companyId:
 *                 type: string
 *                 example: "651f88e66be7808dd4bbdd70"
 *               date:
 *                 type: string
 *                 example: "2023-10-25"
 *               duration:
 *                 type: string
 *                 example: "20 hours"
 *               purpose:
 *                 type: string
 *                 example: "Testing"
 *               amount:
 *                 type: number
 *                 example: 3000
 *               utilizeAmount:
 *                 type: number
 *                 example: 3000
 *               remarks:
 *                 type: string 
 *                 example: "Remark"
 *               expireDate:
 *                 type: string
 *                 example: "2023-11-25"
 *               createdDate:
 *                 type: string
 *                 example: "2023-11-25"
 *               createdBy:
 *                 type: string
 *                 example: "651f88e66be7808dd4bbdd72"
 *               requestedAmount:
 *                 type: number
 *                 example: 3000   
 *      responses:
 *        "200":
 *          description: Credit added successfully
 *        "401":
 *          description: User unauthorized
 *        "500":
 *          description: Server error
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

credit_route.get(
    '/get-all-credit-request' , 
    creditRequest.getAllCreditRequest
)


credit_route.get('/get-credit-by-compnay/:companyId' , 
creditRequest.getCreditByCompanyId)





module.exports = credit_route;