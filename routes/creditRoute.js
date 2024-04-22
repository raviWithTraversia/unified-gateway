const express = require("express");
const credit_route = express();
const bodyParser = require("body-parser");
credit_route.use(bodyParser.json());
credit_route.use(bodyParser.urlencoded({extended:true}));
const creditRequest = require('../controllers/credit/creditRequest.controller');
const creditRequestValidator = require('../validation/creditRequest.validation');
const auth = require("../middleware/auth");

/**
 * @swagger
 * paths:
 *  /api/credit/add-credit-request:
 *    post:
 *      security:
 *      - bearerAuth: []
 *      summary: Credit Request
 *      tags: 
 *         - Credit request
 *      description: Add credit request
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               companyId:
 *                 type: string
 *                 example: "6538c030475692887584081e"
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
 *                 example: "6538c0314756928875840820"
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


credit_route.post('/credit/add-credit-request', creditRequest.storeCreditRequest);
credit_route.post('/credit/wallettopup', creditRequest.wallettopup);


/**
 * @swagger
 * /api/credit/get-all-credit-request:
 *   get:
 *     summary: Credit Request
 *     tags: 
 *         - Credit request
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Credit request not available
 *       500:
 *         description: Internal server error
 */

credit_route.get(
    '/credit/get-all-credit-request', 
    auth,
    creditRequest.getAllCreditRequest
)

/**
 * @swagger
 * /api/credit/get-credit-by-compnay/{companyId}:
 *   get:
 *     summary: Get all credit requests by company ID
 *     tags:
 *       - Credit Request
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         description: The ID of the company for which credit requests are requested.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Credit requests not available for the specified company.
 *       '500':
 *         description: Internal server error
 */


credit_route.get(
    '/credit/get-credit-by-compnay/:companyId' ,
    auth, 
    creditRequest.getCreditByCompanyId
)

credit_route.get(
    '/credit/get-credit-by-agent/:companyId' ,
    auth, 
    creditRequest.getCreditByAgentId
)
credit_route.patch(
    '/credit/approv-reject-credit/:creditRequestId',
    auth,
    creditRequest.approveRejectCredit
);




module.exports = credit_route;