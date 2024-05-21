const express = require("express");
const smtp_route = express()
const bodyParser = require("body-parser");

smtp_route.use(bodyParser.json());
smtp_route.use(bodyParser.urlencoded({extended:false}));

const smtpController = require("../controllers/smtp/smpt.controller");
const auth = require("../middleware/auth");

/**
 * @swagger
 * /api/smtp/smtpConfig/all:
 *   get:
 *     summary: Get SMTP configurations.
 *     tags:
 *       - smtp
 *     responses:
 *       '200':
 *         description: SMTP configurations fetched successfully.
 *         content:
 *           application/json:
 *             example:
 *               response: SMTP configurations fetched successfully
 *               data: [{ yourSmtpConfigData1 }, { yourSmtpConfigData2 }, ...]
 *       '404':
 *         description: No SMTP configurations available.
 *         content:
 *           application/json:
 *             example:
 *               response: No SMTP configurations available
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               response: Internal server error
 */

smtp_route.get(
    '/smtp/smtpConfig/all',
    auth,
     smtpController.smtpConfig
    )

/**
 * @swagger
 * /api/smtp/add/smtpConfig:
 *   post:
 *     summary: Add a new SMTP configuration.
 *     tags:
 *       - SMTP
 *     requestBody:
 *       description: SMTP configuration data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define the properties of the SMTP configuration here
 *               // For example:
 *               smtpServer:
 *                 type: string
 *                 example: smtp.example.com
 *               port:
 *                 type: integer
 *                 example: 587
 *               username:
 *                 type: string
 *                 example: your_username
 *               password:
 *                 type: string
 *                 example: your_password
 *     responses:
 *       '200':
 *         description: New SMTP configuration created successfully.
 *         content:
 *           application/json:
 *             example:
 *               response: New SMTP configuration created successfully
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               response: Internal server error
 */

smtp_route.post(
    '/smtp/add/smtpConfig',
    auth,
     smtpController.addSmtpConfig
    );
   
    /**
 * @swagger
 * /api/smtp/remove/smtpConfig/{companyId}:
 *   delete:
 *     summary: Remove SMTP configured mail by companyId.
 *     tags:
 *       - SMTP
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *           description: The companyId to identify the SMTP configuration to be removed.
 *           example: your_company_id
 *     responses:
 *       '200':
 *         description: SMTP configured mail deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               response: SMTP configured mail deleted successfully
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               response: Internal server error
 */


smtp_route.delete(
    '/smtp/remove/smtpConfig',
    auth,
    smtpController.removeSmtpConfig
      
);

// smtp_route.patch(
//     '/update/smtpConfig/:companyId',
//     smtpController.updateSmtpConfig
// )

smtp_route.patch(
    '/smtp/updateSmtpConfig',
    auth,
    smtpController.updateSmtpConfig     
);


smtp_route.post('/smtp/send-mail',auth,smtpController.sendMail)

smtp_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = smtp_route;

