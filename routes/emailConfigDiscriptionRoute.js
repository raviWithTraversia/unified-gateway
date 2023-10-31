const express = require("express");
const email_config_description_route = express();
const bodyParser = require("body-parser");
email_config_description_route.use(bodyParser.json());
email_config_description_route.use(bodyParser.urlencoded({extended:true}));
const emailConfigDescriptionController = require("../controllers/emailConfigDescription/emailConfigDescription.controller");
const auth = require("../middleware/auth");

/**
 * @swagger
 * /api/emailconfigdescription/all-config:
 *   get:
 *     summary: Find All Email Configurations
 *     tags:
 *       - Email Configuration
 *     responses:
 *       '200':
 *         description: Email Configurations found successfully
 *         content:
 *           application/json:
 *             example:
 *               response: All email Config discription data retrieve successfully
 *               data:
 *                 - { emailConfigData1 }
 *                 - { emailConfigData2 }
 *                 - ...
 *       '404':
 *         description: No email config discription data found
 *         content:
 *           application/json:
 *             example:
 *               response: No email config discription data found
 */
email_config_description_route.get(
    '/emailconfigdescription/all-config',
   // auth,
    emailConfigDescriptionController.findAllEmailConfig
);

/**
 * @swagger
 * /api/emailconfigdescription/add/Config-description:
 *   post:
 *     summary: Add Email Configuration
 *     tags:
 *       - Email Configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailConfigDescription:
 *                 type: string
 *           example:
 *             emailConfigDescription: "Successfully booked travel details"
 *     responses:
 *       '200':
 *         description: Email config description is successfully created
 *         content:
 *           application/json:
 *             example:
 *               response: Email config description is successfully created
 *               data:
 *                 _id: "generatedId"
 *                 emailConfigDescription: "Successfully booked travel details"
 *       '400':
 *         description: This email config description already exists
 *         content:
 *           application/json:
 *             example:
 *               response: This email config description already exists
 */

email_config_description_route.post(
    '/emailconfigdescription/add/Config-description',
    auth,
    emailConfigDescriptionController.addEmailConfig
);

email_config_description_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = email_config_description_route;