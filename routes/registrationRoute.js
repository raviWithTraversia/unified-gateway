const express = require("express");
const registation_route = express();
const bodyParser = require("body-parser");
registation_route.use(bodyParser.json());
registation_route.use(bodyParser.urlencoded({extended:true}));
const registrationController = require('../controllers/registration/registration.controller')
const auth = require("../middleware/auth");

/**
 * @swagger
 * /api/registration/addRegistration:
 *   post:
 *     summary: Add Registration
 *     tags:
 *       - Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: string
 *               companyName:
 *                 type: string
 *               panNumber:
 *                 type: string
 *               panName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               saleInChargeId:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               gstNumber:
 *                 type: string
 *               gstName:
 *                 type: string
 *               gstAddress:
 *                 type: string
 *               street:
 *                 type: string
 *               pincode:
 *                 type: string
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               remark:
 *                 type: string
 *               statusId:
 *                 type: string
 *           example:
 *             companyId: "12345"
 *             companyName: "Company ABC"
 *             panNumber: "PAN12345"
 *             panName: "John Doe"
 *             firstName: "John"
 *             lastName: "Doe"
 *             saleInChargeId: "67890"
 *             email: "john@example.com"
 *             mobile: "1234567890"
 *             gstNumber: "GST67890"
 *             gstName: "John's GST"
 *             gstAddress: "GST Address"
 *             street: "123 Main St"
 *             pincode: "12345"
 *             country: "Country"
 *             state: "State"
 *             city: "City"
 *             remark: "Registration remark"
 *             statusId: "98765"
 *     responses:
 *       '200':
 *         description: Registration created successfully
 *         content:
 *           application/json:
 *             example:
 *               response: New registration created successfully
 *               data:
 *                 companyId: "12345"
 *                 companyName: "Company ABC"
 *       '400':
 *         description: Bad request, missing or invalid fields
 *         content:
 *           application/json:
 *             example:
 *               response: Missing or invalid fields
 *       '409':
 *         description: Conflict, email or mobile number already exists
 *         content:
 *           application/json:
 *             example:
 *               response: Email or mobile number already exists
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               response: Internal server error
 */

registation_route.post(
    '/registration/addRegistration',
    //auth,
   registrationController.addRegistration
    );

  /**
 * @swagger
 * /api/registration/all-registration:
 *   get:
 *     summary: Get All Registrations
 *     tags:
 *       - Registration
 *     responses:
 *       '200':
 *         description: All registration data fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               response: All registration data fetched
 *               data:
 *                   companyId: "12345"
 *                   companyName: "Company ABC"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               response: Internal server error
 */
registation_route.get(
  '/registration/all-registration',
   registrationController.getAllRegistration
 );

/**
* @swagger
*   /api/registration/{companyId}:
*     get:
*       tags:
*         - Registration
*       summary: Get all registration data by company ID
*       parameters:
*         - name: companyId
*           in: path
*           type: string
*           required: true
*           description: The ID of the company for which registration data is requested.
*       responses:
*         200:
*           description: Registration data found successfully
*           schema:
*             type: object
*             properties:
*               response:
*                 type: string
*                 example: "Registration data found successfully"
*               data:
*                 type: array
*                 items:
*                   type: object
*                   # Define the properties of the registration data object here.
*         404:
*           description: Registration Data Not Found
*           schema:
*             type: object
*             properties:
*               response:
*                 type: string
*                 example: "Registration data not found by this companyId"
*/
 registation_route.get(
    '/registration/:companyId',
    registrationController.getAllRegistrationByCompany
 );



 registation_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = registation_route;
