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
 * paths:
 *  /api/login:
 *    post:
 *      security:
 *      - bearerAuth: []
 *      summary: For admin/user login
 *      tags: [login with email]
 *      description: for admin or company login
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *               email:
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
 * paths:
 *  /api/userInsert:
 *    post:
 *      security:
 *      - bearerAuth: []
 *      summary: For create new user
 *      tags: [For create new user]
 *      description: for add new admin/user
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
 *          description: new user inserted Sucessfully
 *        "401":
 *          description: user unutharized
 *        "500":
 *          description: server error
 */

// {
// "companyName",
// "parent",
// "type",
// "companyStatus",
// "modifiedBy",
// "logo_URL",
// "office_Type",
// "isAutoInvoicing",
// "invoicingPackageName",
// "planType",
// "creditPlanType",
// "booking_Prefix",
// "invoicing_Prefix",
// "invoicingTemplate",
// "cin_number",
// "signature",
// "pan_Number",
// "HSN_SAC_Code",
// "hierarchy_Level",
// "pan_upload",
// "userType",
// "login_Id",
// "email",
// "title",
// "fname",
// "lastName",
// "password",
// "securityStamp",
// "phoneNumber",
// "twoFactorEnabled",
// "lockoutEnabled",
// "emailConfirmed",
// "phoneNumberConfirmed",
// "userStatus",
// "userPanName",
// "userPanNumber",
// "created_Date",
// "lastModifiedDate",
// "userModifiedBy",
// "last_LoginDate",
// "activation_Date",
// "sex",
// "dob",
// "nationality",
// "deviceToken",
// "deviceID",
// "user_planType",
// "sales_In_Charge",
// "personalPanCardUpload"
// }
user_route.post(
    '/userInsert', 
    auth, 
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
 * paths:
 *  /api/reset-password:
 *    post:
 *      security:
 *      - bearerAuth: []
 *      summary: For reset password
 *      tags: [ For reset password ]
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
 *          description: Password reset  Sucessfully
 *        "401":
 *          description: Invalid reset token 
 *        "500":
 *          description: server error
 */

user_route.post(
    '/reset-password',
    //userValidatior.userResetPassword,
    userController.resetPassword
)


user_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = user_route;

