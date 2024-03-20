const express = require("express");
const email_config_route = express();
const bodyParser = require("body-parser");
email_config_route.use(bodyParser.json());
email_config_route.use(bodyParser.urlencoded({extended:true}));
const emailController = require("../controllers/emailConfig/emailConfig.controller");
const auth = require("../middleware/auth.js");



/**
 * @swagger
 * /api/emailconfig/getEmailConfig:companyId:
 *   get:
 *     summary: Get Email Configurations by Company ID.
 *     tags:
 *       - Email Configuration
 *     parameters:
 *       - in: path
 *         name: companyId
 *         schema:
 *           type: string
 *         required: true
 *         description: The Company ID for which to retrieve Email Configurations.
 *       - in: header
 *         name: Authorization
 *         description: Your Bearer Token
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Email Configurations fetched successfully.
 *         content:
 *           application/json:
 *             example:
 *               response: Email Configurations fetched successfully
 *               data: [{ yourEmailConfigData1 }, { yourEmailConfigData2 }, ...]
 *       '404':
 *         description: No Email Configurations found for the provided Company ID.
 *         content:
 *           application/json:
 *             example:
 *               response: No Email Configurations found for the provided Company ID
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               response: Internal Server Error
 *     securitySchemes:
 *       BearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */

// Your other Swagger definitions here


email_config_route.get(
    '/emailconfig/getEmailConfig/:companyId',
    auth,
    emailController.getEmailConfig
);


/**
 * @swagger
 * /api/emailconfig/add/emai-config:
 *   post:
 *     summary: Create a new email configuration.
 *     tags:
 *       - Email Configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: string
 *               EmailConfigDescriptionId:
 *                 type: string
 *               mailDescription:
 *                 type: string
 *               emailCc:
 *                 type: string
 *               emailBcc:
 *                 type: string
 *               smptConfigId:
 *                 type: string
 *               status:
 *                 type: boolean
 *     security:
 *       - BearerAuth: []  # Add this to require authentication
 *     responses:
 *       '200':
 *         description: New Email Configuration created successfully.
 *         content:
 *           application/json:
 *             example:
 *               response: New Email Configuration created successfully
 *               data: { YourCreatedEmailConfigObject }
 *       '400':
 *         description: Bad Request - Invalid input data.
 *         content:
 *           application/json:
 *             example:
 *               response: Bad Request
 *               data: { YourValidationErrorMessage }
 *       '401':
 *         description: Unauthorized - Bearer token is missing or invalid.
 *         content:
 *           application/json:
 *             example:
 *               response: Unauthorized
 *               data: { YourUnauthorizedMessage }
 *       '404':
 *         description: Not Found - Company ID or SMTP ID not found.
 *         content:
 *           application/json:
 *             example:
 *               response: Company ID or SMTP ID not found
 *               data: { YourNotFoundMessage }
 *       '409':
 *         description: Conflict - Email configuration already exists.
 *         content:
 *           application/json:
 *             example:
 *               response: Email config is already exist
 *               data: { YourConflictMessage }
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               response: Internal Server Error
 */



email_config_route.post(
    '/emailconfig/add/emai-config',
    auth,
    emailController.addEmailConfig
);

email_config_route.patch(
    '/getEmailConfig/upadteEmailConfig',
    auth,
    emailController.upadteEmailConfig
);

email_config_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});
module.exports = email_config_route;

