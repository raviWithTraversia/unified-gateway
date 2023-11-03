const express = require("express");
const sales_route = express();
const bodyParser = require("body-parser");
sales_route.use(bodyParser.json());
sales_route.use(bodyParser.urlencoded({extended:true}));
const salesController = require('../controllers/sales/sales.controller');
const auth = require("../middleware/auth");

/**
 * @swagger
 * /api/sales/sales-in-charge:
 *   get:
 *     tags:
 *       - SalesInCharge
 *     summary: Get Sales In Charge data by company and sales in charge name
 *     parameters:
 *       - name: companyId
 *         in: query
 *         type: string
 *         required: true
 *         description: The ID of the company for which sales in charge data is requested.
 *       - name: salesInCharge
 *         in: query
 *         type: string
 *         required: true
 *         description: The name of the sales in charge.
 *     responses:
 *       200:
 *         description: Sales in charge data found successfully
 *         schema:
 *           type: object
 *           properties:
 *             response:
 *               type: string
 *               example: "All sales in charge data fetched"
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: "12345"
 *                   userName:
 *                     type: string
 *                     example: "John Doe"
 *                   # Define other properties of the sales in charge data object here.
 *       404:
 *         description: Sales In Charge Data Not Found
 *         schema:
 *           type: object
 *           properties:
 *             response:
 *               type: string
 *               example: "No sales in charge exist"
 *       400:
 *         description: Bad Request
 *         schema:
 *           type: object
 *           properties:
 *             response:
 *               type: string
 *               example: "companyId is not valid"
 */

sales_route.get(
    '/sales/sales-in-charge/:companyId',
    // auth,
    salesController.getSalesInCharge
);

sales_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = sales_route;

