const express = require("express");
const user_route = express();
const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
const userController = require("../controllers/users/user.controller");
const auth = require("../middleware/auth");
const userValidatior = require('../validation/user.validation');

user_route.post(
    '/register',
    userValidatior.userRegistration,
    userController.registerUser 
    );

user_route.post(
    '/login',
    userValidatior.userLogin,
     userController.loginUser 
     );
user_route.post(
    '/userInsert', 
    auth, 
    userValidatior.userInsert,
    userController.userInsert 
    );

    // route for forget password 
user_route.post(
    '/forgot-password',
    userValidatior.userForgetPassword,
    userController.forgotPassword
)

// route for reset password
user_route.post(
    '/reset-password',
    //userValidatior.userResetPassword,
    userController.resetPassword
)



user_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = user_route;
