const express = require("express");
const email_config_route = express();
const bodyParser = require("body-parser");
email_config_route.use(bodyParser.json());
email_config_route.use(bodyParser.urlencoded({extended:true}));
const emailController = require("../controllers/emailConfig/emailConfig.controller");
const auth = require("../middleware/auth.js");

email_config_route.get(
    '/email-config',
    emailController.getEmailConfig
);
email_config_route.post(
    '/add/emai-config',
    emailController.addEmailConfig
);


email_config_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});
module.exports = email_config_route;

