const express = require("express");
const user_route = express();
const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
const userController = require("../controllers/users/user.controller");
const auth = require("../middleware/auth");
//const { loginValidation } = require("../utils/validation/validation");
const userValidatior = require('../validation/user.validation');


user_route.post(
    '/register',
    userValidatior.userRegistration,
    userController.registerUser 
    );



 /**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login User
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             email: admin@traversia.net
 *             password: Ttpl@2023
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               response: Login successful
 *               data:
 *                 _id: 12345 // Replace with actual user ID
 *                 name: John Doe // Replace with actual user name
 *                 email: admin@traversia.net
 *                 phoneNumber: +1234567890 // Replace with actual phone number
 *                 token: yourAuthToken // Replace with actual token
 *       '400':
 *         description: User not found or invalid password
 *         content:
 *           application/json:
 *             example:
 *               response: User not found or Invalid password
 */

user_route.post(
    '/login',
    userValidatior.userLogin,
     userController.loginUser 
     );

/**
 * @swagger
 * paths:
 *  /api/login/phone:
 *    post:
 *      security:
 *      - bearerAuth: []
 *      summary: For admin/user login
 *      tags: [login with phone number]
 *      description: for admin or company login
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *               phoneNumber:
 *                 type: string
 *               password:
 *                  password: string  
 *      responses:
 *        "200":
 *          description: User logedin Sucessfully
 *        "401":
 *          description: user unutharized
 *        "500":
 *          description: server error
 */

  user_route.post(
     '/login/phone',
     userValidatior.userLogin,
     userController.loginUser 
    );


/**
 * @swagger
 * /api/userInsert:
 *   post:
 *     summary: User and Company
 *     tags:
 *       - User 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               parent:
 *                 type: string
 *               type:
 *                 type: string
 *               companyStatus:
 *                 type: string
 *               userType:
 *                 type: string
 *               login_Id:
 *                 type: string
 *               email:
 *                 type: string
 *               title:
 *                 type: string
 *               fname:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *               securityStamp:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               twoFactorEnabled:
 *                 type: boolean
 *               lockoutEnabled:
 *                 type: boolean
 *               accessfailedCount:
 *                 type: integer
 *               emailConfirmed:
 *                 type: boolean
 *               phoneNumberConfirmed:
 *                 type: boolean
 *               userStatus:
 *                 type: string
 *               userPanName:
 *                 type: string
 *               userPanNumber:
 *                 type: string
 *               created_Date:
 *                 type: string
 *                 format: date-time
 *               lastModifiedDate:
 *                 type: string
 *                 format: date-time
 *               userModifiedBy:
 *                 type: string
 *               last_LoginDate:
 *                 type: string
 *                 format: date-time
 *               activation_Date:
 *                 type: string
 *                 format: date-time
 *               deactivation_Date:
 *                 type: string
 *               sex:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date-time
 *               nationality:
 *                 type: string
 *               deviceToken:
 *                 type: string
 *               deviceID:
 *                 type: string
 *               user_planType:
 *                 type: integer
 *               sales_In_Charge:
 *                 type: boolean
 *               personalPanCardUpload:
 *                 type: string
 *               isNewUser:
 *                 type: boolean
 *               _id:
 *                 type: string
 *               modifiedBy:
 *                 type: string
 *               logo_URL:
 *                 type: string
 *               office_Type:
 *                 type: string
 *               cashBalance:
 *                 type: number
 *               creditBalance:
 *                 type: number
 *               incentiveBalance:
 *                 type: number
 *               fixedCreditBalance:
 *                 type: number
 *               maxCreditLimit:
 *                 type: number
 *               isAutoInvoicing:
 *                 type: boolean
 *               invoicingPackageName:
 *                 type: string
 *               planType:
 *                 type: string
 *               creditPlanType:
 *                 type: string
 *               booking_Prefix:
 *                 type: string
 *               invoicing_Prefix:
 *                 type: string
 *               invoicingTemplate:
 *                 type: string
 *               cin_number:
 *                 type: string
 *               signature:
 *                 type: string
 *               pan_Number:
 *                 type: string
 *               HSN_SAC_Code:
 *                 type: string
 *               hierarchy_Level:
 *                 type: string
 *               pan_upload:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *           example:
 *             companyName: "tarvel"
 *             parent: "6538c0314756928875840820"
 *             type: "Tmc"
 *             companyStatus: "Active"
 *             userType: "SuperAdmin2"
 *             login_Id: "SuperAdmin2"
 *             email: "admin2@traversia.net"
 *             title: "Mr."
 *             fname: "Super"
 *             lastName: "Admin"
 *             password: "$2a$10$HToZ1l1FiA4UJb353NgCtebn1UxdUnjMeqLyto3kQ/CuTFHEDJXPC"
 *             securityStamp: "security123"
 *             phoneNumber: "1234567890"
 *             twoFactorEnabled: true
 *             lockoutEnabled: true
 *             accessfailedCount: 0
 *             emailConfirmed: true
 *             phoneNumberConfirmed: true
 *             userStatus: "Active"
 *             userPanName: "Super Admin"
 *             userPanNumber: "ABCDE1234F"
 *             created_Date: "2023-10-25T07:13:41.634+00:00"
 *             lastModifiedDate: "2023-10-25T07:13:41.634+00:00"
 *             userModifiedBy: "Super Admin"
 *             last_LoginDate: "2023-10-25T07:13:41.634+00:00"
 *             activation_Date: "2023-10-25T07:13:41.634+00:00"
 *             deactivation_Date: null
 *             sex: "Male"
 *             dob: "1995-01-15T00:00:00.000+00:00"
 *             nationality: "IN"
 *             deviceToken: "sdfgd4564634536456756cvbnfg"
 *             deviceID: "sdfsdfs45334dgvd"
 *             user_planType: 1
 *             sales_In_Charge: true
 *             personalPanCardUpload: "pancard.jpg"
 *             isNewUser: false
 *             _id: "6538c030475692887584081e"
 *             modifiedBy: "Host"
 *             logo_URL: "logo_url_a.jpg"
 *             office_Type: "Host"
 *             cashBalance: 0
 *             creditBalance: 0
 *             incentiveBalance: 0
 *             fixedCreditBalance: 0
 *             maxCreditLimit: 0
 *             isAutoInvoicing: true
 *             invoicingPackageName: "Package A"
 *             planType: "Plan Type A"
 *             creditPlanType: "Credit Plan A"
 *             booking_Prefix: "Prefix A"
 *             invoicing_Prefix: "Invoice Prefix A"
 *             invoicingTemplate: "Template A"
 *             cin_number: "CIN123456"
 *             signature: "signature_url_a.jpg"
 *             pan_Number: "PAN12345"
 *             HSN_SAC_Code: "HSN123"
 *             hierarchy_Level: "Level A"
 *             pan_upload: "pan_upload_url_a.jpg"
 *             createdAt: "2023-10-25T07:13:52.869+00:00"
 *             updatedAt: "2023-10-25T07:13:52.869+00:00"
 *     responses:
 *       '200':
 *         description: User and Company inserted successfully
 *         content:
 *           application/json:
 *             example:
 *               response: User and Company Inserted successfully
 *               data:
 *                 _id: "generatedUserId"
 */



user_route.post(
    '/userInsert', 
   userValidatior.userInsert,
    userController.userInsert 
    );

    // route for forget password 
/**
 * @swagger
 * paths:
 *  /api/forgot-password:
 *    post:
 *      security:
 *      - bearerAuth: []
 *      summary: route for forget password
 *      tags: [route for forget password]
 *      description: for admin or company login
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *               phoneNumber:
 *                 type: string
 *               password:
 *                  password: string  
 *      responses:
 *        "200":
 *          description: User logedin Sucessfully
 *        "401":
 *          description: user unutharized
 *        "500":
 *          description: server error
 */

user_route.post(
    '/forgot-password',
    userValidatior.userForgetPassword,
    userController.forgotPassword
)

// route for reset password

/**
 * @swagger
 * /api/resetPassword:
 *   post:
 *     summary: Reset the user's password using a reset token.
 *     tags:
 *       - User
 *     requestBody:
 *       description: Email, reset token, and new password for password reset.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               resetToken:
 *                 type: string
 *                 example: resetTokenValue
 *               newPassword:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       '200':
 *         description: Password reset successful.
 *       '401':
 *         description: Invalid reset token.
 *       '500':
 *         description: Internal server error.
 */

user_route.post(
    '/reset-password',
    //userValidatior.userResetPassword,
    userController.resetPassword
)

user_route.get('/test', function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = user_route;

