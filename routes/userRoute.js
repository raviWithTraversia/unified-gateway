const express = require("express");
const user_route = express();
const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

user_route.post('/register', userController.registerUser );
user_route.post('/login', userController.loginUser );
user_route.post('/userInsert', auth, userController.userInsert );



user_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = user_route;
