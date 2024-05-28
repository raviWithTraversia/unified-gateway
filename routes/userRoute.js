const express = require("express");
const user_route = express();
const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
const userController = require("../controllers/users/user.controller");
const auth = require("../middleware/auth");
const userValidatior = require('../validation/user.validation');
const multer =require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, "./Public/agency");
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({ storage: storage });
user_route.post(
    '/register',
    userValidatior.userRegistration,
    userController.registerUser 
    );



 /**
 * @swagger
 * /api/user/login:
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
    '/user/login',
   // userValidatior.userLogin,
     userController.loginUser 
     );

     
 /**
 * @swagger
 * /api/user/login/phone:
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
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             phoneNumber: admin@traversia.net
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
     '/user/login/phone',
     auth,
     userValidatior.userLogin,
     userController.loginUser 
    );




user_route.post(
    '/user/userInsert', 
  // userValidatior.userInsert,
   //auth,
   userController.userInsert 
    );

    // route for forget password 
/**
* @swagger
*paths:
*  /api/user/forgot-password:
*    post:
*      summary: Reset the user's password using a reset token.
*      tags:
*        - User
*      consumes:
*        - application/json
*      produces:
*        - application/json
*      parameters:
*        - in: body
*          name: requestBody
*          description: Email, reset token, and new password for password reset.
*          required: true
*          schema:
*            type: object
*            properties:
*              email:
*                type: string
*                example: user@example.com
*      responses:
*        '200':
*          description: Password reset successful.
*        '401':
*          description: Invalid reset token.
*        '500':
*          description: Internal server error

*# Example response if the user is not found (you can customize this):
*        '404':
*          description: User not found
*          schema:
*            type: object
*            properties:
*              response:
*                type: string
*                example: User not found

*# Example response if password reset email is sent successfully (you can customize this):
*        '202':
*          description: Password reset email sent
*          schema:
*            type: object
*            properties:
*              response:
*                type: string
*                example: Password reset email sent
*/

user_route.post(
    '/user/forgot-password',
    //userValidatior.userForgetPassword,
    userController.forgotPassword
)

// route for reset passsword

/**
 * @swagger
 * /api/user/resetPassword:
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
    '/user/reset-password',
    //userValidatior.userResetPassword,
    userController.resetPassword
)


  /**
 * @swagger
 * /api/user/change-password:
 *   post:
 *     summary: Change User Password
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
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *           example:
 *             email: user@example.com
 *             currentPassword: currentPassword123
 *             newPassword: newPassword456
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             example:
 *               response: Password Change Successfully
 *       '401':
 *         description: Invalid current password
 *         content:
 *           application/json:
 *             example:
 *               response: Your current password is not valid
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               response: User for this mail-id does not exist
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               response: Internal server error
 */
user_route.post(
    '/user/change-password',
    userController.changePassword
)

user_route.get(
    '/user/varifyToken',
    userController.varifyTokenForForgetPassword
);

user_route.post(
    '/user/addUser',
    auth,
    userController.addUser
)

user_route.patch(
    '/user/editUser',
    auth,
    userController.editUser
);

user_route.get(
    '/user/getUser',
    auth,
    userController.getUser
);

user_route.get(
    '/user/getAllAgencyAndDistributer',
    userController.getAllAgencyAndDistributer
)

user_route.post("/user/updateStatus",auth,userController.userStatusUpdate)

user_route.get('/get-company/profile',auth,userController.getCompanyProfle)

user_route.patch('/update/company-proflie',  (req, res, next) => {
    req.body.images = {};
  
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        let key;
  
        switch (file.fieldname) {
         
          case 'gst_URL':
            key = 'gst_URL';
            break;
          case 'panUpload_URL':
            key = 'panUpload_URL';
            break;
          case 'logoDocument_URL':
            key = 'logoDocument_URL';
            break;
          case 'signature_URL':
            key = 'signature_URL';
            break;
          case 'aadhar_URL':
            key = 'aadhar_URL';
            break;
          case 'agencyLogo_URL':
            key = 'agencyLogo_URL';
            break;
          default:
            key = `image${index + 1}`;
            break;
        }
  
        req.body.images[key] = {
          path: file.path,
          filename: file.filename
        };
      });
    }
  
    next();
  },
  upload.fields([
    { name: 'gst_URL', maxCount: 1 },
    { name: 'panUpload_URL', maxCount: 1 },
    { name: 'logoDocument_URL', maxCount: 1 },
    { name: 'signature_URL', maxCount: 1 },
    { name: 'aadhar_URL', maxCount: 1 },
    { name: 'agencyLogo_URL', maxCount: 1 },
  ]),auth,userController.updateCompayProfile)


user_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = user_route;

