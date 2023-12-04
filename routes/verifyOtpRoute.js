const express = require("express");
const verifyOtp_route = express();
const bodyParser = require("body-parser");
verifyOtp_route.use(bodyParser.json());
verifyOtp_route.use(bodyParser.urlencoded({extended:true}));
const verifyOtpController = require("../controllers/verifyOtp/verifyOtp.controller");
const auth = require("../middleware/auth");
const userValidatior = require('../validation/user.validation');

/**
 * @swagger
 * /api/otp/sent-otp:
 *   post:
 *     tags:
 *       - OTP
 *     summary: Send an OTP to an email address
 *     parameters:
 *       - name: email
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             typeName:
 *               type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         schema:
 *           type: object
 *           properties:
 *             response:
 *               type: string
 *               example: "Otp sent successfully to your email"
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             response:
 *               type: string
 *               example: "Internal Server Error"
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             email: "shashi10g2012@gmail.com"
 *             typeName: "johndoe@example.com"
 */


verifyOtp_route.post(
    '/otp/sentOtpEmail',
    verifyOtpController.sendEmailOtp
);

verifyOtp_route.post(
    '/otp/sentOtpPhone',
    verifyOtpController.sendPhoneOtp
);
/**
 * @swagger
 * /api/otp/verify-otp:
 *   post:
 *     tags:
 *       -  OTP
 *     summary: Verify an OTP sent to an email address
 *     parameters:
 *       - name: otp
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             otp:
 *               type: number
 *             typeName:
 *               type: string
 *     responses:
 *       200:
 *         description: Email OTP verified successfully
 *         schema:
 *           type: object
 *           properties:
 *             response:
 *               type: string
 *               example: "Email OTP verified successfully"
 *       400:
 *         description: Invalid OTP or OTP has expired
 *         schema:
 *           type: object
 *           properties:
 *             response:
 *               type: string
 *               example: "Invalid OTP or OTP has expired"
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             response:
 *               type: string
 *               example: "Internal Server Error"
 */
verifyOtp_route.post(
    '/otp/verify-otp',
    verifyOtpController.varifyOtpEmailOtp
);

verifyOtp_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = verifyOtp_route;